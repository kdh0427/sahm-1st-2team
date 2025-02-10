document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
	fetchEmpList();
});

function fetchEmpList() {
	var url = "jsp/main.jsp";
	AJAX.call(url, null, function(data) {
		var json = data.trim();
		try {
			// JSON 문자열을 객체로 변환
			var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장
			console.log("파싱된 JSON 데이터:", jsonData);
			
			// 성공한 경우 데이터 분리
			var imageUrl = jsonData.imageUrl;
			var topPrice = jsonData.topPrice;
			var topEmp = jsonData.topEmp;
			var customer = jsonData.customer;
			
			// List 데이터
			var empList = jsonData.emplist;
			var cuList = jsonData.culist;
		
			checkLoginStatus(); // 로그인 상태 확인 함수
			loadImage(imageUrl);  // 최고의 모델 로드 함수
			displayEmpList(empList); // 에이스 top10 로드 함수
			displayTopPrice(topPrice); // 제일 비싼 거래 로드 함수
			displayTopEmp(topEmp) // 이달의 사원 로드 함수
			displayCustomer(customer); // 총 고객 수 로드 함수
			displayCuList(cuList) // 고객 분류 로드 함수

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}
// 이미지 로드 함수
function loadImage(imageUrl) {
    var imgElement = document.getElementById("dynamicImage");

    if (!imgElement) {
        console.error("Error: Image element not found!");
        return;
    }

    // 이미지 로드 오류 발생 시 기본 이미지로 변경
    imgElement.onerror = function() {
        console.warn("Failed to load image. Setting placeholder."); // 기본 이미지 경로
    };

    imgElement.src = imageUrl;  // 이미지 변경
}

// emplist를 웹 페이지에 표시하는 함수
function displayEmpList(empList) {
    if (empList && empList.length > 0) {
        var container = document.getElementById("empListContainer");
        container.innerHTML = ""; // 기존 내용 비우기

        empList.forEach(function(emp, index) {
            // 순위 배지를 생성
            var rank = document.createElement("span");
            rank.className = "badge bg-primary";

            // 순위별 크기와 색상 변경
            var fontSize, backgroundColor, icon;
            if (index === 0) {
                fontSize = "1.5rem"; // 1위 (가장 큼)
                backgroundColor = "gold"; // 금색
                icon = "👑"; // 왕관 아이콘
            } else if (index === 1) {
                fontSize = "1.3rem"; // 2위
                backgroundColor = "silver"; // 은색
                icon = "🥈"; // 은메달 아이콘
            } else if (index === 2) {
                fontSize = "1.1rem"; // 3위
                backgroundColor = "#cd7f32"; // 동색
                icon = "🥉"; // 동메달 아이콘
            } else {
                fontSize = "1rem"; // 나머지
                backgroundColor = "#007bff"; // 기본 색상
                icon = ""; // 아이콘 없음
            }

            // rank 배지 스타일 설정
            rank.style.fontSize = fontSize;
            rank.style.backgroundColor = backgroundColor;
            rank.style.display = "block"; // 아이콘과 텍스트가 수직으로 배치되도록 설정
            rank.style.textAlign = "center"; // 중앙 정렬
            rank.style.marginBottom = "10px"; // 아이콘과 텍스트 간 간격 설정
            rank.textContent = `${icon} ${index + 1}위`; // 순위 텍스트

            // 직원 항목 div 생성
            var itemDiv = document.createElement("div");
            itemDiv.className = "list-group-item d-flex justify-content-between align-items-center";
            itemDiv.style.padding = "20px"; // 아이템의 패딩을 더 크게 설정하여 높이 증가

            // 직원 정보
            var infoDiv = document.createElement("div");
            var nameElement = document.createElement("h5");
            nameElement.className = "mb-1";
            nameElement.textContent = emp.empName;
            var positionElement = document.createElement("p");
            positionElement.className = "mb-1";
            positionElement.textContent = "Position: " + emp.position;

            infoDiv.appendChild(nameElement);
            infoDiv.appendChild(positionElement);
            itemDiv.appendChild(rank);
            itemDiv.appendChild(infoDiv);

            container.appendChild(itemDiv);
        });
    } else {
        document.getElementById("empListContainer").innerHTML = "<p>직원 목록이 없습니다.</p>";
    }
}


// topPrice를 h2 요소에 표시하는 함수
function displayTopPrice(topPrice) {
	// topPrice 값이 존재할 경우에만 처리
	var priceElement = document.getElementById("topPriceContainer");
	if (topPrice) {
		// "topPriceContainer"라는 ID를 가진 h2 요소를 찾음

		// h2 요소의 내용 변경
		var formattedPrice = Number(topPrice).toLocaleString();
		priceElement.textContent = "₩ " + formattedPrice;
	} else {
		// topPrice 값이 없으면 "최고 금액 정보가 없습니다." 텍스트를 표시
		priceElement.textContent = "최고 금액 정보가 없습니다.";
	}
}

// topEmp를 h2 요소에 표시하는 함수
function displayTopEmp(topEmp) {
	// topEmp 값이 존재할 경우에만 처리
	if (topEmp) {
		// "topEmpContainer"라는 ID를 가진 h2 요소를 찾음
		var empElement = document.getElementById("topEmpContainer");
		// h2 요소의 내용 변경
		empElement.textContent = topEmp;  // topEmp 값 표시
	} else {
		// topEmp 값이 없으면 "최고의 사원 정보가 없습니다." 텍스트를 표시
		empElement.textContent = "최고의 사원 정보가 없습니다.";
	}
}

// customer 값을 p 요소에 표시하는 함수
function displayCustomer(customer) {
	// customer 값이 존재할 경우에만 처리
	if (customer) {
		// "customerContainer"라는 ID를 가진 p 요소를 찾음
		var customerElement = document.getElementById("customerContainer");

		// p 요소의 내용 변경
		customerElement.innerHTML = "현재까지 등록된 고객 수는 <strong>" + customer.toLocaleString() + "명</strong>입니다.";  // customer 값 포맷팅하여 표시
	} else {
		// customer 값이 없으면 "고객 수 정보가 없습니다." 텍스트를 표시
		var customerElement = document.getElementById("customerContainer");
		customerElement.innerHTML = "고객 수 정보가 없습니다.";
	}
}

// cuList 데이터를 테이블에 삽입하는 함수
function displayCuList(cuList) {
	// cuList가 존재하고 길이가 0보다 클 경우에만 처리
	if (cuList && cuList.length > 0) {
		var container = document.getElementById("cuListContainer"); // 'cuListContainer'라는 ID를 가진 tbody 요소 찾기

		// 기존의 내용 비우기 (새로운 데이터로 덮어쓰기 위해)
		container.innerHTML = "";

		// cuList 배열을 순회하며 각 항목을 <tr>로 생성
		cuList.forEach(function(cu) {
			// 새로운 <tr> 요소 생성
			var tr = document.createElement("tr");

			// <td> 요소 두 개 생성: basis와 percentage를 각각 넣기
			var tdBasis = document.createElement("td");
			tdBasis.textContent = cu.basis; // basis (예: 20대)

			var tdPercentage = document.createElement("td");
			tdPercentage.textContent = cu.percentage + "%"; // percentage (예: 30%)

			// <td> 요소들을 <tr>에 추가
			tr.appendChild(tdBasis);
			tr.appendChild(tdPercentage);

			// 생성된 <tr> 요소를 tbody 컨테이너에 추가
			container.appendChild(tr);
		});
	} else {

	}
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
