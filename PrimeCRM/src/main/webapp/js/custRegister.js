function custRegister() {
	var name = $("#name").val().trim();
	if (name == "") {
		alert("이름을 입력해 주세요.");
		$("#name").focus();
		return;
	}

	var bday = $("#bday").val().trim();
	if (bday == "") {
		alert("생년월일을 입력해 주세요.");
		$("#bday").focus();
		return;
	}

	var phone = $("#phone").val().trim();
	if (phone == "") {
		alert("전화번호를 입력해 주세요.");
		$("#phone").focus();
		return;
	}

	var email = $("#email").val().trim();
	if (email == "") {
		alert("이메일을 입력해 주세요.");
		$("#email").focus();
		return;
	}

	var address = $("#address").val().trim();
	if (address == "") {
		alert("주소를 입력해 주세요.");
		$("#address").focus();
		return;
	}

	var type = $("#type").val().trim();
	if (type == "") {
		alert("회원 유형을 선택해주세요");
		$("#type").focus();
		return;
	}

	var status = $("#status").val().trim();
	if (status == "") {
		alert("특이사항을 입력해 주세요.");
		$("#status").focus();
		return;
	}

	var usrobj = {
		CuName: name,
		CuBday: bday,
		CuEmail: email,
		CuNum: phone,
		CusAdd: address,
		CuType: type
	};

	var params = {
		jsonstr: JSON.stringify(usrobj),
		Cust_Status: status
	};

	var url = "jsp/custRegister.jsp";
	AJAX.call(url, params, function(data) {
		var code = data.trim();
		if (code == "EX") {
			alert("이미 등록된 고객입니다.");
		} else if (code == "ER") {
			alert("고객 등록 중 에러가 발생하였습니다.");
		} else {
			alert("고객 등록이 완료되었습니다.");
			window.location.href = "custSearch.html";
		}
	});
}