document.addEventListener("DOMContentLoaded", function() {
	generateSpans();
});

function login() {
	var email = $("#inputEmail").val().trim();
	if (email == "") {
		alert("이메일을 입력해 주세요.");
		$("#inputEmail").focus();
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
		} else if (code == "EX") {
			alert("잘못된 비밀번호 입니다.");
		}else{
			alert("잘못된 입력이거나 가입되지 않은 회원입니다.");
		}
	});
}

function toggleLabel(input) {
	const label = input.nextElementSibling;
	if (input.value || input === document.activeElement) {
		label.style.top = "-10px";
		label.style.fontSize = "0.8em";
	} else {
		label.style.top = "50%";
		label.style.fontSize = "1em";
	}
}

function generateSpans() {
	const container = document.querySelector('.container');
	for (let i = 0; i < 50; i++) {
		const span = document.createElement('span');
		span.style.setProperty('--i', i);  // --i 값을 설정
		container.appendChild(span);
	}
}