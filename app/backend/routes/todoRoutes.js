import express from 'express';
import { 
        addTodo, 
        getAllTodos, 
        getTodoById, 
        updateTodo,
        deleteTodo
} from '../controllers/todoController.js' 

const router = express.Router();

// Rota para criar uma nova tarefa
router.post('/todos', addTodo);

// Rota para obter todos os todos
router.get('/todos', getAllTodos);

// Rota para obter um todo por ID
router.get('/todos/:id', getTodoById);

// Rota para atualizar um todo por ID
router.put('/todos/:id', updateTodo);

// Rota para deletar um todo por ID
router.delete('/todos/:id', deleteTodo);

export default router;