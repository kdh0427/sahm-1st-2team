document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

var url = "jsp/custSearch.jsp";
AJAX.call(url, { Email: 'null' }, function(data) {
	var json = data.trim();

	try {
		var jsonData = JSON.parse(json);

		// 고객 목록 업데이트
		var cuList = jsonData.cuList;

		checkLoginStatus();
		updateCuTable(cuList);

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

// 고객 목록 테이블 업데이트 함수
let currentPage = 1;
const rowsPerPage = 20;
let customerData = [];

function updateCuTable(cuList) {
	customerData = cuList; // 데이터를 전역 변수에 저장
	renderTable();
}

function filterTable() {
	let input = document.getElementById("searchInput").value.toLowerCase();
	let tableBody = document.getElementById("customerContainer");
	let rows = tableBody.getElementsByTagName("tr");

	for (let row of rows) {
		let text = row.innerText.toLowerCase();
		row.style.display = text.includes(input) ? "" : "none";
	}
}

let editingRow = null;
let isEditing = false;

// 행 클릭 시
function handleRowClick(row) {
	// 수정 중이 아니면 다른 행을 선택할 수 있도록 허용
	if (!isEditing) {
		// 같은 행을 다시 클릭하면 아무 반응 없게 처리
		if (editingRow === row) {
			return; // 같은 행을 클릭하면 아무것도 하지 않음
		}

		// 이전에 선택된 행이 있으면 원래 색상으로 되돌리기
		if (editingRow && editingRow !== row) {
			editingRow.style.backgroundColor = ""; // 원래 색으로 되돌리기
		}

		// 현재 클릭된 행을 선택하여 색상 변경
		row.style.backgroundColor = "#ffcc00";
		editingRow = row; // 현재 선택된 행으로 설정
	} else {
		// 같은 행을 다시 클릭하면 아무 반응 없게 처리
		if (editingRow === row) {
			return; // 같은 행을 클릭하면 아무것도 하지 않음
		}
		alert("현재 수정 중인 행이 있습니다. 수정 후 다시 시도하세요.");
	}
}

// 선택된 행 수정 기능
function editSelectedRow() {
	if (!editingRow) {
		alert("수정할 행을 클릭하세요.");
		return;
	}

	if (editingRow.querySelector("input")) {
		alert("이미 수정 중인 행입니다.");
		return;
	}

	editingRow.querySelectorAll("td").forEach((cell, index) => {
		if (index != 0 && index != 1 && index != 2 && index != 3 && index != editingRow.cells.length - 1) {
			let value = cell.textContent.trim();
			cell.innerHTML = `<input type="text" class="form-control" value="${value}">`;
		}

		if (index == editingRow.cells.length - 1) {
			let value = cell.textContent.trim();
			let options = ["NEW", "INQ", "VIS", "PRB"];
			let selectHTML = `<select class="form-control">`;

			options.forEach(option => {
				let selected = (option === value) ? "selected" : "";
				selectHTML += `<option value="${option}" ${selected}>${option}</option>`;
			});

			selectHTML += `</select>`;
			cell.innerHTML = selectHTML;
		}
	});

	isEditing = true;
}

// 선택된 행 수정 내용 저장 기능
function saveSelectedRow() {
	if (!editingRow) {
		alert("수정할 행을 클릭하세요.");
		return;
	}

	let today = new Date().toISOString().split("T")[0];
	let updatedData = {};
	let jsonData = {};
	let selectedValue = "";

	let select = editingRow.querySelector("select");
	if (select) {
		selectedValue = select.value.trim();
	} else {
		alert("드롭다운 값이 존재하지 않습니다.");
		return;
	}
	
	let isValid = true;

	// input 값을 저장
	editingRow.querySelectorAll("td").forEach((cell, index) => {
		let input = cell.querySelector("input");

		if (input) {
			let newValue = input.value.trim();

			// 전화번호 형식 검사 (111-1111-1111 형태로 입력된 경우만 저장)
			if (index == 5) { // 전화번호 칼럼
				let phonePattern = /^\d{3}-\d{4}-\d{4}$/;
				if (!phonePattern.test(newValue)) {
					alert("전화번호는 '111-1111-1111' 형식이어야 합니다.");
					isValid = fasle;
				}
			}

			// 회원타입 검증 ("개인" 또는 "기업"만 허용)
			if (index == 6) { // 회원타입 칼럼
				if (newValue !== "개인" && newValue !== "기업") {
					alert("회원타입은 '개인' 또는 '기업'이어야 합니다.");
					isValid = fasle;
				}
			}

			if (isValid) {
                cell.textContent = newValue;
                updatedData[index] = newValue;
            }
		} else {
			// input이 없는 셀은 그냥 텍스트로 저장
			updatedData[index] = cell.textContent.trim();
		}

		// JSON 객체 형식으로 저장 (각 필드명은 테이블 컬럼에 맞게 수정 가능)
		if (index == 0) {
			jsonData.CuName = cell.textContent.trim();
		} else if (index == 1) {
			jsonData.CuBday = cell.textContent.trim();
		} else if (index == 2) {
			jsonData.CuEmail = cell.textContent.trim();
		} else if (index == 3) {
			jsonData.CuUpdate = today;
		} else if (index == 4) {
			jsonData.CusAdd = cell.textContent.trim();
		} else if (index == 5) {
			jsonData.CuNum = cell.textContent.trim();
		} else if (index == 6) {
			let typeValue = cell.textContent.trim();

			if (typeValue == "개인") {
				jsonData.CuType = "I";
			} else if (typeValue == "기업") {
				jsonData.CuType = "C";
			}
		}
	});
	
	if (!isValid) {
        return;
    }

	// 수정일자 갱신
	editingRow.cells[3].textContent = today;

	// params 객체에 JSON 문자열로 변환한 데이터 포함
	let params = {
		jsonstr: JSON.stringify(jsonData),
		email: jsonData.CuEmail,
		cust_status: selectedValue
	};

	let url = "jsp/custSearch.jsp";
	AJAX.call(url, params, function(data) {
		var code = data.trim();

		if (code == "OK") {
			alert("수정 사항이 저장되었습니다.");
			editingRow.style.backgroundColor = "";
			isEditing = false;
			location.reload();
		} else {
			alert("수정 중 오류가 발생했습니다.");
		}
	});
}

function renderTable() {
	var tableBody = document.getElementById("customerContainer");
	tableBody.innerHTML = "";

	if (!customerData.length) {
		tableBody.innerHTML = "<tr><td colspan='9' class='text-center'>고객 정보가 없습니다.</td></tr>";
		return;
	}

	let startIndex = (currentPage - 1) * rowsPerPage;
	let endIndex = startIndex + rowsPerPage;
	let paginatedData = customerData.slice(startIndex, endIndex);

	paginatedData.forEach((customer) => {
		var row = document.createElement("tr");
		row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.bday}</td>
            <td>${customer.email}</td>
            <td>${customer.udate}</td>
            <td>${customer.address}</td>
            <td>${customer.phone}</td>
            <td>${customer.type === "I" ? "개인" : customer.type === "C" ? "기업" : "알 수 없음"}</td>
            <td>${customer.status}</td>
        `;

		// 각 행에 클릭 이벤트 추가
		row.addEventListener("click", function() {
			handleRowClick(row);
		});

		tableBody.appendChild(row);
	});

	updatePaginationControls();
}

function updatePaginationControls() {
	const totalPages = Math.ceil(customerData.length / rowsPerPage);
	document.getElementById("page-info").textContent = ` ${currentPage} / ${totalPages}  `;

	document.getElementById("prevPage").disabled = currentPage === 1;
	document.getElementById("nextPage").disabled = currentPage === totalPages || totalPages === 0;
}

// 페이지 이동 함수
function goToPrevPage() {
	if (currentPage > 1) {
		currentPage--;
		renderTable();
	}
}

function goToNextPage() {
	var totalPages = Math.ceil(customerData.length / rowsPerPage);
	if (currentPage < totalPages) {
		currentPage++;
		renderTable();
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
