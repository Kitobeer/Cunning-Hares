// Массив для хранения задач
let tasks = [];
let currentFilter = 'all'; // all, in-progress, done, abandoned

// Получаем элементы страницы
const taskListContainer = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const assigneeInput = document.getElementById('assigneeInput');
const newTaskStatus = document.getElementById('newTaskStatus');
const addButton = document.getElementById('addButton');
const taskCountSpan = document.getElementById('taskCount');
const filterButtons = document.querySelectorAll('.filter-btn');

// Функция добавления задачи
function addTask() {
    const taskText = taskInput.value.trim();
    const assignee = assigneeInput.value.trim();
    const status = newTaskStatus.value;
    
    if (taskText === '') {
        alert('Введите текст задачи!');
        return;
    }
    
    if (assignee === '') {
        alert('Укажите исполнителя!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        assignee: assignee,
        status: status, // 'in-progress', 'done', 'abandoned'
        completed: (status === 'done')
    };
    
    tasks.push(task);
    
    // Очищаем поля ввода
    taskInput.value = '';
    assigneeInput.value = '';
    newTaskStatus.value = 'in-progress';
    
    renderTasks();
}

// Функция отображения задач (таблица)
function renderTasks() {
    // Фильтруем задачи
    let filteredTasks = tasks;
    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => task.status === currentFilter);
    }
    
    // Очищаем контейнер
    taskListContainer.innerHTML = '';
    
    // Создаём строки для каждой задачи
    filteredTasks.forEach(task => {
        const row = document.createElement('div');
        row.className = 'task-row';
        if (task.status === 'done') {
            row.classList.add('completed');
        }
        
        // Колонка Статус (выпадающий список)
        const statusCol = document.createElement('div');
        statusCol.className = 'col-status';
        const statusSelect = document.createElement('select');
        statusSelect.className = `status-select status-${task.status}`;
        statusSelect.innerHTML = `
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>В процессе</option>
            <option value="done" ${task.status === 'done' ? 'selected' : ''}>Сделано</option>
            <option value="abandoned" ${task.status === 'abandoned' ? 'selected' : ''}>Брошено</option>
        `;
        statusSelect.addEventListener('change', (e) => {
            updateTaskStatus(task.id, e.target.value);
        });
        statusCol.appendChild(statusSelect);
        
        // Колонка Задание
        const taskCol = document.createElement('div');
        taskCol.className = 'col-task';
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = task.text;
        taskCol.appendChild(taskSpan);
        
        // Колонка Исполнитель
        const assigneeCol = document.createElement('div');
        assigneeCol.className = 'col-assignee';
        assigneeCol.textContent = task.assignee;
        
        // Колонка Удалить (иконка)
        const deleteCol = document.createElement('div');
        deleteCol.className = 'col-add';
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.color = '#bbb';
        deleteBtn.style.fontSize = '14px';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        deleteCol.appendChild(deleteBtn);
        
        row.appendChild(statusCol);
        row.appendChild(taskCol);
        row.appendChild(assigneeCol);
        row.appendChild(deleteCol);
        
        taskListContainer.appendChild(row);
    });
    
    updateCounter();
}

// Обновление статуса задачи
function updateTaskStatus(id, newStatus) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = newStatus;
        task.completed = (newStatus === 'done');
        renderTasks();
    }
}

// Удаление задачи
function deleteTask(id) {
    if (confirm('Вы уверены?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
}

// Обновление счётчика
function updateCounter() {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const abandoned = tasks.filter(t => t.status === 'abandoned').length;
    taskCountSpan.textContent = `Всего: ${total} | В процессе: ${inProgress} | Сделано: ${done} | Брошено: ${abandoned}`;
}

// Установка фильтра
function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    renderTasks();
}

// Обработчики событий
addButton.addEventListener('click', addTask);

// Enter в полях ввода
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
assigneeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Фильтры
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Инициализация
renderTasks();