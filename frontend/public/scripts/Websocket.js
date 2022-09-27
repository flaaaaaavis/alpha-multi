export const ws = new WebSocket("ws://207.246.126.10:8000");
//export const ws = new WebSocket("ws://localhost:8000");
export let sala = localStorage.getItem("@dm-kanban:id");

export function udpateSala() {
	sala = localStorage.getItem("@dm-kanban:id");
}
