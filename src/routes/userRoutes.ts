
import express from 'express';
import { createUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController';
import { promiseDb } from '../server';  

const router = express.Router();

router.post('/', (req, res) => createUser(req, res, promiseDb));
router.get('/', (req, res) => getAllUsers(req, res, promiseDb));
router.put('/:id', (req, res) => updateUser(req, res, promiseDb));
router.delete('/:id', (req, res) => deleteUser(req, res, promiseDb));

export default router;
