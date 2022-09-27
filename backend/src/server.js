import config from "./config.js";
import { app } from "./app.js";

// import { pool } from "./db.js";
const { PORT } = config;
import { v4 } from "uuid";

import http from "http";
//const express = require("express");

import WebSocket, { WebSocketServer } from "ws";
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

/* app.listen(config.PORT, () => {
      console.log(`Servidor rodando na porta ${config.PORT}`);
}); */

wss.on("connection", (ws) => {
	console.log("novo cliente conectado");
	/* 	ws.id = v4();
	wss.clients.forEach((client) => {
		console.log("Client.ID: " + client.id);
	}); */

	ws.on("message", (data) => {
		const mensagem = JSON.parse(data);
		if (mensagem.tipo == "conexão") {
			ws.id = mensagem.usuario;
		} else if (mensagem.room) {
			ws.room = mensagem.room;
		}
		console.log(mensagem);
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				/* console.log(client.room, mensagem.sala); */
				if (client.room == mensagem.sala) {
					client.send(JSON.stringify(mensagem));
				}
				//if (client.id == mensagem.para) {
				//	console.log("para", client.id);
				//	client.send(JSON.stringify(mensagem));
				//}
			}
		});
	});

	ws.on("close", () => {
		console.log("cliente desconectado");
	});
});

server.listen(PORT, () => {
	console.log(`conectado na porta ${PORT}`);
});
