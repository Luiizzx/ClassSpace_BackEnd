import { Router } from 'express';
import { auth, createAcc, login } from './auth.controller.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/create-acc', createAcc); 
router.get('/auth', auth)

export default router;