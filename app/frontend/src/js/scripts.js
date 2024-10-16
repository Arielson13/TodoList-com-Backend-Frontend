const Url = 'http://localhost:5000/api/v1/todos';

// Elementos de formulário e botões
const todoForm = document.getElementById('todoForm');
const todosContainer = document.getElementById('todosContainer');
const editTituloInput = document.getElementById('editTitulo');
const editDescricaoInput = document.getElementById('editDescricao');
const confirmEditButton = document.getElementById('confirmEditButton');

// * Manipulador do Evento de Submissão do Formulário
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    await addTodo(titulo, descricao);

    todoForm.reset();
});

// * Pega os dados do banco de dados
const getTodos = async () => {
    try {
        const response = await fetch(Url);
        if (!response.ok) throw new Error('A resposta da rede não foi boa: ' + response.statusText);
        const data = await response.json();
        displayTodos(data);
    } catch (error) {
        console.error('Houve um problema com a operação de busca:', error);
    }
};

// * Componente HTML responsável por mostrar todas as tarefas
const displayTodos = (todos) => {
    todosContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'list-group';

    todos.forEach(todo => {
        ul.appendChild(createTodoElement(todo));
    });

    todosContainer.appendChild(ul);
};

// * Cria o elemento HTML para cada tarefa
const createTodoElement = (todo) => {
    const li = document.createElement('li');
    li.className = 'bg-body-tertiary p-3 mb-2 rounded list-group-item border border-secondary shadow-sm d-flex align-items-start';

    const checkbox = createCheckbox(todo);
    const div = createTodoContent(todo, checkbox);
    const buttonDiv = createActionButtons(todo);

    li.appendChild(checkbox);
    li.appendChild(div);
    li.appendChild(buttonDiv);

    return li;
};

// * Cria o checkbox para cada tarefa
const createCheckbox = (todo) => {
    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input me-3';
    checkbox.type = 'checkbox';
    checkbox.id = `check-${todo._id}`;
    checkbox.checked = todo.concluida;

    // Adiciona evento para atualizar visualmente e no backend
    checkbox.addEventListener('click', async () => {
        await toggleTodoCompletion(todo._id, !todo.concluida);
    });

    return checkbox;
};

// * Cria o conteúdo do título e descrição da tarefa
const createTodoContent = (todo, checkbox) => {
    const div = document.createElement('div');
    div.className = 'flex-grow-1';

    const h5 = document.createElement('h5');
    h5.className = 'mb-1';
    h5.textContent = todo.titulo;

    const p = document.createElement('p');
    p.className = 'mb-1';
    p.textContent = todo.descricao;

    if (todo.concluida) {
        h5.classList.add('line-through');
        p.classList.add('line-through');
    }

    // Alterna o estado de strike-through do título e descrição quando o checkbox muda
    const toggleStrikeThrough = () => {
        h5.classList.toggle('line-through');
        p.classList.toggle('line-through');
    };

    checkbox.addEventListener('change', toggleStrikeThrough);

    div.appendChild(h5);
    div.appendChild(p);
    return div;
};

// * Atualiza o estado de completude da tarefa no backend
const toggleTodoCompletion = async (id, concluida) => {
    try {
        const response = await fetch(`${Url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ concluida })
        });

        if (!response.ok) throw new Error('Erro ao atualizar o estado da tarefa: ' + response.statusText);

        console.log('Estado da tarefa atualizado com sucesso');
        await getTodos();
    } catch (error) {
        console.error('Houve um problema ao atualizar o estado da tarefa:', error);
    }
};

// * Chama a função sempre que a página é carregada
getTodos();


// * Cria os botões de ação (editar e excluir) para cada tarefa
const createActionButtons = (todo) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'd-flex';

    const editButton = createEditButton(todo);
    const deleteButton = createDeleteButton(todo);

    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);
    return buttonDiv;
};

// * Cria o botão de editar
const createEditButton = (todo) => {
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-outline-primary me-2';
    editButton.setAttribute('data-bs-toggle', 'modal');
    editButton.setAttribute('data-bs-target', '#editModal');
    editButton.innerHTML = '<i class="bi bi-pencil"></i>';

    editButton.addEventListener('click', () => {
        editTituloInput.value = todo.titulo;
        editDescricaoInput.value = todo.descricao;
        document.getElementById('editTodoId').value = todo._id;
        toggleEditButton();
    });

    return editButton;
};

// * Cria o botão de excluir
const createDeleteButton = (todo) => {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-outline-danger';
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';

    deleteButton.addEventListener('click', async () => {
        await deleteTodo(todo._id);
    });

    return deleteButton;
};

// * Alterna o estado do botão de confirmação de edição
const toggleEditButton = () => {
    const titulo = editTituloInput.value.trim();
    const descricao = editDescricaoInput.value.trim();
    const isChanged = (titulo !== document.getElementById('editTodoId').dataset.titulo || descricao !== document.getElementById('editTodoId').dataset.descricao);
    confirmEditButton.disabled = !isChanged;
};

// * Adiciona uma nova tarefa
const addTodo = async (titulo, descricao) => {
    try {
        const response = await fetch(Url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao })
        });
        if (!response.ok) throw new Error('Erro ao adicionar nova tarefa: ' + response.statusText);

        console.log('Nova tarefa adicionada:', await response.json());
        await getTodos();
    } catch (error) {
        console.error('Houve um problema ao adicionar a nova tarefa:', error);
    }
};

// * Edita uma tarefa específica
confirmEditButton.addEventListener('click', async () => {
    const id = document.getElementById('editTodoId').value;
    const titulo = editTituloInput.value;
    const descricao = editDescricaoInput.value;

    await editTodo(id, titulo, descricao);
    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
});

const editTodo = async (id, titulo, descricao) => {
    try {
        const response = await fetch(`${Url}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao })
        });
        if (!response.ok) throw new Error('Erro ao editar a tarefa: ' + response.statusText);

        console.log('Tarefa atualizada:', await response.json());
        await getTodos();
    } catch (error) {
        console.error('Houve um problema ao editar a tarefa:', error);
    }
};

// * Deleta uma tarefa específica
const deleteTodo = async (id) => {
    try {
        const response = await fetch(`${Url}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Erro ao deletar tarefa: ' + response.statusText);

        console.log('Tarefa deletada com sucesso');
        await getTodos();
    } catch (error) {
        console.error('Houve um problema ao deletar a tarefa:', error);
    }
};

// * Chama a função sempre que a página é carregada
getTodos();
