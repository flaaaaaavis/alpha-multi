import Api from "./Api.js";

const token = localStorage.getItem("@dmkanban-user");

if (token) {
	location.replace("./board.html");
}

const registerBtn = document.getElementById("cadastro-button");
registerBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	const name = document.getElementById("cadastro-nome").value;
	const email = document.getElementById("cadastro-email").value;
	const password = document.getElementById("cadastro-senha").value;
	const confirmPassword = document.getElementById(
		"cadastro-conf-senha"
	).value;
	if (password.trim() !== confirmPassword.trim()) {
		const erro = document.getElementById("erro");
		erro.innerText = "As senhas não são iguais";
		return false;
	}
	if (password.trim() !== "" && name.trim() !== "" && email.trim() !== "") {
		const user = {
			usuario: name.trim(),
			email: email.trim(),
			senha: password.trim(),
		};
		const request = await Api.register(user);
		alert(request);
		location.replace("../index.html");
	}
});
