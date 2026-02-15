import express from 'express';
import {
    sendMessage,
    createSession,
    getSessions,
    getMessages,
    deleteSession
} from '../controllers/chatController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

// Session management
router.route('/sessions')
    .get(getSessions)
    .post(createSession);

router.route('/sessions/:sessionId')
    .delete(deleteSession);

router.get('/sessions/:sessionId/messages', getMessages);

// Message handling
router.post('/messages', sendMessage);

export default router;
