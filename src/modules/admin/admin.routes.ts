import { Router } from 'express';
import { getClassStats } from './admin.controller.js';

const router = Router();

router.get('/stats/:classId', getClassStats);

export default router;