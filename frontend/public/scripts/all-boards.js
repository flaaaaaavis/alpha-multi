import CardCreator from "./CardCreator.js";
import { ws, sala, udpateSala } from "./Websocket.js";
import Render from "./Render.js";
import Api from "./Api.js";
import parseJwt from "./userInfo.js";

const projectMembers = [];
const token = localStorage.getItem("@dm-kanban-token");
const openProject = localStorage.getItem("@dm-kanban:id");

if (!token) {
	location.replace("../index.html");
}

const user = parseJwt(token);

localStorage.setItem("@dm-kanban-userId", user.usuario.id);

ws.addEventListener("open", () => {
	console.log("conectado!!!");
	ws.send(JSON.stringify({ room: sala }));
	const newUser = {
		tipo: "conexão",
		usuario: user.usuario.id,
		sala: sala,
		nome_usuario: user.usuario.usuario,
	};
	ws.send(JSON.stringify(newUser));
});

const exitButton = document.getElementById("sair");
exitButton.addEventListener("click", (e) => {
	e.preventDefault();
	localStorage.removeItem("@dm-kanban-token");
	location.replace("../index.html");
});

const newProject = document.getElementById("criar-quadro");
newProject.addEventListener("click", async (e) => {
	e.preventDefault();
	let nome = document.getElementById("input-quadro").value;
	menuControl();
	if (nome.trim() == "") {
		nome = "Novo quadro";
	}

	const project = {
		nome: nome,
		adm: user.usuario.id,
	};
	const projectId = await Api.createProject(project);
	localStorage.setItem("@dm-kanban:id", projectId);
	udpateSala();
	const projectList = document.getElementById("lista-de-projetos");
	const item = document.createElement("li");
	item.className = "your-boards__item";
	const listButton = document.createElement("button");
	listButton.value = projectId;
	listButton.innerText = nome.trim();
	listButton.addEventListener("click", async (e) => {
		e.preventDefault();
		const categories = await Api.getCategoryByProject(listButton.value);
		console.log(categories);
		renderProjects(project, categories);
	});

	item.append(listButton);
	projectList.append(item);

	ws.send(
		JSON.stringify({ tipo: "conexão", room: projectId, sala: projectId })
	);
	Render.createBoard(3, nome, projectId);
});

/* Respostas do websocket */

ws.addEventListener("message", ({ data }) => {
	const dados = JSON.parse(data);
	let card;

	switch (dados.tipo) {
		case "conexão":
			console.log(dados);
			const notifications = document.querySelector(".notifications");
			const notificationUser = document.getElementById(
				"notifications-username"
			);
			notifications.classList.remove("hidden");
			notificationUser.innerText = dados.nome_usuario;
			setTimeout(() => {
				notifications.classList.add("hidden");
			}, 5000);
			break;
		case "arrastando tarefa":
			card = document.getElementById(`${dados.id}`);
			card.classList.add("arrastando");
			break;
		case "apagar coluna":
			const apagar = document.getElementById(`tarefa-${dados.id}`);
			apagar.remove();
			break;
		case "mover tarefa":
			moveCard(dados);
			break;
		case "nova coluna":
			Render.createColumn(false);
			break;
		case "nova tarefa":
			console.log(dados);
			const target = document.querySelector(`#${dados.botao}`);
			console.log(target);
			CardCreator.renderCard(target.id, dados);
			break;
		case "mudança de nome - card":
			card = document.querySelector(`#tarefa-${dados.id} .nome__card`);
			card.innerText = dados.nome;
			break;
		case "mudança de nome - coluna":
			const coluna = document.querySelector(`#coluna-${dados.id} input`);
			coluna.value = dados.nome;
			CardCreator.fillAllSelects();
			break;
		case "mudança de nome - quadro":
			const quadro = document.getElementById("nome-projeto");
			quadro.value = dados.nome;
			break;
		case "mudança de conteudo - card":
			card = document.querySelector(`#tarefa-${dados.id} p`);
			card.innerText = dados.conteudo;
			break;
		case "excluir card":
			card = document.getElementById(`tarefa-${dados.id}`);
			card.remove();
			break;
		case "editando tarefa":
			console.log(dados.id);
			card = document.getElementById(`tarefa-${dados.id}`);
			card.classList.add("editavel");
			break;
		case "fechar modal":
			console.log(dados.id);
			card = document.getElementById(`tarefa-${dados.id}`);
			card.classList.remove("editavel");
			break;
		case "adicionar membro":
			console.log(dados);
	}
});

