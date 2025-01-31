function login() {
	var email = $("#email").val().trim();
	if (email == "") {
		alert("이메일을 입력해 주세요.");
		$("#email").focus();
		return;
	}

	var pwd = $("#password").val().trim();
	if (pwd == "") {
		alert("패스워드를 입력해 주세요.");
		$("#password").focus();
		return;
	}

	var usrobj = { E_email: email, E_pwd: pwd };
	var params = { jsonstr: JSON.stringify(usrobj) };

	var url = "jsp/register.jsp";
	AJAX.call(url, params, function(data) {
		var code = data.trim();
		if (code == "SU") {
			alert("로그인 되었습니다.");
			var email = $("#email").val().trim();
			localStorage.setItem("email", email);
			window.location.href = "login.html";
		} else if (code == "ER") {
			alert("로그인 처리 중 에러가 발생하였습니다.");
		}
	});
}