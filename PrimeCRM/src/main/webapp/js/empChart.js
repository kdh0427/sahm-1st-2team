document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

var url = "jsp/empChart.jsp";
AJAX.call(url, { branch: 'null' }, function(data) {
	var json = data.trim();
	
	try {
		// JSON 문자열을 객체로 변환
		var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장
		// 성공한 경우 데이터 분리
		var totalEmp = jsonData.totalEmp;
		var empsalesByBranch = jsonData.empsalesByBranch;
		var branches = jsonData.branches;
		var empPinX = jsonData.empPinX;
		var empPinY = jsonData.empPinY;
		var incentiveByBranch = jsonData.incentiveByBranch;
		var empByBranch = jsonData.empByBranch;
		var empListByBranch = jsonData.empListByBranch;

		console.log(empListByBranch);
		checkLoginStatus(); // 로그인 상태 확인 함수
		updateTotalEmp(totalEmp); // 총 직원 수 업데이트
		updateBarChart(branches, empsalesByBranch); // 지점별 직원 수 BarChart 업데이트
		updatePieChart(empPinX, empPinY); // 급여 구간별 직원 비율 PieChart 업데이트
		updateIncentiveTable(incentiveByBranch); // 지점별 평균 급여 순위 Table 업데이트
		updateEmployeeRankList(empByBranch); // 직급별 직원 수 List 업데이트
		updateEmpTable(empListByBranch); // 직원 목록 Table 업데이트
		
	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

document.getElementById("branch-select").addEventListener("change", function() {
    updateData(this.value);
});

function updateData(value){
	var url = "jsp/empChart.jsp";
	AJAX.call(url, { branch: value }, function(data) {
		var json = data.trim();
		
		try {
			// JSON 문자열을 객체로 변환
			var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장
			console.log(jsonData);
			// 성공한 경우 데이터 분리
			var totalEmp = jsonData.totalEmp;
			var empsalesByBranch = jsonData.empsalesByBranch;
			var branches = jsonData.branches;
			var empPinX = jsonData.empPinX;
			var empPinY = jsonData.empPinY;
			var incentiveByBranch = jsonData.incentiveByBranch;
			var empByBranch = jsonData.empByBranch;
			var empListByBranch = jsonData.empListByBranch;

			checkLoginStatus(); // 로그인 상태 확인 함수
			updateTotalEmp(totalEmp); // 총 직원 수 업데이트
			updateBarChart(branches, empsalesByBranch);
			updatePieChart(empPinX, empPinY); 
			updateIncentiveTable(incentiveByBranch);
			updateEmployeeRankList(empByBranch); // 직급별 직원 수 List 업데이트
			updateEmpTable(empListByBranch); // 지점별 직원 목록 Table 업데이트
			
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
function updateBarChart(branches, empsalesByBranch) {
	var ctx = document.getElementById("myBarChart").getContext("2d"); // canvas 요소 가져오기

	// 기존에 생성된 차트가 있다면 삭제
	if (window.myBarChart instanceof Chart) {
		window.myBarChart.destroy();
	}

	// BarChart 데이터 설정
	var chartData = {
		labels: branches, // x축 (지점 이름)
		datasets: [{
			label: '판매 대수',
			data: empsalesByBranch, // y축 (지점별 직원 수)
			backgroundColor: "rgba(2, 117, 216, 0.8)", // 막대 색상 (불투명도 조절)
			borderColor: "rgba(2, 117, 216, 1)", // 바의 테두리 색
			borderWidth: 1
		}]
	};

	// BarChart 옵션 설정
	var chartOptions = {
		responsive: true,
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true,
				}
			}]
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
function updatePieChart(empPinX, empPinY) {
    var ctx = document.getElementById("myPieChart").getContext("2d"); // canvas 요소 가져오기

    // 기존에 생성된 차트가 있다면 삭제
    if (window.myPieChart instanceof Chart) {
        window.myPieChart.destroy();
    }

    // PieChart 데이터 설정
    var chartData = {
        labels: empPinY, // x축 (지점 이름)
        datasets: [{
            label: '지점별 직원 수',
            data: empPinX, // y축 (각 지점의 직원 수)
            backgroundColor: ['#007bff', '#dc3545', '#ffc107'], // 지점별 색상
            borderColor: ['#007bff', '#dc3545', '#ffc107'], // 테두리 색상
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
function updateIncentiveTable(incentiveByBranch) {
    var tableBody = document.getElementById('salaryTableBody');
    tableBody.innerHTML = ''; // 기존 데이터를 지웁니다.

    // 순위별로 데이터를 정렬 (rank 기준이 아니라 incentive 기준 내림차순 정렬)
    incentiveByBranch.sort(function(a, b) {
        return Number(b.incentive) - Number(a.incentive);
    });

    // 정렬된 데이터를 테이블에 추가
    for (let i = 0; i < incentiveByBranch.length; i++) {
        var row = document.createElement('tr'); // 새 행 생성

        // 순위 (rank)
        var rankCell = document.createElement('td');
        rankCell.textContent = incentiveByBranch[i].rank + '위';
        row.appendChild(rankCell);

        // 직원 이름 (emp_name)
        var empNameCell = document.createElement('td');
        empNameCell.textContent = incentiveByBranch[i].emp_name;
        row.appendChild(empNameCell);

        // 인센티브 (incentive)
        var incentiveCell = document.createElement('td');
        incentiveCell.textContent = Number(incentiveByBranch[i].incentive).toLocaleString() + '원'; // 숫자 변환 후 콤마 추가
		incentiveCell.style.textAlign = "right";
        row.appendChild(incentiveCell);

        // 테이블 본문에 행 추가
        tableBody.appendChild(row);
    }
}

// 직급별 직원 수를 업데이트하는 함수
function updateEmployeeRankList(empByBranch) {
    var empRankList = document.getElementById('empRankList');
    empRankList.innerHTML = '';  // 기존 목록을 지움

    if (!empByBranch || empByBranch.length === 0) {
        var emptyMessage = document.createElement('li');
        emptyMessage.classList.add('list-group-item', 'text-muted');
        emptyMessage.textContent = '데이터가 없습니다.';
        empRankList.appendChild(emptyMessage);
        return;
    }

	for (let i = 0; i < empByBranch.length; i++) {
		var position = empByBranch[i].position;
		
		if (position === "dealer") {
			position = "딜러";
		} else if (position === "manager") {
			position = "주임";
		} else if (position === "consultant") {
			position = "과장";
		} else if (position === "senior") {
			position = "차장";
		} else if (position === "director") {
			position = "부장";
		}

		var listItem = document.createElement('li'); // 새로운 목록 항목 생성
		listItem.classList.add('list-group-item');
		listItem.textContent = position + ': ' + empByBranch[i].count + '명'; // 변환된 직급 출력
		empRankList.appendChild(listItem); // 목록에 항목 추가
	}
	// empByBranch 데이터를 기반으로 동적 목록 생성
}

// 직원 목록 테이블 업데이트 함수
var currentPage = 1;
var rowsPerPage = 10;
var empData = []; // 전체 직원 데이터 저장

function updateEmpTable(empListByBranch) {
    empData = empListByBranch; // 데이터를 전역 변수에 저장
    empData.sort((a, b) => Number(b.tincentive) - Number(a.tincentive)); // 인센티브 내림차순 정렬
    currentPage = 1; // 페이지 초기화
    displayPage(currentPage);
}

function displayPage(page) {
    var tableBody = document.getElementById("employee-list");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    var start = (page - 1) * rowsPerPage;
    var end = start + rowsPerPage;
    var paginatedData = empData.slice(start, end);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='3' class='text-center'>직원 정보가 없습니다.</td></tr>";
        return;
    }

    paginatedData.forEach((employee) => {
        var row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.empName}</td>
            <td>${employee.empPosition}</td>
            <td class="text-end">${Number(employee.tincentive).toLocaleString()} 원</td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationButtons();
}

function updatePaginationButtons() {
    var totalPages = Math.ceil(empData.length / rowsPerPage);
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
}

function goToNextPage() {
    var totalPages = Math.ceil(empData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
}


// 로그인 상태 확인 함수
function checkLoginStatus() {
    var isEmail = localStorage.getItem("email");

    if (!isEmail || isEmail === "null") {
        alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
        window.location.href = "login.html";x`x`
        return;
    }

    var emailElement = document.getElementById("uemail");
    if (emailElement) {
        emailElement.textContent = "Logged in as: " + isEmail;
        //console.log("로그인 상태입니다: " + isEmail);
    } else {
        console.warn("⚠ 'uemail' ID를 가진 요소가 없음. HTML 확인 필요!");
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
