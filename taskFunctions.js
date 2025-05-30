/**
 * taskFunctions.js contains the main functions the app will use.
 */

import { saveToStorage } from './storage.js';

/** Adds a given task to the list of tasks */
export function addTask(taskList, taskInput) {
    // Variables
    const task = taskInput.value;
    const newTask = document.createElement('li');
    const taskText = document.createElement('span');
    const completeBtn = document.createElement('button');
    const undoBtn = document.createElement('button');
    const delBtn = document.createElement('button');

    if (validateInput(taskInput)) return; // Validate the input

    // Write input to task text
    taskText.textContent = task;
    taskText.classList.add('task-text');

    newTask.appendChild(taskText); // Add test to list item

    // Create complete button
    completeBtn.classList.add('complete-btn');
    completeBtn.textContent = "Complete";
    completeBtn.addEventListener('click', () => {
        completeTask(newTask);
        saveToStorage(taskList);
        completeBtn.style.display = 'none'; // Remove complete button after
        undoBtn.style.display = 'inline-block'; // Display undo button
    });

    // Create undo button
    undoBtn.classList.add('undo-btn');
    undoBtn.textContent = "Undo";
    undoBtn.style.display = 'none';
    undoBtn.addEventListener('click', () => {
        undoTask(newTask);
        saveToStorage(taskList);
        undoBtn.style.display = 'none'; // Remove complete button after
        completeBtn.style.display = 'inline-block'; // Display complete button
    });

    // Create delete button
    delBtn.classList.add('del-btn');
    delBtn.textContent = "Delete";
    delBtn.style.display = 'inline-block';
    delBtn.addEventListener('click', () => {
        delTask(newTask);
        saveToStorage(taskList);
    });

    // Add buttons into a div
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(undoBtn);
    btnContainer.appendChild(delBtn);
    newTask.appendChild(btnContainer); // Add buttons into the task container 

    newTask.classList.add('to-do'); // Initially marked as to-do

    taskList.appendChild(newTask); // Wriite new task and add to task list

    saveToStorage(taskList); // Update local storage

    taskInput.value = ''; // Clear text in the text input

    updateProgressBar();
}

/** Clears all tasks in the given task list */
export function clearTasks(taskList) {
    if (!confirmEmpty(taskList)) {
        if (confirm("Are you sure you want to clear?") == true) {
            taskList.replaceChildren(); // Remove all tasks from list

            saveToStorage(taskList); // Update local storage

            updateProgressBar();
        }
    }
}

/** Checks if given list is empty */
function confirmEmpty(taskList) {
    return (taskList.children.length == 0);
}

/** Completes the task when complete button is clicked */
export function completeTask(task) {
    task.classList.remove('to-do')
    task.classList.add('complete');
    updateProgressBar();
}

/** Undoes task completion when undo button is clicked */
export function undoTask(task) {
    task.classList.remove('complete');
    task.classList.add('to-do');
    updateProgressBar();
}

/** Deletes the task when delete button is clicked */
export function delTask(task) {
    task.remove();
    updateProgressBar();
}

/** Checks that the task input is valid */ 
function validateInput(taskInput) {
    const errorMsg = document.querySelector('#error-message'); // Variable for error message container

    // Check input is not empty
    if (taskInput.value.trim() === "") {
        shakeAnimation(taskInput); // Run text field animation

        inputErrorMessage(errorMsg, "No task inputted"); // Display empty input error

        return true;
    }

    // Check task count does not exceed limit
    const totalTasks = document.querySelectorAll('.list-container li').length;
    if (totalTasks >= 25) {
        shakeAnimation(taskInput); // Run text field animation


        inputErrorMessage(errorMsg, "Limit 25 tasks"); // Display duplicate task error

        return true;
    }

    // Check that input characters are allowed
    const regEx = /[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]/;
    if (!regEx.test(taskInput.value.trim())) {
        shakeAnimation(taskInput); // Run text field animation
    
        inputErrorMessage(errorMsg, "Illegal character(s)"); // Display duplicate task error

        return true;
    }

    // Check for duplicate tasks
    const currentTasks = document.querySelectorAll('.list-container li');
    for (let i of currentTasks) {
        if (i.firstChild.textContent.toLowerCase().trim() === taskInput.value.toLowerCase().trim()) {
            shakeAnimation(taskInput); // Run text field animation

            inputErrorMessage(errorMsg, "Duplicate task"); // Display duplicate task error

            return true;
        }
    }

    errorMsg.style.visibility = "hidden"; // Hide error message if input is valid
}

/** Update progress bar based on current tasks */
export function updateProgressBar() {
    // Variables
    const totalTasks = document.querySelectorAll('.list-container li').length;
    const completeTasks = document.querySelectorAll('.list-container li.complete').length;
    const progressBar = document.querySelector('#task-progress');

    // Update progress bar
    const curPercent = totalTasks > 0 ? (completeTasks / totalTasks) * 100 : 0;
    progressBar.value = curPercent;

    // Update task count
    const taskCount = document.querySelector('#progress-count-total');
    taskCount.textContent = totalTasks;

    // Update completed task count
    const completeTaskCount = document.querySelector('#progress-count-complete');
    completeTaskCount.textContent = completeTasks;
}

/** Runs shake animation on given element */
function shakeAnimation(element) {
    element.classList.remove('shake'); // Remove shake effect

    void element.offsetWidth; // Layout reflow to reset animation

    element.classList.add('shake'); // Add shake effect to element input
}

let hideTimeout; // Stores the timeout for error message
/** Displays a given error message above the text field */
function inputErrorMessage(errorMsg, message) {
    errorMsg.textContent = message; // Write message to errorMsg

    errorMsg.style.visibility = "visible"; // Display the error message

    clearTimeout(hideTimeout); // Reset 2 second timer

    // Remove error message after 2 seconds
    hideTimeout= setTimeout(() => {
        errorMsg.style.visibility = "hidden";
    }, 2000);
}