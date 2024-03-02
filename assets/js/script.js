const taskDisplayEl = $('#task-display');
const taskFormEl = $('#task-form');
const taskNameInputEl = $('#task-name-input');
const taskTypeInputEl = $('#task-description');
const taskDateInputEl = $('#taskDueDate');



// ? Reads tasks from local storage and returns array of task objects.
// ? If there are no tasks in localStorage, it initializes an empty array ([]) and returns it.
  // ? Retrieve tasks from localStorage and parse the JSON to an array.
  // ? We use `let` here because there is a chance that there are no tasks in localStorage (which means the tasks variable will be equal to `null`) and we will need it to be initialized to an empty array.
   // ? If no tasks were retrieved from localStorage, assign tasks to a new empty array to push to later.
    // ? Return the tasks array either empty or with data in it whichever it was determined to be by the logic right above.
function readTasksFromStorage() {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  if (!tasks) {
    tasks = [];
  } return tasks;
}

// ? Accepts an array of tasks, stringifys them, and saves them in localStorage.
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ? Creates a task card from the information passed in `task` parameter and returns it.
  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
      // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        // ? Gather all the elements created above and append them to the correct elements.
          // ? Return the card so it can be appended to the correct lane.
            // ? Return the card so it can be appended to the correct lane.
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

// ? Empty existing task cards out of the lanes
  // ? Loop through tasks and create task cards for each status
    // ? Use JQuery UI to make task cards draggable
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
          // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
                // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
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

// ? Removes a task from local storage and prints the task data back to the page
  // ? Remove task from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the task.
   // ? We will use our helper function to save the tasks to localStorage
    // ? Here we use our other function to print tasks back to the screen
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

// ? Adds a task to local storage and prints the task data
  // ? Read user input from the form
     // ? Here we use a Web API called `crypto` to generate a random id for our task. This is a unique identifier that we can use to find the task in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
     // ? Pull the tasks from localStorage and push the new task to the array
      // ? Save the updated tasks array to localStorage
      // ? Print task data back to the screen
        // ? Clear the form inputs
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

// ? This function is called when a card is dropped into a lane. It updates the status of the task and saves it to localStorage. You can see this function is called in the `droppable` method below.
  // ? Read tasks from localStorage
   // ? Get the task id from the event
   // ? Get the id of the lane that the card was dropped into
     // ? Find the task card by the `id` and update the task status.
       // ? Save the updated tasks array to localStorage (overwritting the previous one) and render the new task data to the screen.
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

// ? Add event listener to the form element, listen for a submit event, and call the `handleTaskFormSubmit` function.
taskFormEl.on('submit', handleTaskFormSubmit);

// ? Because the cards are dynamically added to the screen, we have to use jQuery event delegation to listen for clicks on the added cards delete button.
// ? We listen for a click on the parent element, and THEN check if the target of the click is the delete button. If it is, we call the `handleDeleteTask` function
taskDisplayEl.on('click', '.btn-delete-task', handleDeleteTask);



// ? When the document is ready, print the task data to the screen and make the lanes droppable. Also, initialize the date picker.
$(document).ready(function () {
  // ? Print task data to the screen on page load if there is any
  printTaskData();

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // ? Make lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
});
