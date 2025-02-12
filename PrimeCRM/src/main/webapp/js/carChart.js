document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

// 오늘 날짜 기준으로 현재 연도 계산
var currentYear = new Date().getFullYear();
var url = "jsp/carChart.jsp";
var startdate = currentYear + "-01";
AJAX.call(url, { date: startdate }, function(data) {
	var json = data.trim();
	try {
		// JSON 문자열을 객체로 변환
		var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장

		// 성공한 경우 데이터 분리
		var totalPurpose = jsonData.totalPurpose;
		var totalSales = jsonData.totalSales;
		var salesByBranchX = jsonData.salesByBranchX;
		var salesByBranchY = jsonData.salesByBranchY;
		var salesDistributionByTypeX = jsonData.salesDistributionByTypeY;
		var salesDistributionByTypeY = jsonData.salesDistributionByTypeX;
		var salesByType = jsonData.salesByType;
		var revenueChartX = jsonData.revenueChartX;
		var revenueChartY = jsonData.revenueChartY;

		checkLoginStatus(); // 로그인 상태 확인 함수
		setTotalPurpose(totalPurpose);
		updateTotalSales(totalSales); // 총 판매량 로드
		updateBarChart(salesByBranchX, salesByBranchY); // BarChart 로드
		updatePieChart(salesDistributionByTypeX, salesDistributionByTypeY); // PieChart 로드
		updateSalesTable(salesByType); // 상위 판매 모델 리스트 로드
		updateAreaChart(revenueChartX, revenueChartY); // AreaChart 로드
		updateSalesTarget(totalSales); // 목표 달성도 업데이트

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

// 월별, 분기별, 연간 버튼은 눌렀을 때 데이터 요청 함수

function updateData() {
	// 날짜 입력란에서 선택한 날짜 가져오기
	var startDate = document.getElementById('startDateInput').value;

	var url = "jsp/carChart.jsp";

	AJAX.call(url, { date: startDate }, function(data) {
		var json = data.trim();

		try {
			// JSON 문자열을 객체로 변환
			var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장

			// 성공한 경우 데이터 분리
			var totalSales = jsonData.totalSales;
			var salesByBranchX = jsonData.salesByBranchX;
			var salesByBranchY = jsonData.salesByBranchY;
			var salesDistributionByTypeX = jsonData.salesDistributionByTypeY;
			var salesDistributionByTypeY = jsonData.salesDistributionByTypeX;
			var salesByType = jsonData.salesByType;
			var revenueChartX = jsonData.revenueChartX;
			var revenueChartY = jsonData.revenueChartY;

			checkLoginStatus(); // 로그인 상태 확인 함수
			updateTotalSales(totalSales); // 총 판매량 로드
			updateBarChart(salesByBranchX, salesByBranchY); // BarChart 로드
			updatePieChart(salesDistributionByTypeX, salesDistributionByTypeY); // PieChart 로드
			updateSalesTable(salesByType); // 상위 판매 모델 리스트 로드
			updateAreaChart(revenueChartX, revenueChartY); // AreaChart 로드
			updateSalesTarget(totalSales);

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

// 총 판매량을 화면에 표시하는 함수
function updateTotalSales(totalSales) {
	// "totalSalesValue"라는 ID를 가진 h2 태그의 텍스트를 업데이트
	document.getElementById("totalSalesValue").textContent = totalSales.toLocaleString() + "대";
}

// 바 차트를 초기화하는 함수
function updateBarChart(salesByBranchY, salesByBranchX) {
	var ctx = document.getElementById('myBarChart').getContext('2d');

	// 기존 차트가 있으면 삭제
	if (window.myBarChart instanceof Chart) {
		window.myBarChart.destroy();
	}

	window.myBarChart = new Chart(ctx, {
		type: "bar",
		data: {
			labels: salesByBranchY, // X축 (지점명)
			datasets: [{
				label: "판매량",
				data: salesByBranchX, // Y축 (판매량 데이터)
				backgroundColor: "rgba(2, 117, 216, 0.8)", // 막대 색상 (불투명도 조절)
				borderColor: "rgba(2, 117, 216, 1)", // 막대 테두리 색상
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: true,
					position: "top"
				}
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: "판매량 (단위: 대)"
					},
				},
				x: {
					title: {
						display: true,
						text: "지점"
					}
				}
			}
		}
	});
}

// 파이 차트를 초기화하는 함수
function updatePieChart(salesDistributionByTypeX, salesDistributionByTypeY) {
	var ctx = document.getElementById('myPieChart').getContext('2d');

	// 기존 차트가 있으면 삭제
	if (window.myPieChart instanceof Chart) {
		window.myPieChart.destroy();
	}

	// 새로운 파이 차트 초기화
	window.myPieChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: salesDistributionByTypeX,
			datasets: [{
				label: ['#FF5733', '#33FF57', '#3357FF', '#F0FF33', '#FF33A1', '#FFA533', '#33FFF2', '#8A33FF', '#8B33FF'],
				data: salesDistributionByTypeY,
				backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F0FF33', '#FF33A1', '#FFA533', '#33FFF2', '#8A33FF', '#2433FF'], // 각 항목의 색상 (원하는 색상으로 변경 가능)
				borderColor: ['#FF5733', '#33FF57', '#3357FF', '#F0FF33', '#FF33A1', '#FFA533', '#33FFF2', '#8A33FF', '#2433FF'], // 각 항목의 테두리 색상
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top', // 범례의 위치 설정
				},
				tooltip: {
					callbacks: {
						label: function(tooltipItem) {
							return tooltipItem.label + ': ' + tooltipItem.raw; // 툴팁에 표시할 내용
						}
					}
				}
			}
		}
	});
}

// 상위 판매 모델 업데이트 함수
function updateSalesTable(salesData) {
	var tbody = document.getElementById("salesTableBody");

	// 기존 테이블 내용 지우기
	tbody.innerHTML = "";

	// salesData 배열을 순회하며 테이블에 추가
	salesData.forEach(car => {
		var row = `<tr>
                      <td>${car.name}</td>
                      <td>${car.sales.toLocaleString()}</td> <!-- 숫자에 콤마 추가 -->
                   </tr>`;
		tbody.innerHTML += row;
	});
}

// AreaChart를 초기화하는 함수
function updateAreaChart(revenueChartX, revenueChartY) {
	var ctx = document.getElementById("myAreaChart").getContext("2d");

	// 데이터 검증 (X축, Y축 길이 일치 확인)
	if (!Array.isArray(revenueChartX) || !Array.isArray(revenueChartY) || revenueChartX.length !== revenueChartY.length) {
		console.error("updateAreaChart: 데이터 길이가 맞지 않습니다.");
		return;
	}

	// Y축 최대값 자동 설정 (100 단위로 반올림)
	var maxY = Math.ceil(Math.max(...revenueChartX) / 100) * 100;

	// 기존 차트 삭제
	if (window.areaChart) {
		window.areaChart.destroy();
	}

	// 새로운 Area Chart 생성
	window.areaChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: revenueChartY,
			datasets: [{
				label: "달 매출",
				data: revenueChartX,
				backgroundColor: "rgba(78, 115, 223, 0.2)", // 배경색 (연한 파랑)
				borderColor: "rgba(78, 115, 223, 1)", // 선 색상 (진한 파랑)
				borderWidth: 2,
				pointRadius: 5, // 데이터 포인트 크기
				pointBackgroundColor: "rgba(78, 115, 223, 1)",
				pointBorderColor: "#fff",
				fill: true, // 아래 영역 색상 채우기
				tension: 0.3 // 부드러운 곡선
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: {
					grid: { display: false }
				},
				y: {
					beginAtZero: true,
					suggestedMax: maxY, // 최대값 자동 설정
					grid: { color: "rgba(200, 200, 200, 0.2)" },
				}
			}
		}
	});
}

