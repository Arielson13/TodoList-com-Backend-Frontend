import mongoose from 'mongoose';

// Defiindo o esquema da tarefa
const todoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    },
    concluida: {
        type: String,
        default: false
    },
    dataLimite:{
        type: Date,
    },
    criadaEm: {
        type: Date,
        default: Date.now,
    }
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;