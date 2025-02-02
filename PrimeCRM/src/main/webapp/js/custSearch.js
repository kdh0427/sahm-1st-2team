var AJAX = {
    call: function (url, params, func, method = "POST", isfd = false) {
        var callobj = {
            url: url,
            type: method,
            data: params,
            dataType: "json", // 자동으로 JSON 변환
            success: func,
            error: function (xhr, status, error) {
                if (xhr.status === 0) {
                    alert("네트워크 접속이 원활하지 않습니다.");
                } else {
                    console.log("AJAX Error Response:", xhr.responseText);
                    alert("에러가 발생하였습니다. 관리자에게 문의해주세요.");
                }
            }
        };
        if (isfd) {
            callobj.processData = false;
            callobj.contentType = false;
        }
        $.ajax(callobj);
    }
};
