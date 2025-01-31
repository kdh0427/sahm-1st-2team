var AJAX = {
    call: function (url, params, func, isfd) {
        var callobj = {
            url: url, 
            type: "post", 
            data: params, 
            dataType: "text",
            success: func,
            error: function (xhr, status, error) {
                if (xhr.status == 0) {
                    alert("네트워크 접속이 원할하지 않습니다.");
                }
                else {
                    console.log(xhr.responseText);
                    alert("에러가 발생하였습니다. 관리자에게 문의해주세요.");
                }
            },
        };
        if (isfd) {
            callobj.processData = false;
            callobj.contentType = false;
        }
        jQuery.ajax(callobj);
    }
};  // end of AJAX