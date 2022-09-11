import { app } from "./app.js";
import config from "./config.js";
import { pool } from "./db.js";
const { PORT } = config;

app.listen(config.PORT, () => {
      console.log(`Servidor rodando na porta ${config.PORT}`);
});
