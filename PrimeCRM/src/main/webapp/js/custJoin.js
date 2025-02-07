function signup() {
	var id = $("#id").val().trim();
	if (id == "") {
		alert("고객번호를 입력해 주세요.");
		$("#id").focus();
		return;
	}
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

	var params = { CuID: id, CuName: name, CuEmail: email, CuPwd: pwd };

	var url = "jsp/custJoin.jsp";
	AJAX.call(url, params, function(data) {
		var code = data.trim();
		if (code == "EX") {
			alert("이미 가입한 회원입니다.");
		} else if (code == "ER") {
			alert("회원가입 처리 중 에러가 발생하였습니다.");
		} else {
			alert("회원 가입이 완료되었습니다.");
			window.location.href = "custLogin.html";
		}
	});
}