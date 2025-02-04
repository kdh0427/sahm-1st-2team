document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("editRows").addEventListener("click", editSelectedRow);
	document.getElementById("saveRows").addEventListener("click", saveSelectedRow);
	document.getElementById("deleteSelected").addEventListener("click", deleteSelectedRow);

	loadCustomerData(); // 고객 데이터 불러오기
});

// 고객 데이터를 불러오는 함수
function loadCustomerData() {
	let url = "jsp/custSearch.jsp";

	AJAX.call(url, {}, function(data) {
		var json = data.trim();

		try {
			var jsonData = JSON.parse(json);

			// 오류 코드 구분 (status)
			var statusCode = jsonData.code;
			var message = jsonData.msg;

			if (statusCode !== 200) { // 200이 아닌 경우 오류 처리
				alert("오류: " + message);
				window.location.href = statusCode + ".html";
				return;
			}

			// 성공한 경우 데이터 분리
			var cuList = jsonData.cuList;

			window.onload = function() {
				checkLoginStatus(); // 로그인 상태 확인 함수
				updateCuTable(cuList); // 고객 목록 Table 업데이트
			};

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

// 선택된 하나의 행을 수정 가능하도록 변경하는 함수
let editingRow = null;

function editSelectedRow() {
	let selectedRows = document.querySelectorAll(".customer-select:checked");

	if (selectedRows.length !== 1) {
		alert("하나의 행만 선택하여 수정할 수 있습니다.");
		return;
	}

	if (editingRow) {
		alert("현재 수정 중인 행이 있습니다. 저장 후 다시 시도하세요.");
		return;
	}

	let row = selectedRows[0].closest("tr");
	editingRow = row; // 현재 수정 중인 행 저장

	row.querySelectorAll("td").forEach((cell, index) => {
		if (![0, 1, 2, 3, row.cells.length - 1].includes(index)) { // 수정 불가
			let value = cell.textContent.trim();
			cell.innerHTML = `<input type="text" class="form-control" value="${value}">`;
		}
	});
}
// 선택된 행의 수정 내용을 저장하는 함수
function saveSelectedRow() {
    if (!editingRow) {
        alert("현재 수정 중인 행이 없습니다.");
        return;
    }

    let today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식
    let email = editingRow.cells[2].textContent.trim();
    let updatedData = {};

    editingRow.querySelectorAll("td").forEach((cell, index) => {
        let input = cell.querySelector("input");

        if (input) {
            let newValue = input.value.trim();
            cell.textContent = newValue;
            updatedData[index] = newValue;
        }
    });

    // 수정 날짜 업데이트
    editingRow.cells[3].textContent = today;

    // 선택칸 유지
    let checkboxCell = editingRow.lastElementChild;
    if (!checkboxCell.querySelector("input[type='checkbox']")) {
        checkboxCell.innerHTML = `<input type="checkbox" class="customer-select">`;
    }

    // AJAX 요청으로 수정된 데이터 서버에 반영 (POST 방식)
    let url = "jsp/updateCustomer.jsp";
    let params = {
        email: email,
        updatedData: JSON.stringify(updatedData),
        updateDate: today
    };

    AJAX.call(url, params, function (response) {
        if (response.status === "success") {
            alert("수정 사항이 저장되었습니다.");
            
            // 저장 성공 후 수정 상태 초기화
            editingRow = null;
        } else {
            alert("수정 중 오류가 발생했습니다.");
        }
    }, "POST");
}

// 선택된 행을 삭제하는 함수
function deleteSelectedRow() {
	let selectedRows = document.querySelectorAll(".customer-select:checked");

	if (selectedRows.length === 0) {
		alert("삭제할 항목을 선택하세요.");
		return;
	}

	if (!confirm("선택한 고객 정보를 삭제하시겠습니까?")) return;

	selectedRows.forEach((checkbox) => {
		let row = checkbox.closest("tr");
		let email = row.cells[2].textContent.trim();

		let url = "jsp/deleteCustomer.jsp";
		let params = { email: email };

		AJAX.call(url, params, function(response) {
			if (response.status === "success") {
				row.remove();
				alert("선택한 행이 삭제되었습니다.");
			} else {
				alert("삭제 중 오류가 발생했습니다.");
			}
		});
	});
}
// 드롭다운 업데이트 함수
function updateData(option) {
	var obj = { option: option }; // 옵션 값 전달
	var params = { jsonstr: JSON.stringify(obj) };

	var url = "jsp/custChart.jsp";
	AJAX.call(url, params, function(data) {
		var json = data.trim();

		try {
			// JSON 문자열을 객체로 변환
			var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장

			// 오류 코드 구분 (status)
			var statusCode = jsonData.code;
			var message = jsonData.msg;

			if (statusCode !== 200) { // 200이 아닌 경우 오류 처리
				alert("오류: " + message);
				window.location.href = statusCode + ".html";
				return;
			}

			// 성공한 경우 데이터 분리
			var cuList = jsonData.cuList || [];

			window.onload = function() {
				checkLoginStatus(); // 로그인 상태 확인 함수
				updateCuTable(cuList); // 고객 목록 Table 업데이트
			};

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

// 고객 목록 테이블 업데이트 함수
function updateCuTable(cuList) {
	var tableBody = document.getElementById("customerContainer"); // tbody 선택
	tableBody.innerHTML = ""; // 기존 데이터 초기화

	if (!cuList.length) { // 데이터가 없는 경우 처리
		tableBody.innerHTML = "<tr><td colspan='9' class='text-center'>고객 정보가 없습니다.</td></tr>";
		return;
	}

	cuList.forEach((customer) => {
		var row = document.createElement("tr"); // 새로운 행 생성

		// 고객 정보 추가
		row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.date}</td>
			<td>${customer.email}</td>
			<td>${customer.status}</td>
			<td>${customer.update}</td>
			<td>${customer.address}</td>
			<td>${customer.phone}</td>
			<td>${customer.type}</td>
			<td><input type="checkbox" class="customer-select"></td>
        `;
		tableBody.appendChild(row); // 테이블에 추가
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
