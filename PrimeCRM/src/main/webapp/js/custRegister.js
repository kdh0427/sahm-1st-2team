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

	const today = new Date();
	const formattedDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

	var usrobj = {
		CuName: name,
		CuBday: bday,
		CuEmail: email,
		CuUpdate: formattedDate,
		CusAdd: address,
		CuNum: phone,
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

function validateContactInfo() {
	let phone = document.getElementById('phone').value;
	let email = document.getElementById('email').value;

	// 전화번호 형식 검사
	let phonePattern = /^\d{3}-\d{4}-\d{4}$/;
	if (!phonePattern.test(phone)) {
		alert("전화번호는 '111-1111-1111' 형식이어야 합니다.");
		return;
	}

	// 이메일 형식 검사
	let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!emailPattern.test(email)) {
		alert("이메일 형식이 올바르지 않습니다.");
		return;
	}

	// 두 검사가 모두 통과하면 등록 처리
	custRegister();
}