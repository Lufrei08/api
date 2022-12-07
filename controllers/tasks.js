let Task = require('../models/Task');
let User = require('../models/User');

module.exports = {
    getTasksByUser: async (req, res, next) => {
        try {
            const idUser = req.user._id;
            let task = await Task.find({ "idUser": idUser });

            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json({ msg: 'Tasks não encontrada!', error: error.message })
        }
    },

    getTasksByStatus: async (req, res, next) => {
        let status = req.params.status;

        if (status == "true") {
            try {
                let task = await Task.find({ "status": true, "idUser": req.user._id });
                return res.status(200).json(task);
            } catch (error) {
                return res.status(500).json({ msg: 'Você não possui tarefas concluidas!', error: error.message })
            }
        } else {
            try {
                let task = await Task.find({ "status": false, "idUser": req.user._id });
                return res.status(200).json(task);
            } catch (error) {
                return res.status(500).json({ msg: 'Você não possui tarefas a serem concluidas!', error: error.message })
            }
        }
    },

    addTask: async (req, res, next) => {
        //Adiciona um elemento ao banco
        let newTask = new Task();
        newTask.conteudo = req.body.conteudo;
        newTask.idUser = req.user._id;
        console.log(newTask.idUser);
        if (req.user._id = null) {
            return res.status(500).json({ msg: 'Faça login e tente novamente!', error: error.message })
        } else {
            try {
                //Salva a tarefa no banco, junto com o id de usuário
                let savedTask = await newTask.save();
                console.log(newTask.idUser);
                return res.status(201).json({ msg: 'Tarefa adicionada com sucesso!', savedTask })
            } catch (error) {
                return res.status(500).json({ msg: 'Erro ao adicionar tarefa', error: error.message })
            }
        }
    },

    updateTask: async (req, res, next) => {
        let idTask = req.params.id;
        let taskUpdate = {};

        if (req.body.conteudo) taskUpdate.conteudo = req.body.conteudo;
        if (req.body.status) taskUpdate.status = req.body.status;

        try {
            await Task.findByIdAndUpdate(idTask, taskUpdate);
            return res.status(200).json({ msg: "Tarefa atualizada com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: 'Não foi possível atualizar esta tarefa', error: error.message });
        }
    },

    deleteTask: async (req, res, next) => {
        let idTask = req.params.id;

        try {
            let taskDeleted = await Task.findByIdAndDelete(idTask);
            res.status(200).json({ msg: 'Tarefa deletada com sucesso!', task: taskDeleted })
        } catch (error) {
            res.status(500).json({ msg: 'Não foi possível deletar esta tarefa', error: error.message });
        }
    }
}