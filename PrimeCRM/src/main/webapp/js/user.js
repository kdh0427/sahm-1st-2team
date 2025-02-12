document.addEventListener("DOMContentLoaded", function() {
	setTimeout(checkLoginStatus, 100);
	fetchuser();
});

function fetchuser() {
	var url = "jsp/user.jsp";  // 요청할 JSP URL
	var Eemail = localStorage.getItem("email");  // 로컬 스토리지에서 이메일 가져오기

	if (!Eemail) {
		console.warn("⚠ 로컬 스토리지에서 이메일을 찾을 수 없습니다!");
		return;
	}
	var params = { email: Eemail };
	// AJAX 요청 (이메일을 객체 형태로 전달)
	AJAX.call(url, params, function(data) {
		var json = data.trim();
		try {
			var jsonData = JSON.parse(json);  // 서버에서 응답한 JSON 데이터 파싱

			var uname = jsonData.Name;
			var uemail = jsonData.Email;
			var uposition = jsonData.Position;
			var ubranch = jsonData.Branch;

			// 이름을 HTML에 출력
			var nameElement = document.getElementById("Emp_Name");
			if (nameElement) {
				nameElement.textContent = uname || "이름 없음";  // 이름 없을 경우 처리
			}

			// 이메일을 HTML에 출력
			var emailElement = document.getElementById("Email_address");
			if (emailElement) {
				emailElement.textContent = (uemail || "이메일 없음");  // 이메일 없을 경우 처리
			}

			var positionElement = document.getElementById("Emp_Position");
			if (positionElement) {
				positionElement.textContent = (uposition || "직급 없음");  // 이메일 없을 경우 처리
			}

			var branchElement = document.getElementById("Emp_Branch");
			if (branchElement) {
				branchElement.textContent = (ubranch || "직급 없음");  // 이메일 없을 경우 처리
			}
		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다.");
		}
	});
}

let isEditing = false;
document.getElementById("toggleBtn").addEventListener("click", function() {
	const inputs = document.querySelectorAll("#userForm input, #userForm select");
	if (isEditing) {
		if (validateContactInfo()) {
			inputs.forEach(input => input.disabled = true);
			this.textContent = "수정";
			inputs.forEach(input => {
				if (input.type !== "checkbox" && input.type !== "radio") {
					input.value = ""; // 값을 빈 문자열로 초기화
				}
			});
		} else {
			isEditing = !isEditing;
		}
	} else {
		inputs.forEach(input => input.disabled = false);
		this.textContent = "저장";
	}
	isEditing = !isEditing;
});

function validateContactInfo() {
	let phone = document.getElementById('Emp_Phone').value;

	// 전화번호 형식 검사
	let phonePattern = /^\d{3}-\d{4}-\d{4}$/;
	if (!phonePattern.test(phone)) {
		alert("전화번호는 '111-1111-1111' 형식이어야 합니다.");
		return false;
	} else {
		transInfo();
		return true;
	}
}

function transInfo() {
	var pwd = $("#Emp_Pwd").val().trim();
	if (pwd == "") {
		alert("패스워드를 입력해 주세요.");
		$("#Emp_Pwd").focus();
		return;
	}

	var pwd2 = $("#Emp_Pwd2").val().trim();
	if (pwd != pwd2) {
		alert("입력된 두 개의 패스워드가 일치하지 않습니다.");
		$("#Emp_Pwd2").focus();
		return;
	}

	var phone = $("#Emp_Phone").val().trim();
	if (phone == "") {
		alert("전화번호를 입력해 주세요.");
		$("#Emp_Phone").focus();
		return;
	}

	var Eemail = localStorage.getItem("email");
	var params = { E_email: Eemail, E_pwd: pwd, E_phone: phone };

	var url = "jsp/user2.jsp";
	AJAX.call(url, params, function(data) {
		var code = data.trim();
		if (code == "ER") {
			alert("정보변경 처리 중 에러가 발생하였습니다.");
		} else {
			alert("정보 변경이 완료되었습니다.");
		}
	});
}

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