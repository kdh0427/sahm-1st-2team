document.addEventListener("DOMContentLoaded", function() {
	setTimeout(function() {
	    showpopup();
	}, 100); // 100ms 후 showpopup() 실행
});

function showpopup(){
	var url = 'jsp/topEmp.jsp';
	AJAX.call(url, null, function(data){
		var json = data.trim();
		try {
			// JSON 문자열을 객체로 변환
			var jsonData = JSON.parse(json);  // jsonData를 전역 변수로 저장
			console.log(jsonData);
			var emplist = jsonData.emplist;
			
			displayEmpList(emplist);
		} catch (e) {
			console.error("JSON 파싱 오류:", e);
			alert("서버 응답 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
		}
	});
}

function displayEmpList(empList) {
    if (empList && empList.length > 0) {
        var container = document.getElementById("empListContainer");
        container.innerHTML = ""; // 기존 내용 비우기

        empList.forEach(function(emp, index) {
			// 순위 배지 생성
			var rank = document.createElement("span");
			rank.className = "badge";

			// 순위별 크기 및 스타일 조정
			var fontSize, backgroundColor, icon;
			if (index === 0) {
				fontSize = "1rem"; // 1위
				backgroundColor = "gold"; // 금색
				icon = "👑";
			} else if (index === 1) {
				fontSize = "0.9rem"; // 2위
				backgroundColor = "silver"; // 은색
				icon = "🥈";
			} else if (index === 2) {
				fontSize = "0.85rem"; // 3위
				backgroundColor = "#cd7f32"; // 동색
				icon = "🥉";
			} else {
				fontSize = "0.8rem"; // 그 외
				backgroundColor = "#0099FF"; // 보라색
				icon = "";
			}

			// rank 배지 스타일 설정
            rank.style.fontSize = fontSize;
            rank.style.backgroundColor = backgroundColor;
            rank.style.display = "block";
            rank.style.textAlign = "center";
            rank.style.marginBottom = "3px"; // 간격 더 줄이기
            rank.textContent = `${icon} ${index + 1}위`;

            // 직원 항목 div 생성
            var itemDiv = document.createElement("div");
            itemDiv.className = "list-group-item d-flex justify-content-between align-items-center";
            itemDiv.style.padding = "6px"; // 기존 10px → 6px (패딩 더 축소)
            itemDiv.style.width = "100%"; // 꽉 차게 표시

            // 직원 정보
            var infoDiv = document.createElement("div");
            var nameElement = document.createElement("h6"); // 기존 h6 유지
            nameElement.className = "mb-1";
            nameElement.style.fontSize = "0.85rem"; // 폰트 크기 축소
            nameElement.textContent = emp.empName;
            var positionElement = document.createElement("small"); // 기존 small 유지
            positionElement.className = "";
            positionElement.style.fontSize = "0.75rem"; // 폰트 크기 축소
			positionElement.style.color = "#fff";
            positionElement.textContent = "Position: " + emp.position;

            infoDiv.appendChild(nameElement);
            infoDiv.appendChild(positionElement);
            itemDiv.appendChild(rank);
            itemDiv.appendChild(infoDiv);

            container.appendChild(itemDiv);
        });
    } else {
        document.getElementById("empListContainer").innerHTML = "<p>직원 목록이 없습니다.</p>";
    }
}
