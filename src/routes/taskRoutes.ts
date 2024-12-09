
import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask } from '../controllers/taskController';
import { promiseDb } from '../server';  
const router = express.Router();

router.post('/', (req, res) => createTask(req, res, promiseDb));
router.get('/', (req, res) => getAllTasks(req, res, promiseDb));
router.put('/:id', (req, res) => updateTask(req, res, promiseDb));
router.delete('/:id', (req, res) => deleteTask(req, res, promiseDb));

export default router;
