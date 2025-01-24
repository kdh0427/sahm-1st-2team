window.onload = function() {
	// 기본 차트 숨기기
	var basicCharts = document.getElementById('basicCharts');
	if (basicCharts) {
		basicCharts.style.display = 'none';  // 기본 차트를 숨김
	}

	// 내가 만든 차트 표시
	var myCharts = document.getElementById('myCharts');
	if (myCharts) {
		myCharts.style.display = 'block';  // 내가 만든 차트 표시
	}

	// 오늘 날짜 가져오기
	var today = new Date();

	// 7일 전까지의 날짜를 배열에 넣기
	var labels = [];
	for (var i = 6; i >= 0; i--) {
		var date = new Date(today);
		date.setDate(today.getDate() - i);  // 오늘 날짜에서 i일 빼기
		labels.push(date.toLocaleDateString());  // YYYY-MM-DD 형태로 저장
	}

	// 라인 차트
	var ctx1 = document.getElementById('myCustomAreaChart').getContext('2d');
	new Chart(ctx1, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: '자동차 판매 추이',
				data: [100, 200, 150, 300, 250, 400, 350],
				backgroundColor: 'rgba(2, 117, 216, 0.2)',
				borderColor: 'rgba(2, 117, 216, 1)',
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	});

	// 현재 날짜 기준으로 5달 전까지 계산
    var today = new Date();
    var currentMonth = today.getMonth();  // 0: January, 11: December
    var currentYear = today.getFullYear();

    // 5개월 전부터 현재까지의 월 계산
    var months = [];
    var salesData = [];  // 각 달에 대한 판매량 데이터 (예시)

    // 월 이름 배열 (예: 'January', 'February', 'March' 등)
    var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    for (var i = 0; i < 5; i++) {  // 이번 달을 포함하여 5개월 (0부터 4까지)
        var month = currentMonth - i;
        var year = currentYear;

        if (month < 0) {  // 12월 이전이라면, 연도를 하나 줄이고, 월을 11로 설정
            month += 12;
            year--;
        }

        // month 배열에 해당 월 이름을 추가
        months.unshift(monthNames[month]);  // 월 이름은 배열에 앞에 추가
        salesData.unshift(Math.floor(Math.random() * 500) + 100);  // 예시 데이터 (랜덤 판매량)
    }

    // 막대 차트
    var ctx2 = document.getElementById('myCustomBarChart').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: months,  // 계산된 5개월 전부터 현재까지의 달 이름을 x축에 설정
            datasets: [{
                label: '월별 자동차 판매량',
                data: salesData,  // 각 달에 해당하는 판매량 데이터
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};
