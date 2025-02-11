function findpwd() {
	var url = "jsp/password.jsp";

	var email = $("#inputEmail").val().trim();
	if (email == "") {
		alert("이메일을 입력해 주세요.");
		$("#inputEmail").focus();
		return;
	}

	AJAX.call(url, { Email: email }, function(data) { }); {
		var code = data.trim();
	}
}
