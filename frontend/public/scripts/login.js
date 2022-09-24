import Api from "./Api.js";

const token = localStorage.getItem("@dm-kanban-token");

if (token) {
	location.replace("./pages/board.html");
}

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", async (e) => {
	e.preventDefault();
	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const user = {
		email: email.trim(),
		senha: password.trim(),
	};
	const request = await Api.login(user);
	console.log(request);
	if (request.token) {
		localStorage.setItem("@dm-kanban-token", JSON.stringify(request.token));
		location.replace("./pages/board.html");
	} else {
		alert("Usuário ou senha inválidos!");
	}
});
