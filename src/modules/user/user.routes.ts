import { Router } from 'express';
import {
  getAllClasses, 
  getParticipants, 
  getAllPosts, 
  getPost, 
  createPost,
  replyPost,
  getAssignments,
  getAssignment,
  getFile
 } from './user.controller.js';

const router = Router();

router.get('/class/getAll/:userId', getAllClasses); 

router.get('/class/getParticipants/:classId', getParticipants);

router.get('/post/getPosts/:classId', getAllPosts);
router.get('/post/getPost/:classId/:postId', getPost);

router.post('/post/createPost/:classId', createPost);
router.post('/post/replyPost/:classId/:postId', replyPost);

router.get('/assignment/getAssignments/:classId', getAssignments);
router.get('/assignment/getAssignment/:classId/:assignmentId', getAssignment);

router.get('/file/getFile/:fileId', getFile);
export default router;