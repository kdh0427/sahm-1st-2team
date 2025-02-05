document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100); // 100ms 대기 후 실행
});

var url = "jsp/complain.jsp";
AJAX.call(url, null, function(data) {
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



// 문의 목록을 동적으로 생성하는 함수
function updateComList(comList, temList) {
	const tbody = document.getElementById("inquiryTableBody");
	tbody.innerHTML = ""; // 기존 내용 초기화

	comList.forEach((inquiry) => {
		const row = document.createElement("tr");
		row.innerHTML = `
            <td>${inquiry.email}</td>
            <td>${inquiry.name}</td>
            <td>${inquiry.type}</td>
            <td>${inquiry.date}</td>
            <td>
                <span class="badge ${inquiry.status === 'DONE' ? '답변' : 'bg-warning'} text-dark rounded-pill px-3">
                    ${inquiry.status === 'DONE' ? '답변' : '미답변'}
                </span>
            </td>
            <td>
				<button class="btn btn-outline-info btn-sm ms-2" onclick="toggleDetails(${inquiry.id}, this)">보기</button>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteInquiry(${inquiry.id})">삭제</button>              
            </td>
        `;
		row.style.cursor = "pointer"; // 클릭 가능하도록 설정
		tbody.appendChild(row);

		// 상세 내용을 위한 빈 행 추가 (보기 버튼 클릭 시 내용이 보이도록)
		const detailRow = document.createElement("tr");
		detailRow.id = `detailRow${inquiry.id}`;
		detailRow.style.display = "none"; // 기본적으로 숨김
		detailRow.innerHTML = `
            <td colspan="6">
                <div class="p-3 bg-light border-start border-primary shadow-sm">
                    <p class="fw-bold">📌 문의 내용:</p>
                    <p>${inquiry.content}</p>
                </div>
                <div class="p-3 bg-light border-start border-primary shadow-sm mt-2"> <!-- mt-3으로 위쪽 여백 추가 -->
                    <!-- 미답변인 경우에만 답변 작성란과 버튼 추가 -->
                    ${inquiry.status === 'DONE' ? `
                        <p class="fw-bold">📌 답변 내용:</p>
                        <p>${inquiry.response}</p>
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
	const responseText = document.getElementById(`responseText${inquiryId}`).value;
	if (!responseText.trim()) {
		alert("답변을 입력하세요.");
		return;
	}

	// 서버로 전송할 데이터 준비
	const params = {
		jsonstr: JSON.stringify({
			inquiryId: inquiryId,
			response: responseText
		})
	};

	// 서버에 답변 전송
	var url = "jsp/complain.jsp";
	AJAX.call(url, params, function(data) {
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

			// 성공한 경우 상태 변경 및 문의 목록 갱신
			alert("답변이 전송되었습니다.");

			// comList에서 해당 문의의 상태를 '답변'으로 업데이트
			const updatedInquiry = comList.find(inquiry => inquiry.id === inquiryId);
			if (updatedInquiry) {
				updatedInquiry.status = "DONE"; // 상태를 '답변'으로 변경
				updatedInquiry.response = responseText; // 답변 내용 추가
			}

			// 문의 목록 갱신
			updateComList(comList, temList);

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}


// 답변 전송 함수 (미답변 시 사용)
function sendResponse(inquiryId) {
	const responseText = document.getElementById(`responseText${inquiryId}`).value;
	if (!responseText.trim()) {
		alert("답변을 입력하세요.");
		return;
	}

	// 서버로 전송할 데이터 준비
	const params = {
		jsonstr: JSON.stringify({
			inquiryId: inquiryId,
			response: responseText
		})
	};

	// 서버에 답변 전송
	var url = "jsp/complain.jsp";
	AJAX.call(url, params, function(data) {
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

			// 성공한 경우 상태 변경 및 문의 목록 갱신
			alert("답변이 전송되었습니다.");

			// comList에서 해당 문의의 상태를 '답변'으로 업데이트
			const updatedInquiry = comList.find(inquiry => inquiry.id === inquiryId);
			if (updatedInquiry) {
				updatedInquiry.status = "DONE"; // 상태를 '답변'으로 변경
				updatedInquiry.response = responseText; // 답변 내용 추가
			}

			// 문의 목록 갱신
			updateComList(comList, temList);

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}


// 문의 삭제 함수
function deleteInquiry(inquiryId) {
	if (confirm("해당 문의를 삭제하시겠습니까?")) {
		const index = comList.findIndex(inquiry => inquiry.id === inquiryId);
		if (index !== -1) {
			comList.splice(index, 1); // 해당 ID 삭제
			updateComList(); // 화면 갱신
		}

		// 서버에 삭제 요청을 보낼 데이터를 준비
		const params = { jsonstr: JSON.stringify({ id: inquiryId }) }; // 삭제할 문의 ID를 포함한 객체

		var url = "jsp/complain.jsp";
		AJAX.call(url, params, function(data) {
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

				// 성공한 경우 템플릿 목록 갱신
				alert("문의가 삭제되었습니다.");
				updateComList(jsonData.comList);  // 새로운 문의 목록으로 화면 갱신

			} catch (e) {
				console.error("JSON 파싱 오류:", e);
				alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
			}
		});
	}
}

// 답변 전송 함수
function sendResponse(inquiryId) {
	const responseText = document.getElementById(`responseText${inquiryId}`).value;
	if (!responseText.trim()) {
		alert("답변을 입력하세요.");
		return;
	}

	// 서버로 전송할 데이터 준비
	const params = {
		jsonstr: JSON.stringify({
			inquiryId: inquiryId,
			response: responseText
		})
	};

	// 서버에 답변 전송
	var url = "jsp/complain.jsp";
	AJAX.call(url, params, function(data) {
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

			// 성공한 경우 상태 변경 및 문의 목록 갱신
			alert("답변이 전송되었습니다.");

			// comList에서 해당 문의의 상태를 '답변'으로 업데이트
			const updatedInquiry = comList.find(inquiry => inquiry.id === inquiryId);
			if (updatedInquiry) {
				updatedInquiry.status = "답변"; // 상태를 '답변'으로 변경
			}

			// 문의 목록 갱신
			updateComList();

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

// 템플릿 목록을 업데이트하는 함수
function updateTemplateList(temList) {
	const tbody = document.getElementById("templateTableBody");
	tbody.innerHTML = ""; // 기존 목록 초기화

	temList.forEach((template) => {
		const rowId = `answer${template.id}`;

		// 템플릿 선택 행
		const templateRow = document.createElement("tr");
		templateRow.classList.add("clickable");
		templateRow.setAttribute("data-bs-toggle", "collapse");
		templateRow.setAttribute("data-bs-target", `#${rowId}`);
		templateRow.setAttribute("aria-expanded", "false");
		templateRow.setAttribute("aria-controls", rowId);
		templateRow.innerHTML = `
            <td>
                <input type="radio" class="form-check-input selectItem" 
                    name="templateSelection" value="${template.content}">
            </td>
            <td>${template.type}</td>
        `;

		// 답변 내용 행
		const answerRow = document.createElement("tr");
		answerRow.id = rowId;
		answerRow.classList.add("collapse");
		answerRow.innerHTML = `
            <td colspan="2" class="bg-light p-3">
                <strong class="text-muted"></strong> ${template.content}
            </td>
        `;

		// tbody에 추가
		tbody.appendChild(templateRow);
		tbody.appendChild(answerRow);
	});
}

// 템플릿 추가 함수
function addTem() {
	// 요소 가져오기
	const templateType = document.getElementById("templateType");
	const templateAnswer = document.getElementById("templateAnswer");

	// 입력된 값을 가져오기
	const templateTypeValue = templateType.value.trim();
	const templateAnswerValue = templateAnswer.value.trim();

	// 제목과 내용이 비어 있는지 확인
	if (templateTypeValue === "" || templateAnswerValue === "") {
		alert("제목과 답변 내용을 모두 입력해 주세요.");
		return; // 값이 없으면 함수 종료
	}

	var temobj = { type: templateTypeValue, content: templateAnswerValue };
	var params = { jsonstr: JSON.stringify(temobj) };

	var url = "jsp/complain.jsp";
	AJAX.call(url, params, function(data) {
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

			// 성공한 경우 템플릿 목록 갱신
			alert("템플릿이 추가되었습니다.");
			updateTemplateList(jsonData.temList);  // 새로운 템플릿 목록으로 업데이트

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

// 템플릿 삭제 함수
function deleteTem() {
	const selectedTemplateRadio = document.querySelector('input[name="templateSelection"]:checked');

	if (!selectedTemplateRadio) {
		alert("삭제할 템플릿을 선택해 주세요.");
		return;
	}

	const selectedContent = selectedTemplateRadio.value;

	// temList에서 선택된 템플릿을 찾아 id 가져오기
	const selectedTemplate = temList.find(template => template.content === selectedContent);
	if (!selectedTemplate) {
		alert("템플릿을 찾을 수 없습니다.");
		return;
	}

	const templateId = selectedTemplate.id;  // 템플릿 ID

	// 서버에 삭제 요청
	var params = { jsonstr: JSON.stringify({ id: templateId }) };

	var url = "jsp/complain.jsp";
	AJAX.call(url, params, function(data) {
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

			// 성공한 경우 템플릿 목록 갱신
			alert("선택된 템플릿이 삭제되었습니다.");
			updateTemplateList(jsonData.temList);  // 새로운 템플릿 목록으로 업데이트

		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

// 템플릿 수정 함수
function editTem() {
	const selectedTemplateRadio = document.querySelector('input[name="templateSelection"]:checked');

	if (!selectedTemplateRadio) {
		alert("수정할 템플릿을 선택해 주세요.");
		return;
	}

	const selectedContent = selectedTemplateRadio.value;

	// temList에서 선택된 템플릿 찾기
	const selectedTemplate = temList.find(template => template.content === selectedContent);
	if (!selectedTemplate) {
		alert("템플릿을 찾을 수 없습니다.");
		return;
	}

	const templateId = selectedTemplate.id;  // 템플릿 ID

	// 새로운 템플릿 내용을 사용자에게 입력받음 (prompt 활용)
	const newContent = prompt("새로운 템플릿 내용을 입력하세요:", selectedContent);
	if (newContent === null || newContent.trim() === "") {
		alert("템플릿 내용이 비어 있습니다.");
		return;
	}

	// 서버에 수정 요청
	var params = { jsonstr: JSON.stringify({ id: templateId, content: newContent }) };

	var url = "jsp/complain.jsp";
	AJAX.call(url, params, function(data) {
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

			// 성공한 경우 템플릿 목록 갱신
			alert("템플릿이 수정되었습니다.");
			updateTemplateList(jsonData.temList);  // 새로운 템플릿 목록으로 업데이트

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
