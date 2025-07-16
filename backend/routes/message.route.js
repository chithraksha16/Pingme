import express from 'express';
import {authenticate} from '../middleware/auth.middleware.js';
import {getUsersForSideBar,getMessages,sendMessages} from '../controllers/message.controller.js';
const router= express.Router();



router.get('/users',authenticate,getUsersForSideBar);

router.get('/:id',authenticate,getMessages);

router.post('/send/:id',authenticate,sendMessages)

export default router