function menuControl() {
	let menu = document.getElementById("sidebar-menu");
	const openButton = document.getElementById("menu--button__open");

	if (window.getComputedStyle(menu).display === "none") {
		menu.style.display = "flex";
		openButton.style.display = "none";
	} else {
		menu.style.display = "none";
		openButton.style.display = "flex";
	}
}

function modalControl(modalId) {
	const modal = document.getElementById(modalId)

	if (window.getComputedStyle(modal).display === "none") {
		modal.style.display = "flex";
	} else {
		modal.style.display = "none";
	}
	modal.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target == modal) {
			modal.style.display = "none";
		}
	});
}

const closeModal = document.querySelectorAll(".close-modal-x");

const openButton = document.getElementById("menu--button__open");
openButton.addEventListener("click", (event) => {
	event.preventDefault();
	menuControl();
});

const closeButton = document.getElementById("closeMenuButton");
closeButton.addEventListener("click", (event) => {
	event.preventDefault();
	menuControl();
});

const deleteAccountButton = document.getElementById("excluir-conta");
deleteAccountButton.addEventListener("click", (event) => {
	event.preventDefault();
	modalControl("modal--delete-account__container");
});

const changeEmailButton = document.getElementById("mudar-email");
changeEmailButton.addEventListener("click", (event) => {
	event.preventDefault();
	modalControl("modal--change-email__container");
});

const changePassButton = document.getElementById("mudar-senha");
changePassButton.addEventListener("click", (event) => {
	event.preventDefault();
	modalControl("modal--change-password__container");
});

function editMenuInfo() {
	const username = document.getElementById("user-username");
	username.innerText = user.usuario.usuario;
	const email = document.getElementById("user-email");
	email.innerText = user.usuario.email;
}
editMenuInfo();

function modalFunctions() {
	const openDeleteAccountModal = document.getElementById("excluir-conta");
	const deleteAccountModal = document.getElementById(
		"modal--delete-account__container"
	);
	const closeEmail = document.querySelector(".email-modal header span");
	const changeEmailButton = document.getElementById(
		"modal--change-email__button"
	);

	const passwordModal = document.getElementById(
		"modal--change-password__container"
	);
	const openPasswordModal = document.getElementById("mudar-senha");
	const changePasswordButton = document.getElementById(
		"modal--change-password__button"
	);
	changePasswordButton.addEventListener("click", (e) => {
		e.preventDefault();
		changePassword();
	});

	openPasswordModal.addEventListener("click", (e) => {
		e.preventDefault();
		passwordModal.style.display = "flex";
	});

	passwordModal.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target == passwordModal) {
			passwordModal.style.display = "none";
		}
	});

	openDeleteAccountModal.addEventListener("click", () => {
		deleteAccountModal.style.display = "flex";
	});

	deleteAccountModal.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target == deleteAccountModal) {
			deleteAccountModal.style.display = "none";
		}
	});

	changeEmailButton.addEventListener("click", async (e) => {
		const request = await changeEmail();
		// alert(request);
	});
}

async function changeEmail() {
	const email = document.getElementById(
		"modal--change-email__new-email"
	).value;
	const confirmEmail = document.getElementById(
		"modal--change-email__repeat-new-email"
	).value;
	if (email != confirmEmail) {
		return alert("Os e-mails não são iguais");
	}
	if (email.trim() === "") {
		// return alert("Por favor digite um email");
	} else if (!validateEmail(email)) {
		// return alert("Por favor digite um email valido");
	}
	const body = {
		id: user.usuario.id,
		usuario: user.usuario.usuario,
		email: email.trim(),
	};
	const request = await Api.modifyUser(body);
	console.log(request);
	if (request.result) {
		document.getElementById("user-email").innerText = email.trim();
		return request.result;
	}
	console.log(request);
	return request;
}

function validateEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}

async function changePassword() {
	const newPassword = document.getElementById(
		"modal--change-password__new-pass"
	).value;
	const newPasswordRepeat = document.getElementById(
		"modal--change-password__repeat-new-pass"
	).value;
	if (newPassword.trim() != newPasswordRepeat.trim()) {
		// return alert("As senhas não são iguais");
	}
	const body = {
		id: user.usuario.id,
		senha: newPassword.trim(),
	};
	const request = await Api.editUserPassword(body);
	console.log(request);
	if (request.result) {
		// return alert(request.result);
	}
	return request;
}

