function signup() {
	var name = $("#name").val().trim();
	if (name == "") {
		alert("이름을 입력해 주세요.");
		$("#name").focus();
		return;
	}

	var email = $("#email").val().trim();
	if (email == "") {
		alert("이메일을 입력해 주세요.");
		$("#email").focus();
		return;
	}

	var phone = $("#phone").val().trim();
	if (phone == "") {
		alert("전화번호를 입력해 주세요.");
		$("#phone").focus();
		return;
	}

	var pwd = $("#password").val().trim();
	if (pwd.length < 2) {
		alert("비밀번호는 2글자 이상 입력해야 합니다.");
		$("#password").focus();
		return;
	}

	var pwd2 = $("#confirmPassword").val().trim();
	if (pwd != pwd2) {
		alert("입력된 두 개의 패스워드가 일치하지 않습니다.");
		$("#confirmPassword").focus();
		return;
	}

	var position = $("#position").val().trim();
	if (position == "") {
		alert("직책을 선택해주세요");
		$("#position").focus();
		return;
	}

	var branch = $("#branch").val().trim();
	if (branch == "") {
		alert("지점을 선택해주세요");
		$("#branch").focus();
		return;
	}

	var usrobj = { E_name: name, E_email: email, E_phone: phone, E_pwd: pwd, E_position: position };
	var params = { jsonstr: JSON.stringify(usrobj), branch_Id: branch };

	var url = "jsp/register.jsp";
	AJAX.call(url, params, function(data) {
		var code = data.trim();
		if (code == "OK") {
			alert("회원 가입이 완료되었습니다.");
			window.location.href = "login.html";
		} else if (code == "EX") {
			alert("이미 가입한 회원입니다.");
		} else if (code == "ER") {
			alert("회원가입 처리 중 에러가 발생하였습니다.");
		}
	});
}

function validateContactInfo() {
	let phone = document.getElementById('phone').value;
	let email = document.getElementById('email').value;

	// 이메일 형식 검사
	let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!emailPattern.test(email)) {
		alert("이메일 형식이 올바르지 않습니다.");
		return;
	}

	// 전화번호 형식 검사
	let phonePattern = /^\d{3}-\d{4}-\d{4}$/;
	if (!phonePattern.test(phone)) {
		alert("전화번호는 '111-1111-1111' 형식이어야 합니다.");
		return;
	}

	signup();
}