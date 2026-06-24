import { Router } from 'express';
import { createAssignmentDelivery, createEnrollment, getAssignmentDelivery } from './student.controller.js';

const router = Router();

router.post('/enrollment/create', createEnrollment);

router.post('/delivery/createDelivery/:assignmentId', createAssignmentDelivery);
router.get('/delivery/getDelivery/:assignmentId/:userId', getAssignmentDelivery);

export default router;