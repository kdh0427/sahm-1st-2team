let isEditing = false;
		document.getElementById("toggleBtn").addEventListener("click", function () {
			const inputs = document.querySelectorAll("#userForm input, #userForm select");
			if (isEditing) {
				inputs.forEach(input => input.disabled = true);
				this.textContent = "수정";
				alert("저장되었습니다.");
			} else {
				inputs.forEach(input => input.disabled = false);
				this.textContent = "저장";
			}
			isEditing = !isEditing;
		});