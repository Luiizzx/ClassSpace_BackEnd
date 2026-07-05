import { Router } from 'express';
import { auth, createAcc, forgotPassword, login, logout, resetPassword } from './auth.controller.js';

const router = Router();

router.get('/auth', auth);
router.post('/auth/login', login);
router.post('/auth/create-acc', createAcc); 

router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

router.post('/auth/logout', logout);

export default router;