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

		checkLoginStatus(); // 로그인 상태 확인 함수
		updateComList(comList); // 문의 목록 업데이트

	} catch (e) {
		console.error("JSON 파싱 오류:", e);
		alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
	}
});



// 문의 목록을 동적으로 생성하는 함수
function updateComList(comList) {
	const tbody = document.getElementById("inquiryTableBody");
	tbody.innerHTML = ""; // 기존 내용 초기화

	const userEmail = localStorage.getItem("email"); // 로컬 스토리지에서 현재 로그인한 사용자의 이메일 가져오기

	if (!userEmail) {
		console.warn("⚠ 로컬 스토리지에서 이메일을 찾을 수 없습니다!");
		return;
	}

	// 사용자의 이메일과 일치하는 문의만 필터링
	const filteredComList = comList.filter(inquiry => inquiry.email === userEmail);

	filteredComList.forEach((inquiry) => {
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
                <div class="p-3 bg-light border-start border-primary shadow-sm mt-2">
                    <p class="fw-bold">📌 답변 내용:</p>
                    ${inquiry.status === 'DONE' ? `
                    <p>${inquiry.response}</p>
                    ` : ''}
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

function validateAndSubmit() {
    var complainContent = document.getElementById("complainContent").value.trim();
    var custStatus = document.getElementById("custStatus").value.trim();

    if (!complainContent) {
        alert("문의 내용을 입력하세요.");
        document.getElementById("complainContent").focus();
        return;
    }

    if (!custStatus) {
        alert("문의 유형을 선택하세요.");
        document.getElementById("custStatus").focus();
        return;
    }

    submitComplain(); // 문의 등록 함수 실행
}

// 문의 작성 함수
function submitComplain() {
	var Cemail = localStorage.getItem("email"); // 로컬 스토리지에서 이메일 가져오기

	if (!Cemail) {
		console.warn("⚠ 로컬 스토리지에서 이메일을 찾을 수 없습니다!");
		return;
	}
	var params = { email: Cemail };

	// AJAX 요청 (이메일을 객체 형태로 전달)
	AJAX.call("jsp/custComplain.jsp", params, function(data) {
		var json = data.trim();
		try {
			var jsonData = JSON.parse(json);  // 서버에서 응답한 JSON 데이터 파싱
			var cname = jsonData.Name;
			var cemail = jsonData.Email;
			var cid = jsonData.ID;

			if (!cemail) {
				console.error("서버에서 이메일 정보를 받지 못했습니다.");
				alert("서버 오류: 이메일 정보가 없습니다.");
				return;
			}

			var custStatus = document.getElementById("custStatus").value.trim();
			var complainContent = document.getElementById("complainContent").value.trim();

			if (!complainContent) {
				alert("문의 내용을 입력하세요.");
				return;
			}

			if (!custStatus) {
				alert("문의 유형을 선택하세요.");
				return;
			}

			var today = new Date();
			var formattedDate = today.toISOString().split('T')[0];
			
			var requestData = {
				date: formattedDate,
				cment: 'NULL',
				content: complainContent,
				status: 'NONE',
				custstatus: custStatus,
			};

			var params2 = {
				Cust_ID: cid,
				jsonstr: JSON.stringify(requestData)
			}

			AJAX.call("jsp/custComplain2.jsp", params2, function(data) {
				var json = data.trim();
				console.log(json);
				try {
					if (json == "SU") {
						alert("문의가 등록되었습니다.");
						location.reload();
					} else {
						alert("문의 등록에 실패했습니다.");
					}
				} catch (e) {
					console.error("JSON 파싱 오류:", e);
					alert("서버 응답 처리 중 오류가 발생했습니다.");
				}
			});
			
		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다.");
		}
	});

}

// 로그인 상태 확인 함수
function checkLoginStatus() {
	var isEmail = localStorage.getItem("email");

	if (!isEmail || isEmail === "null") {
		alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.");
		window.location.href = "custLogin.html";
		return;
	}

	var emailElement = document.getElementById("cuemail");
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
		window.location.href = "custLogin.html"; // 로그인 페이지로 이동
	} else {
		alert("로그아웃에 실패했습니다. 다시 시도해주세요."); // 로그아웃 실패
	}
}
