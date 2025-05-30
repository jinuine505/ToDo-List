/**
 * storage.js contains the functions for storing the task data into local storage.
 */

import * as functions from "./taskFunctions.js";

export function saveToStorage(taskList) {
    // Array of the tasks
    const tasksArray = [];

    // All list items
    const allTasks = taskList.querySelectorAll('li');

    for (let task of allTasks) {
        // Variables of task info
        const taskText = task.firstChild.textContent.trim();
        const isCompleted = task.classList.contains('complete');

        // Push task into array
        tasksArray.push({taskText, isCompleted});
    }

    // Store task into local storage
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

export function loadStorage(taskList) {
    // Retrieve tasks from local storage
    const storedTasks = localStorage.getItem('tasks');

    // Exit if empty
    if (!storedTasks) return;

    // Convert storedTasks into an array
    const storedTasksArray = JSON.parse(storedTasks);

    for (let task of storedTasksArray)
    {
        // Create new task from stored task info
        const loadedTask = createTaskFromStorage(task.taskText, task.isCompleted, taskList);
        
        // Add new task to list
        taskList.appendChild(loadedTask);
    }

    functions.updateProgressBar();
}

function createTaskFromStorage(text, isCompleted, taskList)
{
    // Variables
    const newTask = document.createElement('li');
    const taskText = document.createElement('span');
    const completeBtn = document.createElement('button');
    const undoBtn = document.createElement('button');
    const delBtn = document.createElement('button');


    // Write input to task text
    taskText.textContent = text;
    taskText.classList.add('task-text');

    // Add test to list item
    newTask.appendChild(taskText);

    // Create complete button
    const checkIcon = document.createElement('i'); // Add check icon to complete button
    checkIcon.classList.add('fa-solid', 'fa-check');
    completeBtn.appendChild(checkIcon);
    
    completeBtn.classList.add('complete-btn');
    completeBtn.setAttribute('title', 'Complete task')
    completeBtn.addEventListener('click', () => {
        functions.completeTask(newTask);
        saveToStorage(taskList);
        completeBtn.style.display = 'none'; // Remove complete button after
        undoBtn.style.display = 'inline-block'; // Display undo button
    });

    // Create undo button
    const undoIcon = document.createElement('i'); // Add undo icon to undo button
    undoIcon.classList.add('fa-solid', 'fa-rotate-left');
    undoBtn.appendChild(undoIcon);

    undoBtn.classList.add('undo-btn');
    undoBtn.setAttribute('title', 'Undo complete')
    undoBtn.style.display = 'none';
    undoBtn.addEventListener('click', () => {
        functions.undoTask(newTask);
        saveToStorage(taskList);
        undoBtn.style.display = 'none'; // Remove complete button after
        completeBtn.style.display = 'inline-block'; // Display complete button
    });

    // Create delete button
    const icon = document.createElement('i'); // Add trash icon to delete button
    icon.classList.add('fa-solid', 'fa-trash')
    delBtn.appendChild(icon);
    delBtn.classList.add('del-btn');
    delBtn.setAttribute('title', 'Delete task')
    delBtn.style.display = 'inline-block';
    delBtn.addEventListener('click', () => {
        functions.delTask(newTask);
        saveToStorage(taskList);
    });

    // Add buttons into a div
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(undoBtn);
    btnContainer.appendChild(delBtn);

    // Add buttons into the task container 
    newTask.appendChild(btnContainer);

    // Mark task as completed or to-do
    if (isCompleted) {
        completeBtn.style.display = 'none';
        undoBtn.style.display = 'inline-block';
        newTask.classList.add('complete')
    }
    else {
        undoBtn.style.display = 'none';
        completeBtn.style.display = 'inline-block';
        newTask.classList.add('to-do')
    }

    return newTask;
}