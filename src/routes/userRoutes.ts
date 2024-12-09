// In userRoutes.ts
import express from 'express';
import { createUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController';
import { promiseDb } from '../server';  // Import the promiseDb from server

const router = express.Router();

// Create User
router.post('/', (req, res) => createUser(req, res, promiseDb));

// Get All Users
router.get('/', (req, res) => getAllUsers(req, res, promiseDb));

// Update User
router.put('/:id', (req, res) => updateUser(req, res, promiseDb));

// Delete User
router.delete('/:id', (req, res) => deleteUser(req, res, promiseDb));

export default router;
