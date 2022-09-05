const drag = document.querySelectorAll(".draggable");
const drop = document.querySelectorAll(".coluna");

drag.forEach((element) => {
	element.addEventListener("dragstart", (event) => {
		onDragStart(event);
	});
});

drop.forEach((element) => {
	element.addEventListener("dragover", (event) => {
		onDragOver(event);
	});
	element.addEventListener("drop", (event) => {
		onDrop(event);
	});
});

function onDragStart(event) {
	event.dataTransfer.setData("text/plain", event.target.id);
}

function onDragOver(event) {
	event.preventDefault();
}

function onDrop(event) {
	const id = event.dataTransfer.getData("text");
	const draggable = document.getElementById(id);
	const dropzone = event.target;
	if (dropzone.classList.contains("coluna")) {
		dropzone.append(draggable);
	}
}
