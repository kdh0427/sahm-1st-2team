function findid() {
    var name = $("#inputName").val().trim();
    if (name == "") {
        alert("이름을 입력해 주세요.");
        $("#inputName").focus();
        return;
    }

    var url = "jsp/custID.jsp";
    AJAX.call(url, { Name: name }, function(data) {
        var code = data.trim();
        if (code.length == 0) {
            alert("고객번호를 확인할 수 없습니다.");
            return;
        }

        // 모달에 고객번호 표시
        $("#custidModal .modal-body p").text(code);
        $("#custidModal").modal("show"); // 모달 띄우기
    });
}

$(document).ready(function() {
    $(".close").click(function() {
        $("#custidModal").modal("hide");  // 모달 닫기
    });
});

function gojoin(){
	window.location.href = "custJoin.html";
}