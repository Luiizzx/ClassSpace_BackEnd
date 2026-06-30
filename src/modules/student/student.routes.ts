import { Router } from 'express';
import { createAssignmentDelivery, createEnrollment, getAssignmentDelivery, updateAssignmentDelivery } from './student.controller.js';

const router = Router();

router.post('/enrollment/create', createEnrollment);

router.get('/delivery/getDelivery/:assignmentId/:userId', getAssignmentDelivery);
router.post('/delivery/createDelivery/:assignmentId', createAssignmentDelivery);
router.put('/delivery/updateDelivery/:assignmentId', updateAssignmentDelivery);
export default router;