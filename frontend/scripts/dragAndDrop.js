export default class DragAndDrop{
	static onDragStart(event) {
		event.dataTransfer.setData("text/plain", event.target.id);
	}

	static onDragOver(event) {
		event.preventDefault();
	}

	static onDrop(event) {
		const myColumn = event.target.id;
		console.log(myColumn);
		if(myColumn != ''){
			const query = `#${myColumn} button`;
			const button = document.querySelector(query);
			const id = event.dataTransfer.getData("text");
			const arrastavel = document.getElementById(id);
			const dropzone = event.target;
			if (dropzone.classList.contains("coluna")) {
				dropzone.insertBefore(arrastavel, button);
			}
		}
	}
}
