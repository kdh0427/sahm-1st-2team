document.addEventListener('DOMContentLoaded', () => {
    // 가상의 문의 데이터 (API 호출 대신 사용)
    const inquiries = [
        { id: 1, title: '문의 제목 1', content: '여기에는 문의 내용 1이 들어갑니다.' },
        { id: 2, title: '문의 제목 2', content: '여기에는 문의 내용 2가 들어갑니다.' },
        { id: 3, title: '문의 제목 3', content: '여기에는 문의 내용 3이 들어갑니다.' },
    ];

    const inquiryList = document.getElementById('inquiry-list');

    inquiries.forEach((inquiry) => {
        // 문의 항목 생성
        const inquiryDiv = document.createElement('div');
        inquiryDiv.className = 'inquiry-item';

        // 제목
        const header = document.createElement('div');
        header.className = 'inquiry-title';
        header.textContent = inquiry.title;

        // 내용
        const content = document.createElement('div');
        content.className = 'inquiry-content';
        content.textContent = inquiry.content;
        content.style.display = 'none'; // 초기값 숨김

        // 제목 클릭 시 내용 토글
        header.onclick = () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        };

        // 항목 구성
        inquiryDiv.appendChild(header);
        inquiryDiv.appendChild(content);
        inquiryList.appendChild(inquiryDiv);
    });
});
