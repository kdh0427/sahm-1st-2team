var url = "jsp/empChart.jsp";
AJAX.call(url, function(data) {
	var json = data.trim();

	try {
		// JSON 문자열을 객체로 변환
		var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장

		// 오류 코드 구분 (status)
		var statusCode = jsonData.code;
		var message = jsonData.msg;

		if (statusCode !== 200) { // 200이 아닌 경우 오류 처리
			alert("오류: " + message);
			window.location.href = statusCode + ".html";
			return;
		}

		// 성공한 경우 데이터 분리
		var totalEmp = jsonData.totalEmp;
		var empByBranch = jsonData.empByBranch;
		var branches = jsonData.branches;
		var empBySalaryRange = jsonData.empBySalaryRange;
		var averageSalaryByBranch = jsonData.averageSalaryByBranch;
		var empByRank = jsonData.empByRank;
		var empListByBranch = jsonData.empListByBranch;

		window.onload = function() {
			checkLoginStatus(); // 로그인 상태 확인 함수
			updateTotalEmp(totalEmp); // 총 직원 수 업데이트
			updateBarChart(branches, empByBranch); // 지점별 직원 수 BarChart 업데이트
			updatePieChart(empBySalaryRange); // 급여 구간별 직원 비율 PieChart 업데이트
			updateSalaryTable(averageSalaryByBranch); // 지점별 평균 급여 순위 Table 업데이트
			updateEmployeeRankList(empByRank); // 직급별 직원 수 List 업데이트
			updateEmpTable(empListByBranch); // 지점별 직원 목록 Table 업데이트
		};

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

// 드롭다운 업데이트 함수
function updateData(option) {
	var obj = { option: option }; // 옵션 값 전달
	var params = { jsonstr: JSON.stringify(obj) };

	var url = "jsp/empChart.jsp";
	AJAX.call(url, params, function(data) {
		var json = data.trim();

		try {
			// JSON 문자열을 객체로 변환
			var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장

			// 오류 코드 구분 (status)
			var statusCode = jsonData.code;
			var message = jsonData.msg;

			if (statusCode !== 200) { // 200이 아닌 경우 오류 처리
				alert("오류: " + message);
				window.location.href = statusCode + ".html";
				return;
			}

			// 성공한 경우 데이터 분리
			var empListByBranch = jsonData.empListByBranch || [];

			window.onload = function() {
				checkLoginStatus(); // 로그인 상태 확인 함수
				updateEmpTable(empListByBranch); // 지점별 직원 목록 Table 업데이트
			};

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

// 총 직원 수 업데이트 함수
function updateTotalEmp(totalEmp) {
	var totalEmpText = document.getElementById("totalEmpText");

	if (!totalEmpText) {
		console.error("총 직원 수 요소를 찾을 수 없습니다.");
		return;
	}

	// 총 직원 수 업데이트
	totalEmpText.innerText = totalEmp.toLocaleString() + "명";
}


// 지점별 직원 수 BarChart 업데이트 함수
function updateBarChart(branches, empByBranch) {
	var ctx = document.getElementById("myBarChart").getContext("2d"); // canvas 요소 가져오기

	// 기존에 생성된 차트가 있다면 삭제
	if (window.myBarChart) {
		window.myBarChart.destroy();
	}

	// BarChart 데이터 설정
	var chartData = {
		labels: branches, // x축 (지점 이름)
		datasets: [{
			label: '직원 수',
			data: empByBranch, // y축 (지점별 직원 수)
			backgroundColor: 'rgba(54, 162, 235, 0.2)', // 바의 배경색
			borderColor: 'rgba(54, 162, 235, 1)', // 바의 테두리 색
			borderWidth: 1
		}]
	};

	// BarChart 옵션 설정
	var chartOptions = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true
			}
		}
	};

	// BarChart 생성
	window.myBarChart = new Chart(ctx, {
		type: 'bar', // 차트 타입 (막대 차트)
		data: chartData, // 차트 데이터
		options: chartOptions // 차트 옵션
	});
}

// 급여 구간별 비율 PieChart 업데이트 함수
function updatePieChart(empBySalaryRange) {
	var ctx = document.getElementById("myPieChart").getContext("2d"); // canvas 요소 가져오기

	// 기존에 생성된 차트가 있다면 삭제
	if (window.myPieChart) {
		window.myPieChart.destroy();
	}

	// PieChart 데이터 설정
	var chartData = {
		labels: ['3000만원 이하', '3000만원 ~ 5000만원', '5000만원 ~ 7000만원', '7000만원 이상'], // 급여 구간 레이블 (x축)
		datasets: [{
			label: '급여 구간별 비율',
			data: empBySalaryRange, // 급여 구간별 직원 수 (y축)
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			], // 각 구간의 색상
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			], // 각 구간의 테두리 색상
			borderWidth: 1
		}]
	};

	// PieChart 옵션 설정
	var chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			tooltip: {
				callbacks: {
					label: function(tooltipItem) {
						return tooltipItem.label + ': ' + tooltipItem.raw + '명';
					}
				}
			}
		}
	};

	// PieChart 생성
	window.myPieChart = new Chart(ctx, {
		type: 'pie', // 차트 타입 (파이 차트)
		data: chartData, // 차트 데이터
		options: chartOptions // 차트 옵션
	});
}

