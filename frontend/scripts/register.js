import Api from "./Api.js";

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", async (e) => {
	e.preventDefault();
	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const user = {
		email: email.trim(),
		password: password.trim(),
	};
	const request = await Api.login(user);
	console.log(request);
	if (request.token) {
		localStorage.setItem("@dmkanban-token", request.token);
		location.replace("./board.html");
	} else {
		alert("Usuário ou senha inválidos!");
	}
});
