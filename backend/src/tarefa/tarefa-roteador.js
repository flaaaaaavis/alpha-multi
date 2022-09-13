import express from 'express';
import { TaskService } from './tarefa-servico.js';

const jsonBodyParser = express.json();
const TaskRouter = express.Router();

TaskRouter.route('/').post(jsonBodyParser, async (req, res) => {
    
    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    for (let prop of ['coluna_id', 'nome', 'ordem', 'tags']) {
        if (req.body[prop] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing '${prop}' property on request body` });
        }
    }

    const { coluna_id, nome, ordem, tags, anotacoes } = req.body;

    const tarefa = {
        coluna_id: coluna_id,
        nome: nome,
        ordem: parseInt(ordem),
        tags: tags,
        anotacoes: anotacoes || "",
    };

    const dbRes = await TaskService.insertTarefa(tarefa)

    if (dbRes) {
        res.status(201).json(dbRes);
    } else {
        res.status(500).json({message:"Internal Server Error"});
    }
        
});

TaskRouter.route('/:task_uuid').patch(jsonBodyParser, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ Error: `Missing request body` });
    }
    
    for (let prop of ['coluna_id', 'nome', 'ordem', 'tags']) {
        if (req.body[prop] === undefined) {
        return res
            .status(400)
            .json({ Error: `Missing '${prop}' property on request body` });
        }
    }

    const { coluna_id, nome, ordem, tags, anotacoes, id } = req.body;

    const tarefa = {
        coluna_id: coluna_id,
        nome: nome,
        ordem: parseInt(ordem),
        tags: tags,
        anotacoes: anotacoes || "",
    };

    const dbRes = await TaskService.updateTarefa(id, tarefa);

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

    const dbRes = await TaskService.deleteTarefa(id);

    if (dbRes) {

        res.status(201).json(dbRes);
        
    } else {

        res.status(500).json({message:"Internal Server Error"})

    }
    
   
  });

export default TaskRouter;