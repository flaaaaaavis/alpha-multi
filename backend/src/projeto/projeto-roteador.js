import express from 'express';
import { ProjectService } from './projeto-servico.js';

const jsonBodyParser = express.json();
const ProjectRouter = express.Router();

ProjectRouter.route('/').post(jsonBodyParser, async (req, res) => {
    
    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    for (let prop of ['nome']) {
        if (req.body[prop] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing '${prop}' property on request body` });
        }
    }

    const { nome } = req.body;

    const projeto = {
        nome: nome
    };

    const dbRes = await ProjectService.insertProjeto(projeto)

    if (dbRes) res.status(201).json(dbRes);
    res.status(500).json({message:"Internal Server Error"})
        
});

ProjectRouter.route('/:project_uuid').patch(jsonBodyParser, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    for (let prop of ['nome']) {
        if (req.body[prop] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing '${prop}' property on request body` });
        }
    }

    const { nome, id } = req.body;

    const projeto = {
        nome: nome
    };

    const dbRes = await ProjectService.updateProjeto(id, projeto);

    if (dbRes) res.status(201).json(dbRes);
    res.status(500).json({message:"Internal Server Error"})
})

.delete(jsonBodyParser, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }

    const { id } = req.body;

    const dbRes = await ProjectService.deleteProjeto(id);

    if (dbRes) res.status(201).json(dbRes);
    res.status(500).json({message:"Internal Server Error"})
   
  });

export default ProjectRouter;