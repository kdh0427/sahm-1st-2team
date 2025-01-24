// AJAX를 사용하여 이미지 URL을 서버로부터 받아오는 함수
function loadImage() {
    // XMLHttpRequest 객체를 생성
    var xhr = new XMLHttpRequest();
    
    // GET 방식으로 요청
    xhr.open('GET', '/api/getImage', true);
    
    // 요청 완료 후 처리
    xhr.onload = function () {
        if (xhr.status === 200) {
            // 서버에서 받은 이미지 URL을 JSON으로 파싱
            var imageUrl = JSON.parse(xhr.responseText).imageUrl;
            
            // 이미지 태그의 src 속성에 동적으로 이미지 URL 설정
            document.getElementById('model-image').src = imageUrl;
        }
    };
    
    // 요청 보내기
    xhr.send();
}

// 페이지가 로드될 때 이미지를 불러오는 함수 호출
window.onload = function() {
    loadImage();
};
