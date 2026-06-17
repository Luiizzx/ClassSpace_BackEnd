import { Router } from 'express';
import { createEnrollment } from './student.controller.js';

const router = Router();

router.post('/enrollment/create', createEnrollment);

export default router;