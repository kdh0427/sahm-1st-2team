var jsonData;  // 전역 변수로 jsonData를 선언

var url = "jsp/main.jsp";
AJAX.call(url, function(data) {
	var json = data.trim();

	try {
		// JSON 문자열을 객체로 변환
		jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장

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
		// 성공한 경우 데이터 분리
		var topPrice = jsonData.data.topPrice;
		var topEmp = jsonData.data.topEmp;
		var customer = jsonData.data.customer;

		// List 데이터
		var empList = jsonData.data.emplist;
		var cuList = jsonData.data.culist;

		// 이미지 URL
		var imageUrl = jsonData.data.imageUrl;

		window.onload = function() {
			checkLoginStatus(); // 로그인 상태 확인 함수
			loadImage(imageUrl);  // 최고의 모델 로드 함수
			displayEmpList(empList); // 에이스 top10 로드 함수
			displayTopPrice(topPrice); // 제일 비싼 거래 로드 함수
			displayTopEmp(topEmp) // 이달의 사원 로드 함수
			displayCustomer(customer); // 총 고객 수 로드 함수
			displayCuList(cuList) // 고객 분류 로드 함수
		};

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

// 이미지 로드 함수
function loadImage(imageUrl) {
	var imgElement = document.getElementById("dynamicImage");  // 이미지 요소를 찾기
	imgElement.src = imageUrl;  // 이미지 URL을 src에 할당하여 이미지를 표시
}

// emplist를 웹 페이지에 표시하는 함수
function displayEmpList(empList) {
	// empList가 빈 배열이 아니면 처리
	if (empList && empList.length > 0) {
		var container = document.getElementById("empListContainer"); // 'empListContainer' div 요소 찾기

		// 기존의 내용 비우기 (새로운 데이터로 덮어쓰기 위해)
		container.innerHTML = "";

		// empList 배열을 순회하며 각 항목을 list-group-item으로 생성
		empList.forEach(function(emp, index) {
			// 직원 순위를 나타낼 span 요소
			var rank = document.createElement("span");
			rank.className = "badge bg-primary";
			rank.textContent = (index + 1) + "위";  // 1위, 2위, 3위 등

			// 직원 정보를 담을 div 요소
			var itemDiv = document.createElement("div");
			itemDiv.className = "list-group-item d-flex justify-content-between align-items-center";

			// 직원 이름과 직책을 담을 div 요소
			var infoDiv = document.createElement("div");
			var nameElement = document.createElement("h5");
			nameElement.className = "mb-1";
			nameElement.textContent = emp.name; // 직원 이름
			var positionElement = document.createElement("p");
			positionElement.className = "mb-1";
			positionElement.textContent = "Position: " + emp.position; // 직원 직책

			// 직원 정보 추가
			infoDiv.appendChild(nameElement);
			infoDiv.appendChild(positionElement);

			// 순위와 정보 div를 하나로 합침
			itemDiv.appendChild(rank);
			itemDiv.appendChild(infoDiv);

			// 생성된 list-group-item을 container에 추가
			container.appendChild(itemDiv);
		});
	} else {

	}
}

// topPrice를 h2 요소에 표시하는 함수
function displayTopPrice(topPrice) {
	// topPrice 값이 존재할 경우에만 처리
	if (topPrice) {
		// "topPriceContainer"라는 ID를 가진 h2 요소를 찾음
		var priceElement = document.getElementById("topPriceContainer");

		// h2 요소의 내용 변경
		priceElement.textContent = "₩ " + topPrice.toLocaleString();  // topPrice 값 포맷팅하여 표시
	} else {
		// topPrice 값이 없으면 "최고 금액 정보가 없습니다." 텍스트를 표시
		var priceElement = document.getElementById("topPriceContainer");
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
		var empElement = document.getElementById("topEmpContainer");
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
			tdPercentage.textContent = cu.percentage; // percentage (예: 30%)

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
	var isLoggedIn = localStorage.getItem("isLoggedIn"); // 로컬 스토리지에서 로그인 여부 확인

	if (!isLoggedIn) {
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");

    // 로그아웃 상태인지 확인
    var isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        alert("로그아웃되었습니다."); // 로그아웃 성공
        window.location.href = "login.html"; // 로그인 페이지로 이동
    } else {
        alert("로그아웃에 실패했습니다. 다시 시도해주세요."); // 로그아웃 실패
    }
}

