// In taskRoutes.ts
import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask } from '../controllers/taskController';
import { promiseDb } from '../server';  // Import the promiseDb from server

const router = express.Router();

// Create Task
router.post('/', (req, res) => createTask(req, res, promiseDb));

// Get All Tasks
router.get('/', (req, res) => getAllTasks(req, res, promiseDb));

// Update Task
router.put('/:id', (req, res) => updateTask(req, res, promiseDb));

// Delete Task
router.delete('/:id', (req, res) => deleteTask(req, res, promiseDb));

export default router;
