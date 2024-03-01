// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));





// ----------------------------------------------------------------------------------------------------
// vvvvvvvv
// ----------------------------------------------------------------------------------------------------

const projectDisplayEl = $('#project-display');

const projectFormEl = $('#project-form');

projectDisplayEl.on('click', '.btn-delete-project', handleDeleteTask);

// ----------------------------------------------------------------------------------------------------
// ^^^^^^^^^^^^^
// ----------------------------------------------------------------------------------------------------


// Todo: create a function to generate a unique task id
function generateTaskId() {

}





// ----------------------------------------------------------------------------------------------------
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// ----------------------------------------------------------------------------------------------------
// Todo: create a function to create a task card
function createTaskCard(project) {
    const taskCard = $('<div>')
      .addClass('card project-card draggable my-3')
      .attr('data-project-id', project.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(project.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(project.type);
    const cardDueDate = $('<p>').addClass('card-text').text(project.dueDate);
    const cardDeleteBtn = $('<button>')
      .addClass('btn btn-danger delete')
      .text('Delete')
      .attr('data-project-id', project.id);
    cardDeleteBtn.on('click', handleDeleteTask);
  
    // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (project.dueDate && project.status !== 'done') {
      const now = dayjs();
      const taskDueDate = dayjs(project.dueDate, 'DD/MM/YYYY');
  
      // ? If the task is due today, make the card yellow. If it is overdue, make it red.
      if (now.isSame(taskDueDate, 'day')) {
        taskCard.addClass('bg-warning text-white');
      } else if (now.isAfter(taskDueDate)) {
        taskCard.addClass('bg-danger text-white');
        cardDeleteBtn.addClass('border-light');
      }
    }
  
    // ? Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
  
    // ? Return the card so it can be appended to the correct lane.
    return taskCard;
  }
// ----------------------------------------------------------------------------------------------------
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ----------------------------------------------------------------------------------------------------




// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
// -------------------------------------------------------------------------------------------
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// -------------------------------------------------------------------------------------------------

function handleDeleteTask(event) { 
    const projectId = $(this).attr('data-project-id');
    const projects = readProjectsFromStorage();
  
    // ? Remove project from the array. 
    projects.forEach((project) => {
      if (project.id === projectId) {
        projects.splice(projects.indexOf(project), 1);
      }
    });
  
    // ? We will use our helper function to save the projects to localStorage
    saveProjectsToStorage(projects);
  
    // ? Here we use our other function to print projects back to the screen
    printProjectData();
}
  
projectFormEl.on('submit', handleProjectFormSubmit);
// -------------------------------------------------------------------------------------------------
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// -------------------------------------------------------------------------------------------------
// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}



// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
