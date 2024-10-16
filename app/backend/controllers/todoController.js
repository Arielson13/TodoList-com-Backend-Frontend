import todoSchema from '../models/todoModel.js';

export const addTodo = async (req, res) => {
    try {
        const { titulo, descricao, concluida, dataLimite, criadaEm } = req.body;

        // Verificando se os campos obrigatórios foram fornecidos
        if(!titulo || !descricao){
            return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
        }

        // Criando uma nova instância do todo
        const todo = todoSchema({
            titulo, 
            descricao, 
            concluida, 
            dataLimite, 
            criadaEm
        });

        // Salvando o todo no banco de dados
        await todo.save();

        // Enviando uma resposta de sucesso
        res.status(201).json({ message: 'Todo criado com sucesso!', todo });
    } catch (error) {
        // Tratando erros gerais
        console.error('Erro ao criar todo:', error.message);
        res.status(500).json({ message: 'Erro ao criar o todo, tente novamente mais tarde.' })
    }
};

export const getAllTodos = async (req, res) => {
    try {
        // Busca todas os todos do banco de dados
        const todos = await todoSchema.find();

        // Retorna uma resposta de sucesso com a lista de todos
        res.status(200).json(todos);
    } catch (error) {
        // Tratando erros gerais
        console.error('Erro ao buscar todos:', error.message);
        res.status(500).json({ message: 'Erro ao buscar os todos, tente novamente mais tarde.' });
    }
};

export const getTodoById = async (req, res) => {
    try {
        // Obtendo o ID do todo a partir dos parâmetros da URL
        const { id } = req.params;

        // Buscando o todo no banco de dados pelo ID
        const todo = await todoSchema.findById(id);

        // Se a tarefa não for encontrada, retorna um erro 404
        if(!todo){
            return res.status(404).json({ message: 'Todo não encontrado!' });
        }

        // Retorna o todo encontrado
        res.status(200).json(todo);
    } catch (error) {
        // Trando erros (ex: ID inválido)
        console.error('Erro ao buscar o todo:', error.message);
        res.status(500).json({ message: 'Erro ao buscar o todo, tente novamente mais tarde.' })
    }
};

export const updateTodo = async (req, res) => {
    try {
        // Obtendo o ID do todo a partir dos parâmetros da URL
        const { id } = req.params;

        // Obtendo os campos atualizados do corpo da requisição
        const { titulo, descricao, concluida, dataLimite } = req.body;

        // Buscando e atualizando o todo no banco de dados
        const todo = await todoSchema.findByIdAndUpdate(
            id,
            { titulo, descricao, concluida, dataLimite },
            { new: true, runValidators: true } // Retorna o documento atualizado e aplica as validações do Schema
        );

        // Se o todo não for encontrado, retornar um erro 404
        if(!todo){
            return res.status(404).json({ message: 'Todo não encontrado!' });
        }

        // Retorna o todo atualizado
        res.status(200).json(todo);
    } catch (error) {
        // Trantando erros (ex: ID inválido ou problema de validação)
        console.error('Erro ao atualizar o todo', error.message);
        res.status(500).json({ message: 'Erro ao atualizar o todo, tente novamente mais tarde.' })
    }
};

export const deleteTodo = async (req, res) => {
    try {
        // Obtendo o ID do todo a partir do parâmetro da URL
        const { id } = req.params;

        // Buscando e deletando o todo no banco de dados
        const todo = await todoSchema.findByIdAndDelete(id);

        // Se o todo não for encontrado, retornar um erro 404
        if(!todo){
            return res.status(404).json({ message: 'Todo não encontrado!' })
        }

        // Retorna uma resposta de sucesso informando que o todo foi excluído
        res.status(200).json({ message: 'Todo excluído com sucesso!' })
    } catch (error) {
        // Tratando error (ex: ID inválido)
        console.error('Erro ao deletar todo', error.message);
        res.status(500).json({ mssage: 'Erro ao deletar o todo, tente novamente mais tarde.' })
    }
};