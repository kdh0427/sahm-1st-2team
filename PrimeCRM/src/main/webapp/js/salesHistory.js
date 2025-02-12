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

		list = list.filter(item => item !== null && item !== undefined);
		
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
	console.log(tbody);
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
			<td><input type="checkbox" class="customer-select"></td>
        `;

        tbody.appendChild(row);
    });
}

function showAlarmModal() {
	let selectedRow = document.querySelector(".customer-select:checked");

	if (!selectedRow) {
		alert("고객을 선택해주세요.");
		return;
	}

	var myModal = new bootstrap.Modal(document.getElementById('alarmModal'), {
		keyboard: true
	});
	myModal.show();
}

function openCustomerModal() {
	let customerModal = new bootstrap.Modal(document.getElementById('customerModal'));
	customerModal.show();
}

document.getElementById('alarmModal').addEventListener('hidden.bs.modal', function() {
	location.reload(); // 새로고침
});

function convertPriceToKorean() {
	let price = document.getElementById("carPrice").value;
	let priceText = numberToKorean(price);
	document.getElementById("priceInKorean").innerText = price ? `${priceText}` : "";
}

function numberToKorean(number) {
	if (!number) return "";

	const units = ["", "만", "억", "조", "경"];
	const nums = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
	let result = "";
	let unitIndex = 0;

	while (number > 0) {
		let part = number % 10000;
		number = Math.floor(number / 10000);

		let partText = "";
		let digit = part;
		let pos = 0;

		while (digit > 0) {
			let num = digit % 10;
			if (num > 0) {
				partText = nums[num] + (pos > 0 ? ["십", "백", "천"][pos - 1] : "") + partText;
			}
			digit = Math.floor(digit / 10);
			pos++;
		}

		if (part > 0) {
			result = partText + units[unitIndex] + " " + result;
		}

		unitIndex++;
	}

	return result.trim() + " 원";
}

function CustomerPurchase(){
	var emp = localStorage.getItem("email");
	
	var email = $("#customerEmail").val().trim();
	if (email == "") {
		alert("이메일을 입력해 주세요.");
		$("#customerEmail").focus();
		return;
	}

	var price= $("#carPrice").val().trim();
	if (price == "") {
		alert("가격을 입력해 주세요.");
		$("#carPrice").focus();
		return;
	}

	var saledate = $("#purchaseDate").val().trim();
	if (saledate == "") {
		alert("날짜를 선택해 주세요.");
		$("#purchaseDate").focus();
		return;
	}
	
	var model = $("#carModel").val().trim();

	var type = $("#carType").val().trim();

	var url = "jsp/purRegister.jsp";
	var obj = { Sale_date: saledate, Car_price: price };
	var params = { EmpID: emp, Email: email, Model: model, Type: type , jsonstr: JSON.stringify(obj)};
	AJAX.call(url, params, function(data){
		var code = data.trim();
		if (code == "SU") {
			alert("고객의 구매 정보를 등록했습니다.");
			location.reload();
		} else {
			alert("구매 정보 등록에 실패했습니다.");
		}
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
