import { Router } from 'express';
import { createClass, createAssignment, getAllDeliveries, getDeliveryFiles, deleteAssignment, updateScore } from './teacher.controller.js';

const router = Router();

router.post('/class/create', createClass);

router.post('/assignment/createAssignment/:classId', createAssignment);
router.delete('/assignment/deleteAssignment/:assignmentId', deleteAssignment);

router.get('/deliveries/getAllDeliveries/:assignmentId', getAllDeliveries);
router.get('/delivery/getDelivery/:deliveryId', getDeliveryFiles)

router.put('/delivery/updateScore/:deliveryId', updateScore);

export default router;