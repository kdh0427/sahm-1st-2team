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

    // 라인 차트
    var ctx1 = document.getElementById('myCustomAreaChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
    
    // 막대 차트
    var ctx2 = document.getElementById('myCustomBarChart').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: '월별 자동차 판매량',
                data: [100, 200, 150, 300, 250],
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
