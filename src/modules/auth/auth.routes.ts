import { Router } from 'express';
import { auth, createAcc, login, logout } from './auth.controller.js';

const router = Router();

router.get("/auth", auth);
router.post('/auth/logout', logout);
router.post('/auth/login', login);
router.post('/auth/create-acc', createAcc); 

export default router;