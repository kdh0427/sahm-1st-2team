document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

var email = localStorage.getItem("email");
var url = "jsp/salesHistory.jsp";
AJAX.call(url, { Email: email }, function(data) {
	var json = data.trim();
	try {
		// JSON 문자열을 객체로 변환
		var jsonData = JSON.parse(json);

		// 성공한 경우 데이터 분리
		var list = jsonData.list;

		checkLoginStatus(); // 로그인 상태 확인 함수
		updateSalesList(list); // 영업 목록 업데이트
	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

// 영업 목록 업데이트 함수
function updateSalesList(list) {
    const tbody = document.getElementById("salesList");
    tbody.innerHTML = ""; // 기존 데이터를 초기화

    if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">판매 기록이 없습니다.</td></tr>`;
        return;
    }

    list.forEach(item => {
        const row = document.createElement("tr");
        row.style.textAlign = "center";

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.birthDay}</td>
            <td>${item.email}</td>
            <td>${item.phone_number}</td>
            <td>${item.carName}</td>
            <td>${Number(item.car_price).toLocaleString()} 원</td>
            <td>${item.sales_date}</td>
            <td>${item.cust_status}</td>
        `;

        tbody.appendChild(row);
    });
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
