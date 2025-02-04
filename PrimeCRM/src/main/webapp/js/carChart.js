document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

var url = "jsp/carChart.jsp";
AJAX.call(url, { month: "0"}, function(data) {
	var json = data.trim();

	try {
		// JSON 문자열을 객체로 변환
		var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장
		/*
				// 오류 코드 구분 (status)
				var statusCode = jsonData.code;
				var message = jsonData.msg;
		
				if (statusCode == 500) {
					alert("오류: " + message);  // 사용자에게 오류 메시지 알림
					window.location.href = "500.html";
					return;  // 오류 발생 시, 더 이상 진행하지 않음
				}
				if (statusCode == 404) {
					alert("오류: " + message);  // 사용자에게 오류 메시지 알림
					window.location.href = "404.html";
					return;  // 오류 발생 시, 더 이상 진행하지 않음
				}
				if (statusCode == 401) {
					alert("오류: " + message);  // 사용자에게 오류 메시지 알림
					window.location.href = "401.html";
					return;  // 오류 발생 시, 더 이상 진행하지 않음
				}
		*/
		// 성공한 경우 데이터 분리
		var totalSales = jsonData.totalSales;
//		var salesByBranchX = jsonData.salesByBranchX;
//		var salesByBranchY = jsonData.alesByBranchY;
//		var salesDistributionByTypeX = jsonData.salesDistributionByType;
//		var salesDistributionByTypeY = jsonData.salesDistributionByType;
//		var salesByType = jsonData.salesByType;
//		var revenueChartX = jsonData.revenueChart;
//		var revenueChartY = jsonData.revenueChart;

		checkLoginStatus(); // 로그인 상태 확인 함수
		updateTotalSales(totalSales); // 총 판매량 로드
//		updateBarChart(salesByBranchX, salesByBranchY); // BarChart 로드
//		updatePieChart(salesDistributionByTypeX, salesDistributionByTypeY); // PieChart 로드
//		updateSalesTable(salesByType); // 상위 판매 모델 리스트 로드
//		updateAreaChart(revenueChartX, revenueChartY); // AreaChart 로드
		updateSalesTarget(totalSales); // 목표 달성도 업데이트

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

// 월별, 분기별, 연간 버튼은 눌렀을 때 데이터 요청 함수
function updateData(period, clickedButton) {
	var pe = period;
	var url = "jsp/carChart.jsp";
	AJAX.call(url, { month: pe }, function(data) {
		var json = data.trim();
		console.log(json);
		
		try {
			// JSON 문자열을 객체로 변환
			var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장
/*
			// 오류 코드 구분 (status)
			var statusCode = jsonData.code;
			var message = jsonData.msg;

			if (statusCode == 500) {
				alert("오류: " + message);  // 사용자에게 오류 메시지 알림
				window.location.href = "500.html";
				return;  // 오류 발생 시, 더 이상 진행하지 않음
			}
			if (statusCode == 404) {
				alert("오류: " + message);  // 사용자에게 오류 메시지 알림
				window.location.href = "404.html";
				return;  // 오류 발생 시, 더 이상 진행하지 않음
			}
			if (statusCode == 401) {
				alert("오류: " + message);  // 사용자에게 오류 메시지 알림
				window.location.href = "401.html";
				return;  // 오류 발생 시, 더 이상 진행하지 않음
			}
*/
			// 성공한 경우 데이터 분리
			var totalSales = jsonData.totalSales;
//			var salesByBranchX = jsonData.data.salesByBranchX;
//			var salesByBranchY = jsonData.data.salesByBranchY;
//			var salesDistributionByTypeX = jsonData.data.salesDistributionByType;
//			var salesDistributionByTypeY = jsonData.data.salesDistributionByType;
//			var salesByType = jsonData.data.salesByType;
//			var revenueChartX = jsonData.data.revenueChart;
//			var revenueChartY = jsonData.data.revenueChart;

			checkLoginStatus(); // 로그인 상태 확인 함수
			updateTotalSales(totalSales); // 총 판매량 로드
//			updateBarChart(salesByBranchX, salesByBranchY); // BarChart 로드
//			updatePieChart(salesDistributionByTypeX, salesDistributionByTypeY); // PieChart 로드
//			updateSalesTable(salesByType); // 상위 판매 모델 리스트 로드
//			updateAreaChart(revenueChartX, revenueChartY); // AreaChart 로드
			updateSalesTarget(totalSales);

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});

	// 기존의 파란색 버튼 찾아서 회색으로 변경
	var activeButton = document.querySelector(".ms-auto .btn-primary");
	if (activeButton) {
		activeButton.classList.remove("btn-primary");
		activeButton.classList.add("btn-secondary");
	}

	// 클릭된 버튼을 파란색으로 변경
	clickedButton.classList.remove("btn-secondary");
	clickedButton.classList.add("btn-primary");
}

// 총 판매량을 화면에 표시하는 함수
function updateTotalSales(totalSales) {
	// "totalSalesValue"라는 ID를 가진 h2 태그의 텍스트를 업데이트
	document.getElementById("totalSalesValue").textContent = totalSales.toLocaleString() + "대";
}

// 바 차트를 초기화하는 함수
function updateBarChart(salesByBranchX, salesByBranchY) {
	var ctx = document.getElementById('myBarChart').getContext('2d');

	// 기존 차트가 있으면 삭제
	if (window.myBarChart) {
		window.myBarChart.destroy();
	}

	// 새로운 바 차트 초기화
	window.myBarChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: salesByBranchY,
			datasets: [{
				label: '판매량',
				data: salesByBranchX,
				backgroundColor: 'rgba(54, 162, 235, 0.2)',
				borderColor: 'rgba(54, 162, 235, 1)',
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					display: true,
					position: 'top'
				}
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: "판매량 (단위: 대)"
					}
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
	if (window.myPieChart) {
		window.myPieChart.destroy();
	}

	// 새로운 파이 차트 초기화
	window.myPieChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: salesDistributionByTypeY,
			datasets: [{
				label: '판매 분포',
				data: salesDistributionByTypeX,
				backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F0FF33', '#FF33A1'], // 각 항목의 색상 (원하는 색상으로 변경 가능)
				borderColor: ['#FF5733', '#33FF57', '#3357FF', '#F0FF33', '#FF33A1'], // 각 항목의 테두리 색상
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
function updateSalesTable(salesByType) {
	var tbody = document.getElementById("salesTableBody");

	// 기존 테이블 내용 지우기
	tbody.innerHTML = "";

	// salesByType 객체를 순회하며 테이블에 추가
	Object.entries(salesByType).forEach(([model, sales]) => {
		var row = `<tr>
                      <td>${model}</td>
                      <td>${sales.toLocaleString()}</td> <!-- 숫자에 콤마 추가 -->
                   </tr>`;
		tbody.innerHTML += row;
	});
}

// AreaChart를 초기화하는 함수
function updateAreaChart(revenueChartX, revenueChartY) {
	var ctx = document.getElementById("myAreaChart").getContext("2d");

	// 기존 차트가 있다면 삭제
	if (window.areaChart) {
		window.areaChart.destroy();
	}

	// 새로운 Area Chart 생성
	window.areaChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: revenueChartY,
			datasets: [{
				label: "매출 성장률",
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
					grid: { color: "rgba(200, 200, 200, 0.2)" }
				}
			}
		}
	});
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

// 로그인 상태 확인 함수
function checkLoginStatus() {
    var isEmail = localStorage.getItem("email");

    if (!isEmail || isEmail === "null") {
        alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
        window.location.href = "login.html";
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
