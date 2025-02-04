var url = "jsp/salesHistory.jsp";
AJAX.call(url, null, function(data) {
	var json = data.trim();

	try {
		// JSON 문자열을 객체로 변환
		var jsonData = JSON.parse(json);

		// 오류 코드 구분 (status)
		var statusCode = jsonData.code;
		var message = jsonData.msg;

		// 200이 아닌 경우 오류 처리
		if (statusCode !== 200) {
			alert("오류: " + message);
			window.location.href = statusCode + ".html";
			return;
		}

		// 성공한 경우 데이터 분리
		var list = jsonData.list;

		window.onload = function() {
			checkLoginStatus(); // 로그인 상태 확인 함수
			updateSalesList(list); // 영업 목록 업데이트
		};

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

// 영업 목록 업데이트 함수
function updateSalesList(list) {
	const tbody = document.getElementById("salesList"); // <tbody> 요소 id로 선택
	tbody.innerHTML = ""; // 기존 데이터를 초기화

	// list 데이터를 기반으로 테이블 행 생성
	list.forEach(item => {
		const row = document.createElement("tr");
		row.style.textAlign = "center"; // 텍스트 중앙 정렬

		row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.date_of_birth}</td>
        <td>${item.email}</td>
        <td>${item.phone_number}</td>
        <td>${item.model}</td>
        <td>${item.price.toLocaleString()}</td>
        <td>${item.sale_date}</td>
        <td>${item.status}</td>
      `;

		tbody.appendChild(row); // 생성된 행을 <tbody>에 추가
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
