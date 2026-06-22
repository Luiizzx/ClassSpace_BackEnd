import { Router } from 'express';
import { createClass, createAssignment } from './teacher.controller.js';

const router = Router();

router.post('/class/create', createClass);
router.post('/assignment/createAssignment/:classId', createAssignment);

export default router;