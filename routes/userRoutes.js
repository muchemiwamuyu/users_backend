import express from 'express';
import { createUser, deleteUser, updateUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;