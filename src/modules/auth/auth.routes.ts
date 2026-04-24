import { Router } from 'express';
import { createAcc, login } from './auth.controller.js';

const router = Router();

router.post('/login', login);

router.post('create-acc', createAcc);
export default router;