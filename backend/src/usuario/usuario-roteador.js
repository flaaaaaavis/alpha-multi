import express from 'express';
import jwt from "jsonwebtoken";
import config from '../config';
import hashPwd, { comparePwd } from '../hashPwd';
import { UserService } from './usuario-servico';

const jsonBodyParser = express.json();
const UserRouter = express.Router();

UserRouter.route('/').post(jsonBodyParser, async (req, res) => {
    
    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    for (let prop of ['usuario', 'email', 'senha']) {
        if (req.body[prop] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing '${prop}' property on request body` });
        }
    }

    const { usuario, email, senha } = req.body;

    const novoUsuario = {
        usuario: usuario,
        email: email,
        senha: senha
    };

    const dbRes = await UserService.insertUsuario(novoUsuario)

    if (dbRes) {
        res.status(201).json(dbRes);
    } else {
        res.status(500).json({message:"Internal Server Error"});
    }
        
})

.patch(jsonBodyParser, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    for (let prop of ['email', 'usuario']) {
        if (req.body[prop] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing '${prop}' property on request body` });
        }
    }

    const { id , email, usuario } = req.body;

    const novoUsuario = {
        email: email,
        usuario: usuario,
    };

    const dbRes = await UserService.updateUsuario(id, novoUsuario);

    if (dbRes) {
        
        res.status(201).json(dbRes); 

    } else {
        
        res.status(500).json({message:"Internal Server Error"})

    }
    
})

.delete(jsonBodyParser, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }

    const { id } = req.body;

    const dbRes = await UserService.deleteUsuario(id);

    if (dbRes) {

        res.status(201).json(dbRes);
        
    } else {

        res.status(500).json({message:"Internal Server Error"})

    }
    
   
});

UserRouter.route('/').patch(jsonBodyParser, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    if (req.body['senha'] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing 'senha' property on request body` });
    }

    const { id , senha } = req.body;

    const novaSenha = hashPwd(senha)

    const dbRes = await UserService.updateUsuarioSenha(id, novaSenha);

    if (dbRes) {
        
        res.status(201).json(dbRes); 

    } else {
        
        res.status(500).json({message:"Internal Server Error"})

    }
    
})

UserRouter.route('/login').post(jsonBodyParser, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    for (let prop of ['email', 'senha']) {
        if (req.body[prop] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing '${prop}' property on request body` });
        }
    }

    const { email, senha } = req.body;

    const usuario = await UserService.getUsuarioByEmail(email);
    if (!usuario.id) {
        return res.status(400).json({ Error: `Email inválido` });
    }
    
    if (comparePwd(senha, usuario.senha)) {

        const token = jwt.sign({ usuario: usuario }, config.API_KEY);

        return res.json({ auth: true, token})

    } else {
        return res.status(400).json({ Error: `Senha inválida` });
    }

});

export default UserRouter;