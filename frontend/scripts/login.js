import ApiMock from "./ApiMock.js";

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", (e) => {
	e.preventDefault();
	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;
	const user = {
		email: email.trim(),
		password: password.trim(),
	};
	const request = ApiMock.login(user);
	console.log(request);
	if (request) {
		location.replace("./board.html");
	} else {
		alert("Usuário ou senha inválidos!");
	}
});
