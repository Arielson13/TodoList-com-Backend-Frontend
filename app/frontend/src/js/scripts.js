document.addEventListener('DOMContentLoaded', function () {
    const todoListElement = document.getElementById('todo-list');
    const todoForm = document.getElementById('todo-form');
    const todoTitle = document.getElementById('todo-title');
    const todoDescription = document.getElementById('todo-description');
    const errorMessage = document.getElementById('error-message');

    const editTodoModal = new bootstrap.Modal(document.getElementById('editTodoModal'));
    const editTodoForm = document.getElementById('edit-todo-form');
    const editTodoTitle = document.getElementById('edit-todo-title');
    const editTodoDescription = document.getElementById('edit-todo-description');
    
    let editingTodoId = null;

    // Função para buscar todos os itens
    async function fetchTodos() {
        try {
            const response = await fetch('http://localhost:5000/api/v1/todos');
            const todos = await response.json();
            renderTodos(todos);
        } catch (error) {
            console.error('Erro ao buscar os todos:', error);
        }
    }

    // Função para renderizar os todos na página
    function renderTodos(todos) {
        todoListElement.innerHTML = ''; // Limpa a lista antes de renderizar
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'p-3', 'mb-2', 'rounded', 'shadow-sm');

            const completedClass = todo.concluida === "true" ? 'completed' : '';

            todoItem.innerHTML = `
                <div class="d-flex align-items-center ${completedClass}">
                    <input type="checkbox" class="form-check-input me-3" ${todo.concluida === "true" ? 'checked' : ''} data-id="${todo._id}">
                    <div>
                        <strong>${todo.titulo}</strong>
                        <p class="mb-0">${todo.descricao}</p>
                        <small>Data de Criação: ${new Date(todo.criadaEm).toLocaleDateString()}</small>
                    </div>
                </div>
                <div>
                    <button class="btn btn-warning btn-sm edit-btn me-2" data-id="${todo._id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${todo._id}">Excluir</button>
                </div>
            `;

            // Adicionar evento para o checkbox
            const checkbox = todoItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function () {
                updateTodoStatus(todo._id, checkbox.checked);
            });

            // Adicionar evento para o botão de excluir
            const deleteButton = todoItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', function () {
                deleteTodo(todo._id);
            });

            // Adicionar evento para o botão de editar
            const editButton = todoItem.querySelector('.edit-btn');
            editButton.addEventListener('click', function () {
                startEditing(todo._id, todo.titulo, todo.descricao);
            });

            todoListElement.appendChild(todoItem);
        });
    }

    // Função para adicionar nova tarefa
    async function addTodo(newTodo) {
        try {
            const response = await fetch('http://localhost:5000/api/v1/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            });
            if (response.ok) {
                fetchTodos(); // Recarrega a lista de todos
            }
        } catch (error) {
            console.error('Erro ao adicionar o todo:', error);
        }
    }

    // Função para atualizar o status de conclusão de uma tarefa
    async function updateTodoStatus(id, concluida) {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ concluida: concluida ? "true" : "false" })
            });
            if (response.ok) {
                fetchTodos(); // Recarrega a lista de todos
            }
        } catch (error) {
            console.error('Erro ao atualizar o todo:', error);
        }
    }

    // Função para excluir uma tarefa
    async function deleteTodo(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/todos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchTodos(); // Recarrega a lista de todos
            }
        } catch (error) {
            console.error('Erro ao excluir o todo:', error);
        }
    }

    // Função para iniciar a edição de uma tarefa
    function startEditing(id, titulo, descricao) {
        editingTodoId = id;
        editTodoTitle.value = titulo;
        editTodoDescription.value = descricao;
        editTodoModal.show();
    }

    // Função para editar uma tarefa
    async function editTodo(id, updatedTodo) {
        try {
            const response = await fetch(`http://localhost:5000/api/v1/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTodo)
            });
            if (response.ok) {
                fetchTodos(); // Recarrega a lista de todos
                editTodoModal.hide();
            }
        } catch (error) {
            console.error('Erro ao editar o todo:', error);
        }
    }

    // Evento de submissão do formulário para adicionar nova tarefa
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Limpa qualquer mensagem de erro anterior
        errorMessage.style.display = 'none';

        // Verifica se os campos estão preenchidos
        if (todoTitle.value.trim() === '' || todoDescription.value.trim() === '') {
            errorMessage.textContent = 'Por favor, preencha todos os campos antes de adicionar uma tarefa.';
            errorMessage.style.display = 'block';
            return;
        }

        const newTodo = {
            titulo: todoTitle.value,
            descricao: todoDescription.value,
            concluida: "false",
            criadaEm: new Date().toISOString()
        };

        if (!editingTodoId) {
            addTodo(newTodo);
        }

        // Limpar os campos de entrada
        todoTitle.value = '';
        todoDescription.value = '';
    });

    // Submissão do formulário de edição no modal
    editTodoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const updatedTodo = {
            titulo: editTodoTitle.value,
            descricao: editTodoDescription.value,
            concluida: "false"
        };
        editTodo(editingTodoId, updatedTodo);
    });

    // Chamar a função para buscar e exibir os todos
    fetchTodos();
});
