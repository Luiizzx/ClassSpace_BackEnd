import { Router } from 'express';
import { createClass } from './teacher.controller.js';

const router = Router();

router.post('/class/create', createClass);

export default router;