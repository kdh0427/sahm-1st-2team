document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

var url = "jsp/custSearch.jsp";
AJAX.call(url, { Email: 'null'}, function(data) {
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

function renderTable() {
    var tableBody = document.getElementById("customerContainer");
    tableBody.innerHTML = ""; 

    if (!customerData.length) { 
        tableBody.innerHTML = "<tr><td colspan='9' class='text-center'>고객 정보가 없습니다.</td></tr>";
        return;
    }

    // 현재 페이지에 해당하는 데이터 슬라이싱
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
            <td><input type="checkbox" class="customer-select"></td>
        `;
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

// 선택된 행 수정 기능
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
    editingRow = row;

    row.querySelectorAll("td").forEach((cell, index) => {
        if (![0, 1, 2, 3, row.cells.length - 1].includes(index)) { 
            let value = cell.textContent.trim();
            cell.innerHTML = `<input type="text" class="form-control" value="${value}">`;
        }
    });
}

function deleteSelectedRow() {
    let selectedRow = document.querySelector(".customer-select:checked");

    if (!selectedRow) {
        alert("삭제할 항목을 선택하세요.");
        return;
    }

    if (!confirm("선택한 고객 정보를 삭제하시겠습니까?")) return;

    let row = selectedRow.closest("tr");
    let email = row.cells[2].textContent.trim(); // 이메일 추출

    let url = "jsp/custSearch.jsp";
    let params = { jsonstr: JSON.stringify({ email: email }) }; // JSON 요청 데이터

    AJAX.call(url, params, function (response) {
        let json = response.trim();

        try {
            let jsonData = JSON.parse(json);

            let statusCode = jsonData.code;
            let message = jsonData.msg;

            if (statusCode !== 200) {
                alert("오류: " + message);
                window.location.href = statusCode + ".html";
                return;
            }

            // 서버에서 삭제가 정상적으로 처리되었을 경우
            alert("선택한 고객 정보가 삭제되었습니다.");
            row.remove(); // 삭제된 행 제거

            // 최신 고객 목록 업데이트 (서버에서 최신 데이터를 받아와 갱신)
            updateCuTable(jsonData.updatedList); 

        } catch (e) {
            console.error("JSON 파싱 오류:", e);
            alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    });
}

// 선택된 행 수정 내용 저장 기능
function saveSelectedRow() {
    if (!editingRow) {
        alert("현재 수정 중인 행이 없습니다.");
        return;
    }

    let today = new Date().toISOString().split("T")[0]; 
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

    editingRow.cells[3].textContent = today;

    let checkboxCell = editingRow.lastElementChild;
    if (!checkboxCell.querySelector("input[type='checkbox']")) {
        checkboxCell.innerHTML = `<input type="checkbox" class="customer-select">`;
    }

    let url = "jsp/custSearch.jsp";
    let params = {
        email: email,
        updatedData: JSON.stringify(updatedData),
        updateDate: today
    };

    AJAX.call(url, params, function (response) {
        if (response.status === "success") {
            alert("수정 사항이 저장되었습니다.");
            editingRow = null;
        } else {
            alert("수정 중 오류가 발생했습니다.");
        }
    }, "POST");
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
