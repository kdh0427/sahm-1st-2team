function login() {
	var email = $("#inputEmail").val().trim();
	if (email == "") {
		alert("이메일을 입력해 주세요.");
		$("inputEmail").focus();
		return;
	}

	var pwd = $("#inputPassword").val().trim();
	if (pwd == "") {
		alert("패스워드를 입력해 주세요.");
		$("#inputPassword").focus();
		return;
	}

	var usrobj = { E_email: email, E_pwd: pwd };
	var params = { jsonstr: JSON.stringify(usrobj) };

	var url = "jsp/login.jsp";
	AJAX.call(url, params, function(data) {
		var code = data.trim();
		if (code == "SU") {
			alert("로그인 되었습니다.");
			localStorage.setItem("email", email);
			window.location.href = "main.html";
		} else if (code == "ER") {
			alert("로그인 처리 중 에러가 발생하였습니다.");
		}
	});
}