modalFunctions();
async function getProjects() {
	const body = {
		id: user.usuario.id,
	};
	const request = await Api.getAllProjects(body);
	if (request.projetos) {
		const projetosMenu = document.getElementById("lista-de-projetos");
		console.log(request.projetos);
		const uniqueIds = [];
		const uniqueProjects = request.projetos.filter((element) => {
			const isDuplicate = uniqueIds.includes(element.projeto_id);

			if (!isDuplicate) {
				uniqueIds.push(element.projeto_id);

				return true;
			}
		});

		uniqueIds.forEach(async (project) => {
			const newProject = await Api.getProjectbyId(project);
			const item = document.createElement("li");
			item.className = "your-boards__item";
			const itemButton = document.createElement("button");
			itemButton.innerText = newProject.nome;
			itemButton.value = newProject.id;
			itemButton.addEventListener("click", async (e) => {
				e.preventDefault();
				const categories = await Api.getCategoryByProject(
					itemButton.value
				);
				console.log(categories);
				renderProjects(project, categories);
			});

			item.append(itemButton);
			projetosMenu.append(item);
		});
	}
}

async function renderProjects(project, categories) {
	menuControl();
	const fullProject = await Api.getProjectbyId(project);
	const projectMembers = await getMembers(project);
	let tasksArray = [];
	const board = {
		name: fullProject.nome,
		members: projectMembers,
		id: fullProject.id,
		cardCount: tasksArray.length,
		columns: categories,
	};
	Render.createBoard(
		board.columns.length,
		board.name,
		board.id,
		false,
		board
	);
	localStorage.setItem("@dm-kanban:id", board.id);
	udpateSala();
	ws.send(JSON.stringify({ room: sala }));
	Render.renderData(board);
}

async function renderAllProjectsPage() {
	const ul = document.getElementById('all-boards__list')
	const body = {
		id: user.usuario.id,
	};

	const projectsIds = await Api.getAllProjects(body)
	// console.log(projectsIds.projetos)

	if ( projectsIds ) {
		projectsIds.projetos.forEach(async (project) => {
			// const data = await Api.getProjectbyId(project.projeto_id)
			console.log(project.projeto_id)

			// data.forEach(item => {
			// 	const li = document.createElement('li')
			// 	li.classList.add('all-boards--list__item')

			// 	const p = document.createElement('p')
			// 	p.textContent = item.nome

			// 	const a = document.createElement('a')
			// 	a.setAttribute('onclick', `() => {
			// 		localStorage.setItem("@dm-kanban:id", project)
			// 	}`)
			// 	a.href = 'board.html'

			// 	const editIcon = document.createElement('img')
			// 	editIcon.src = '../assets/icons/edit_FILL0_wght400_GRAD0_opsz48 (1).svg'

			// 	li.appendChild(p)
			// 	a.appendChild(editIcon)
			// 	li.appendChild(a)

			// 	ul.appendChild(li)
			// })
		})
	}
}

async function getMembers(project) {
	const body = {
		id: project,
	};
	const membersInfo = [];
	const list = document.getElementById("project-members-list");
	const members = await Api.getUsersByProject(body);
	members.projetos.forEach(async (member) => {
		const info = await Api.getUserById(member.usuario_id);
		membersInfo.push(info);
		projectMembers.push(info);
		const item = document.createElement("li");
		item.className = "menu--accordion__sub-item";
		const span = document.createElement("span");
		span.innerText = info.usuario;
		span.title = info.email;
		const button = document.createElement("button");
		const img = document.createElement("img");
		img.src = "../assets/icons/close.png";
		img.alt = "Excluir participante";
		button.append(img);
		item.append(span, button);
		list.append(item);
	});

	return membersInfo;
}

async function addMemberToProject() {
	const input = document.getElementById("adicionar-participante").value;
	const email = validateEmail(input);
	if (email) {
		const body = {
			projeto_id: localStorage.getItem("@dm-kanban:id"),
			email: input.trim(),
		};
		const newMember = await Api.getUserByEmail(input.trim());
		const projectName = document.getElementById("nome-projeto").value;
		const request = await Api.addUserToProjectByEmail(body);
		if (request.result) {
			alert(request.result);
			ws.send(
				JSON.stringify({
					tipo: "adicionar membro",
					para: newMember.id,
					por: user.usuario.usuario,
					nome_projeto: projectName,
				})
			);
		} else if (request.erro) {
			alert(request.erro);
		} else {
			alert("usuário não encontrado");
		}
	}
}

await getProjects();

async function recoverSession() {
	const categories = await Api.getCategoryByProject(openProject);
	renderProjects(openProject, categories);
}

if (openProject) {
	recoverSession();
}