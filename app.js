/**
 * app.js ties the interaction between the UI and functions.
 */

import * as functions from "./taskFunctions.js";
import { loadStorage } from './storage.js';

// Variables
const addBtn = document.querySelector('#add-task');
const clearBtn = document.querySelector('#clear-tasks')
const taskInput = document.querySelector('#enter-task');
const taskList = document.querySelector('#task-list');

loadStorage(taskList); // Load tasks from local storage

addBtn.addEventListener('click', () => {functions.addTask(taskList, taskInput)}); // Add task on click of "Add"

// Add task on keypress of "Enter"
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        functions.addTask(taskList, taskInput)}
    });

clearBtn.addEventListener('click', () => {functions.clearTasks(taskList)}); // Clear all tasks on click of "Clear"