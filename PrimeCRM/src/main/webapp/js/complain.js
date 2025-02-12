document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

var url = "jsp/complain.jsp";
AJAX.call(url, { inquiryId: 'null', response: 'null' }, function(data) {
	var json = data.trim();

	try {
		// JSON 문자열을 객체로 변환
		var jsonData = JSON.parse(json);

		// 성공한 경우 데이터 분리
		var comList = jsonData.comList;
		var temList = jsonData.temList;

		checkLoginStatus(); // 로그인 상태 확인 함수
		updateComList(comList); // 문의 목록 업데이트
		updateTemplateList(temList); // 템플릿 목록 업데이트

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});

let currentPage = 1;
const rowsPerPage = 10;
let inquiryData = [];

// 문의 목록을 업데이트하는 함수 (페이지네이션 추가됨)
function updateComList(comList) {
    inquiryData = comList; // 데이터를 전역 변수에 저장
    renderInquiryTable();
}

// 문의 목록 테이블을 렌더링하는 함수 (페이지별로 데이터 표시)
function renderInquiryTable() {
    const tbody = document.getElementById("inquiryTableBody");
    tbody.innerHTML = ""; // 기존 데이터 초기화
    
    let startIndex = (currentPage - 1) * rowsPerPage;
    let endIndex = startIndex + rowsPerPage;
    let paginatedData = inquiryData.slice(startIndex, endIndex);

    paginatedData.forEach((inquiry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${inquiry.email}</td>
            <td>${inquiry.name}</td>
            <td>${inquiry.type}</td>
            <td>${inquiry.date}</td>
            <td>
                <span class="badge ${inquiry.status === 'DONE' ? 'bg-success' : 'bg-warning'} text-dark rounded-pill px-3">
                    ${inquiry.status === 'DONE' ? '답변완료' : '미답변'}
                </span>
            </td>
            <td>
                <button class="btn btn-outline-info btn-sm ms-2" onclick="toggleDetails(${inquiry.id}, this)">보기</button>
            </td>
        `;
        row.style.cursor = "pointer";
        tbody.appendChild(row);

        // 숨겨진 상세 행 추가
        const detailRow = document.createElement("tr");
        detailRow.id = `detailRow${inquiry.id}`;
        detailRow.style.display = "none";
        detailRow.innerHTML = `
            <td colspan="6">
                <div class="p-3 bg-light border-start border-primary shadow-sm">
                    <p class="fw-bold">📌 문의 내용:</p>
                    <p>${inquiry.content}</p>
                </div>
                <div class="p-3 bg-light border-start border-primary shadow-sm mt-2">
                    ${inquiry.status === 'DONE' ? `
                        <p class="fw-bold">📌 답변 내용:</p>
                        <p>${inquiry.comment || inquiry.response}</p>
                    ` : `
                        <label for="responseText${inquiry.id}" class="fw-bold">📌 답변 작성:</label>
                        <textarea class="form-control mb-3" id="responseText${inquiry.id}" rows="3" placeholder="답변을 입력하세요..."></textarea>
                        <button class="btn btn-primary btn-sm mb-3" onclick="sendResponse(${inquiry.id})">답변하기</button>
                    `}
                </div>
            </td>
        `;
        tbody.appendChild(detailRow);
    });

    updatePaginationControls();
}

// 페이지네이션 UI 업데이트 함수
function updatePaginationControls() {
    const totalPages = Math.ceil(inquiryData.length / rowsPerPage);
    document.getElementById("page-info").textContent = ` ${currentPage} / ${totalPages} `;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages || totalPages === 0;
}

// 페이지 이동 함수
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderInquiryTable();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(inquiryData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderInquiryTable();
    }
}


// '보기' 버튼 클릭 시 문의 내역을 토글하는 함수
function toggleDetails(inquiryId, button) {
	const detailRow = document.getElementById(`detailRow${inquiryId}`);
	const isVisible = detailRow.style.display === "table-row"; // 현재 상세 내용이 보이는지 확인

	if (isVisible) {
		// 상세 내용 숨기기
		detailRow.style.display = "none";
		button.textContent = "보기"; // 버튼 텍스트 변경
	} else {
		// 상세 내용 보이기
		detailRow.style.display = "table-row";
		button.textContent = "접기"; // 버튼 텍스트 변경
	}
}

// 답변 전송 함수 (미답변 시 사용)
function sendResponse(inquiryId) {
    const responseText = document.getElementById(`responseText${inquiryId}`).value.trim();
    if (!responseText) {
        alert("답변을 입력하세요.");
        return;
    }

    const params = { inquiryId, response: responseText };

	AJAX.call(url, params, function(data) {
		const json = data.trim();
		console.log(json);
		try {
			if (json == "SU") {
				alert("답변이 등록되었습니다.");

				location.reload();
			} else {
				alert("답변 등록에 실패했습니다.");
			}

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다.");
		}
	});
}

// 템플릿 목록을 업데이트하는 함수
function updateTemplateList(temList) {
    const tbody = document.getElementById("templateTableBody");
    tbody.innerHTML = ""; // 기존 목록 초기화

    temList.forEach((template) => {
        // 템플릿 선택 행
        const templateRow = document.createElement("tr");
        templateRow.classList.add("clickable");
        templateRow.innerHTML = `
            <td>
                <input type="radio" class="form-check-input selectItem" 
                    name="templateSelection" value="${template.content}" 
                    data-type="${template.type}" data-content="${template.content}">
            </td>
            <td>${template.type}</td>
        `;

        // 답변 내용 행
        const answerRow = document.createElement("tr");
        answerRow.innerHTML = `
            <td colspan="2" class="bg-light p-3">
                <strong class="text-muted"></strong> ${template.content}
            </td>
        `;

        // 템플릿 선택 시 이벤트 리스너 추가
        const radioButton = templateRow.querySelector('input[type="radio"]');
        radioButton.addEventListener('change', function() {
            const type = radioButton.getAttribute('data-type');
            const content = radioButton.getAttribute('data-content');
            // 템플릿 선택 시, 유형과 템플릿 내용 업데이트
            document.getElementById("templateType").value = type;
            document.getElementById("templateAnswer").value = content;
        });

        // tbody에 추가
        tbody.appendChild(templateRow);
        tbody.appendChild(answerRow);
    });
}

let currentAction = ''; // "edit" 상태를 추적할 변수

// 템플릿 수정 함수
function editTem() {
    // 이미 수정 상태인 경우, 취소 작업
    if (currentAction === 'edit') {
        cancelTemplate('edit');
        return; // 수정 상태에서 취소된 경우 더 이상 진행하지 않음
    }

    const radioButtons = document.querySelectorAll('input[name="templateSelection"]:checked');
    
    if (radioButtons.length === 0) {
        alert("수정할 템플릿을 선택하세요.");
        return;  
    }
	
    const selectedTemplateContent = radioButtons[0].value; 
    const templateForm = document.getElementById('templateForm'); 
    const editTemplateBtn = document.getElementById('editTemplateBtn'); 
 
    // 템플릿 폼에 기존 값 채우기 
    document.getElementById('templateAnswer').value = selectedTemplateContent; 
 
    // 수정 상태로 표시 
    templateForm.style.display = 'block'; // 폼을 보이게 설정
    editTemplateBtn.innerHTML = '<i class="fas fa-times-circle me-1"></i> 취소'; // 수정 버튼이 취소로 바뀌기
 
    currentAction = 'edit';  // 수정 상태로 변경 
 
    // 추가 상태일 때, 그 상태를 취소
    if (currentAction === 'add') { 
        cancelTemplate('add'); // 추가 상태 취소
    }
}

// 취소 버튼 클릭 시, 템플릿 폼을 숨기고 원래 상태로 돌아가기
function cancelTemplate(action) { 
    const templateForm = document.getElementById('templateForm'); 
    const editTemplateBtn = document.getElementById('editTemplateBtn'); 

    templateForm.style.display = 'none';  // 폼 숨기기 

    // 취소된 액션에 따라 버튼 상태 변경 
    if (action === 'edit') { 
        editTemplateBtn.innerHTML = '<i class="fas fa-edit me-1"></i> 수정'; // '수정' 버튼 상태로 돌아가기 
    }

    // 라디오 버튼 초기화
    const radioButtons = document.querySelectorAll('input[name="templateSelection"]'); 
    radioButtons.forEach((button) => button.checked = false); 

    currentAction = ''; // 상태 초기화
}

function temEdit() {
	var url = "jsp/template.jsp";
	const ans = document.getElementById('templateAnswer').value;
	const type = document.getElementById('templateType').value;
	
	var params = { template: ans, type: type};
	AJAX.call(url, params, function(data){
		var json = data.trim();

		try {
			// JSON 문자열을 객체로 변환
			if (json == "SU") {
				alert("템플릿이 수정되었습니다.");
			} else {
				alert("템플릿 수정에 실패했습니다.");
			}

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
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

	if (isEmail === "admin@master") {
		document.getElementById("templateB").style.display = "block";
	} else {
		document.getElementById("templateB").style.display = "none";
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