function setTotalPurpose(totalPurpose) {
    var purposeElement = document.getElementById("purpose");

    if (!purposeElement) {
        console.error("목표 요소를 찾을 수 없습니다.");
        return;
    }

    purposeElement.innerText = "목표: " + totalPurpose + "대";
}

// 연간 목표 달성도 업데이트 함수
function updateSalesTarget(totalSales) {
	var progressBar = document.querySelector(".progress-bar"); // 프로그레스 바
	var targetElement = document.querySelector(".card-body p:nth-of-type(1)"); // 목표 텍스트 요소

	if (!progressBar || !targetElement) {
		console.error("목표 달성도 요소를 찾을 수 없습니다.");
		return;
	}

	// 기존 텍스트에서 숫자만 추출하여 정수 변환
	let targetSales = parseInt(targetElement.innerText.replace(/[^\d]/g, ''), 10);

	// 목표 달성률 계산 (최대 100% 제한)
	let achievementRate = Math.min(100, Math.round((totalSales / targetSales) * 100));

	// 프로그레스 바 업데이트
	progressBar.style.width = achievementRate + "%";
	progressBar.setAttribute("aria-valuenow", achievementRate);
	progressBar.innerText = achievementRate + "%";
}


function changePurpose() {
	var newPurpose = prompt("새로운 목표 값을 입력하세요:");

	if (newPurpose === null) {
	    return; // 그냥 함수 종료 (아무 동작도 하지 않음)
	}

	if (newPurpose.trim() === "" || isNaN(newPurpose)) {
	    alert("올바른 숫자를 입력하세요.");
	    return;
	}

	var url = "jsp/carChart.jsp";
	AJAX.call(url, { PurposeSale: newPurpose }, function(data) {
		var code = data.trim();
		console.log(code);
		if (code == "SU") {
			alert("목표 대수가 변경 완료되었습니다.");
			location.reload();
		} else {
			alert("목표 등록에 실패했습니다.");
		}
	});
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
	var isEmail = localStorage.getItem("email");

	if (!isEmail || isEmail === "null") {
		alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
		window.location.href = "login.html"; x`x`
		return;
	}

	if (isEmail === "admin@master") {
		document.getElementById("changepurpose").style.display = "block";
	} else {
		document.getElementById("changepurpose").style.display = "none";
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
