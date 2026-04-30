import { Router } from 'express';
import { createAcc, login } from './auth.controller.js';

const router = Router();

router.post('/auth/login', login);

router.post('/auth/create-acc', createAcc); 

export default router;