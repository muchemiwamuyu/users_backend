import express from 'express'
import { createAdmin, loginAdmin } from '../controllers/adminControllers.js';

const router = express.Router();

router.post('/root', createAdmin);
router.post('/login', loginAdmin)

export default router;