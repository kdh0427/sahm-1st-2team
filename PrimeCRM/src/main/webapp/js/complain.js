// complain.js

document.addEventListener('DOMContentLoaded', () => {
    // 삭제 버튼 동작
	document.querySelectorAll('.btn-danger').forEach(button => {
	    button.addEventListener('click', event => {
	        const row = event.target.closest('tr');
	        const nextRow = row.nextElementSibling; // 바로 아래 행을 선택

	        // 현재 행 삭제
	        row.remove();

	        // 아래 행이 존재하면 삭제
	        if (nextRow) {
	            nextRow.remove();
	        }
	    });
	});


    // 답변 버튼 동작
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', event => {
            const textarea = event.target.closest('div').querySelector('textarea');
            const response = textarea.value.trim();

            if (response) {
                alert(`답변이 등록되었습니다.`);
                textarea.value = '';
            } else {
                alert('답변을 입력해주세요.');
            }
        });
    });

    // 페이지네이션
    const table = document.querySelector('#inquiryTable tbody');
    const pagination = document.querySelector('.pagination');
    const rowsPerPage = 10;
    let currentPage = 1;

    function updateTable() {
        const rows = Array.from(table.children);
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = index >= start && index < end ? '' : 'none';
        });
    }

    function updatePagination() {
        const rows = table.children.length;
        const totalPages = Math.ceil(rows / rowsPerPage);
        pagination.innerHTML = '';

        const prev = document.createElement('li');
        prev.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prev.innerHTML = `<a class="page-link" href="#">이전</a>`;
        prev.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updateTable();
                updatePagination();
            }
        };
        pagination.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const page = document.createElement('li');
            page.className = `page-item ${currentPage === i ? 'active' : ''}`;
            page.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            page.onclick = () => {
                currentPage = i;
                updateTable();
                updatePagination();
            };
            pagination.appendChild(page);
        }

        const next = document.createElement('li');
        next.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        next.innerHTML = `<a class="page-link" href="#">다음</a>`;
        next.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateTable();
                updatePagination();
            }
        };
        pagination.appendChild(next);
    }

    updateTable();
    updatePagination();
});