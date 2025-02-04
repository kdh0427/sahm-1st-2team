document.addEventListener("DOMContentLoaded", function () {
    setTimeout(checkLoginStatus, 100); // 로그인 상태 확인
    fetchCustomerList(); // 고객 목록 불러오기
});

function fetchCustomerList() {
    var url = "jsp/custSearch.jsp"; // 고객 데이터를 가져올 JSP 경로

    AJAX.call(url, null, function (data) {
        var json = data.trim();
        try {
            var jsonData = JSON.parse(json);
            console.log("파싱된 JSON 데이터:", jsonData);

            var customerList = jsonData; // JSON 데이터 리스트
            checkLoginStatus(); // 로그인 확인
            displayCustomerList(customerList); // 테이블 업데이트

        } catch (e) {
            console.error("JSON 파싱 오류:", e);
            alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
        }
    });
}

// 고객 데이터를 테이블에 삽입
function displayCustomerList(customerList) {
    var container = document.getElementById("customerContainer");

    if (customerList && customerList.length > 0) {
        container.innerHTML = ""; // 기존 테이블 초기화

        customerList.forEach(function (cu) {
            var customerData = JSON.parse(cu.jsonstr); // jsonstr을 JSON으로 변환

            var tr = document.createElement("tr");

            var tdName = document.createElement("td");
            tdName.textContent = customerData.CuName;

            var tdBday = document.createElement("td");
            tdBday.textContent = customerData.CuBday;

            var tdEmail = document.createElement("td");
            tdEmail.textContent = customerData.CuEmail;

            var tdUpdate = document.createElement("td");
            tdUpdate.textContent = customerData.CuUpdate;

            var tdAddress = document.createElement("td");
            tdAddress.textContent = customerData.CusAdd;

            var tdPhone = document.createElement("td");
            tdPhone.textContent = customerData.CuNum;

            var tdType = document.createElement("td");
            tdType.textContent = customerData.CuTpye;

            // 체크박스 추가
            var tdSelect = document.createElement("td");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("row-select");
            tdSelect.appendChild(checkbox);

            // 테이블 행에 데이터 추가
            tr.appendChild(tdName);
            tr.appendChild(tdBday);
            tr.appendChild(tdEmail);
            tr.appendChild(tdUpdate);
            tr.appendChild(tdAddress);
            tr.appendChild(tdPhone);
            tr.appendChild(tdType);
            tr.appendChild(tdSelect);

            container.appendChild(tr);
        });

        // DataTables 플러그인 적용
        new simpleDatatables.DataTable("#datatablesSimple");
    }
}
