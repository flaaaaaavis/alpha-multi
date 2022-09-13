import { app } from "./app.js";
import config from "./config.js";
import { pool } from "./db.js";
const { PORT } = config;

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

	ws.on("message", (data) => {
		const mensagem = JSON.parse(data);
		console.log(mensagem);
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(mensagem));
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