// 지점별 평균 급여 순위 테이블을 업데이트하는 함수
function updateSalaryTable(averageSalaryByBranch) {
	var tableBody = document.getElementById('salaryTableBody');
	tableBody.innerHTML = '';  // 기존 데이터를 지웁니다.

	// 순위별로 데이터를 정렬
	averageSalaryByBranch.sort(function(a, b) {
		return b.averageSalary - a.averageSalary; // 내림차순 정렬
	});

	// 정렬된 데이터를 테이블에 추가
	for (let i = 0; i < averageSalaryByBranch.length; i++) {
		var row = document.createElement('tr'); // 새 행을 만듭니다.

		// 순위, 지점명, 평균 급여 셀을 추가
		var rankCell = document.createElement('td');
		rankCell.textContent = (i + 1) + '위'; // 순위 표시
		row.appendChild(rankCell);

		var branchCell = document.createElement('td');
		branchCell.textContent = averageSalaryByBranch[i].branch; // 지점명
		row.appendChild(branchCell);

		var salaryCell = document.createElement('td');
		salaryCell.textContent = averageSalaryByBranch[i].averageSalary + '만원'; // 평균 급여
		row.appendChild(salaryCell);

		// 테이블 본문에 행을 추가
		tableBody.appendChild(row);
	}
}

// 직급별 직원 수를 업데이트하는 함수
function updateEmployeeRankList(empByRank) {
	var empRankList = document.getElementById('empRankList');
	empRankList.innerHTML = '';  // 기존 목록을 지웁니다.

	// 직급 이름 배열
	var ranks = ['스텝', '매니저', '디렉터'];

	// empByRank 데이터에 따라 동적으로 목록을 추가
	for (let i = 0; i < empByRank.length; i++) {
		var listItem = document.createElement('li'); // 새로운 목록 항목 생성
		listItem.classList.add('list-group-item');
		listItem.textContent = ranks[i] + ': ' + empByRank[i] + '명';  // 직급과 직원 수 표시
		empRankList.appendChild(listItem);  // 목록에 항목 추가
	}
}

// 직원 목록 테이블 업데이트 함수
function updateEmpTable(empListByBranch) {
	var tableBody = document.getElementById("employee-list"); // tbody 선택
	tableBody.innerHTML = ""; // 기존 데이터 초기화

	if (!empListByBranch.length) { // 데이터가 없는 경우 처리
		tableBody.innerHTML = "<tr><td colspan='3' class='text-center'>직원 정보가 없습니다.</td></tr>";
		return;
	}

	empListByBranch.forEach((employee) => {
		var row = document.createElement("tr"); // 새로운 행 생성

		// 직원 정보 추가
		row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.rank}</td>
            <td>${employee.salary.toLocaleString()} 원</td> 
        `;
		tableBody.appendChild(row); // 테이블에 추가
	});
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
	var isEmail = localStorage.getItem("email"); // 로컬 스토리지에서 로그인 여부 확인

	if (!isEmail) {
		alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
		window.location.href = "login.html";  // 로그인 페이지로 이동
	} else {
		// 로컬 스토리지에서 사용자 아이디 가져오기
		var userId = localStorage.getItem("userId");

		// "userId"라는 ID를 가진 div 요소를 찾음
		var userIdElement = document.getElementById("userId");
		userIdElement.textContent = userId;
		console.log("로그인 상태입니다.");
	}
}

function logout() {
	// 로컬 스토리지에서 로그인 정보 삭제
	localStorage.removeItem("email");

	// 로그아웃 상태인지 확인
	var isEmail = localStorage.getItem("email");

	if (!isEmail) {
		alert("로그아웃되었습니다."); // 로그아웃 성공
		window.location.href = "login.html"; // 로그인 페이지로 이동
	} else {
		alert("로그아웃에 실패했습니다. 다시 시도해주세요."); // 로그아웃 실패
	}
}
