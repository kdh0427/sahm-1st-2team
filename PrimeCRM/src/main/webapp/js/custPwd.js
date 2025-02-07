function findpwd() {
    var email = $("#inputEmail").val().trim();
    if (email == "") {
        alert("이메일을 입력해 주세요.");
        $("#inputEmail").focus();
        return;
    }

    var url = "jsp/custPwd.jsp";
    AJAX.call(url, { Email: email }, function(data) {
        var code = data.trim();
        if (code.length < 2) {
            alert("비밀번호를 확인할 수 없습니다.");
            return;
        }

        // 비밀번호 마스킹 (앞 2자리 공개, 나머지는 *)
        var maskedPwd = code.substring(0, 2) + "*".repeat(code.length - 2);

        // 모달에 비밀번호 표시
        $("#passwordModal .modal-body p").text(maskedPwd);
        $("#passwordModal").modal("show"); // 모달 띄우기
    });
}

$(document).ready(function() {
    $(".close").click(function() {
        $("#passwordModal").modal("hide");  // 모달 닫기
    });
});

function gologin(){
	window.location.href = "custLogin.html";
}