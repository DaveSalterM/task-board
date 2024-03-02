const taskDisplayEl = $('#task-display');
const taskFormEl = $('#task-form');
const taskNameInputEl = $('#task-name-input');
const taskTypeInputEl = $('#task-description');
const taskDateInputEl = $('#taskDueDate');

// Read tasks from local storage
function readTasksFromStorage() {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  if (!tasks) {
    tasks = [];
  } return tasks;
}

// Save tasks to local storage
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create task card with appropriate color based on time left to complete
function createTaskCard(task) {
  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Create draggable cards to move between lanes
function printTaskData() {
  const tasks = readTasksFromStorage();
  
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let task of tasks) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    
    helper: function (e) {

      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');

      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Print task and remove from local storage
function handleDeleteTask() {
  const taskId = $(this).attr('data-task-id');
  const tasks = readTasksFromStorage();

  tasks.forEach((task) => {
    if (task.id === taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  saveTasksToStorage(tasks);

  printTaskData();
}

// Add task with random I.D. to storage
function handleTaskFormSubmit(event) {
  event.preventDefault();

  const taskName = taskNameInputEl.val().trim();
  const taskType = taskTypeInputEl.val();
  const taskDate = taskDateInputEl.val();

  const newTask = {
 
    id:crypto.randomUUID(),
    name: taskName,
    type: taskType,
    dueDate: taskDate,
    status: 'to-do',
  };

  const tasks = readTasksFromStorage();
  tasks.push(newTask);

  saveTasksToStorage(tasks);

  printTaskData();

  taskNameInputEl.val('');
  taskTypeInputEl.val('');
  taskDateInputEl.val('');
}

//function to handle when cards are moved between lanes
function handleDrop(event, ui) {

  const tasks = readTasksFromStorage();

  const taskId = ui.draggable[0].dataset.taskId;

  const newStatus = event.target.id;

  for (let task of tasks) {
  
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  printTaskData();
}

//Buttons
taskFormEl.on('submit', handleTaskFormSubmit);

taskDisplayEl.on('click', '.btn-delete-task', handleDeleteTask);

//Make lanes droppable
$(document).ready(function () {

  printTaskData();

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
});
