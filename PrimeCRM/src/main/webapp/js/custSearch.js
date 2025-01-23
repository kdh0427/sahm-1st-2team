document.addEventListener('DOMContentLoaded', event => {
	const datatablesSimple = document.getElementById('datatablesSimple');

	if (datatablesSimple) {
		// Simple-DataTables 초기화
		const dataTable = new simpleDatatables.DataTable(datatablesSimple);

		// 수정 버튼 기능
		const editButton = document.getElementById("editRows");
		const saveButton = document.getElementById("saveRows");
		editButton.addEventListener("click", () => {
			// 테이블의 모든 셀을 편집 가능하게 설정
			const rows = datatablesSimple.querySelectorAll("tbody tr");
			rows.forEach(row => {
				const cells = row.querySelectorAll("td:not(:last-child)");
				cells.forEach(cell => {
					const currentValue = cell.textContent;
					cell.innerHTML = `<input type='text' value='${currentValue}' class='form-control form-control-sm'>`;
				});
			});
		});

		// 저장 버튼 기능
		saveButton.addEventListener("click", () => {
			// 테이블의 모든 셀을 다시 일반 텍스트로 변환
			const rows = datatablesSimple.querySelectorAll("tbody tr");
			rows.forEach(row => {
				const cells = row.querySelectorAll("td:not(:last-child)");
				cells.forEach(cell => {
					const input = cell.querySelector("input");
					if (input) {
						cell.textContent = input.value;
					}
				});
			});
		});

		// 선택된 행 삭제 기능
		const deleteSelectedButton = document.getElementById('deleteSelected');
		deleteSelectedButton.addEventListener('click', () => {
			// 선택된 체크박스 가져오기
			const checkboxes = document.querySelectorAll('.row-select:checked');

			checkboxes.forEach(checkbox => {
				const row = checkbox.closest('tr'); // 체크박스가 포함된 행 찾기
				if (row) {
					dataTable.rows().remove(row); // Simple-DataTables API로 행 삭제
				}
			});
		});
	}
});