import { Router } from 'express';
import { createClass, createAssignment, getAllDeliveries } from './teacher.controller.js';

const router = Router();

router.post('/class/create', createClass);
router.post('/assignment/createAssignment/:classId', createAssignment);

router.get('/deliveries/getAllDeliveries/:assignmentId', getAllDeliveries);

export default router;