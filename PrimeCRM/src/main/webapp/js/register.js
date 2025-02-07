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
	if (pwd == "") {
		alert("패스워드를 입력해 주세요.");
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