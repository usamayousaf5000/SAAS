import { query } from '../config/db.js';
import { getAIResponse } from '../services/aiService.js';

export const sendMessage = async (req, res, next) => {
    try {
        const { sessionId, content } = req.body;
        const userId = req.user.id;

        if (!sessionId || !content) {
            return res.status(400).json({ message: 'Session ID and content required' });
        }

        await query(
            'INSERT INTO chat_messages (session_id, sender_type, content) VALUES ($1, $2, $3)',
            [sessionId, 'user', content]
        );

        const history = await query(
            'SELECT sender_type, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 20',
            [sessionId]
        );

        const messages = history.rows.map(msg => ({
            role: msg.sender_type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        const aiResponse = await getAIResponse(messages);
        let metadata = null;

        const jsonMatch = aiResponse.content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[1]);
                if (data.action === 'book_appointment' && data.details) {
                    const { name, date, time, reason } = data.details;
                    const startTime = new Date(`${date}T${time}:00`);
                    const endTime = new Date(startTime.getTime() + 3600000);

                    const appointment = await query(
                        'INSERT INTO appointments (user_id, title, description, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                        [userId, `Appointment with ${name}`, reason, startTime, endTime, 'scheduled']
                    );

                    metadata = { ...data, appointmentId: appointment.rows[0].id };
                }
            } catch (err) {
                console.error('Booking error:', err);
            }
        }

        const result = await query(
            'INSERT INTO chat_messages (session_id, sender_type, content, metadata) VALUES ($1, $2, $3, $4) RETURNING *',
            [sessionId, 'ai', aiResponse.content, metadata ? JSON.stringify(metadata) : null]
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const createSession = async (req, res, next) => {
    try {
        const result = await query(
            'INSERT INTO chat_sessions (user_id, title) VALUES ($1, $2) RETURNING *',
            [req.user.id, 'New Chat']
        );
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const getSessions = async (req, res, next) => {
    try {
        const result = await query(
            'SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const session = await query(
            'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
            [sessionId, req.user.id]
        );

        if (!session.rows.length) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await query(
            'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC',
            [sessionId]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const deleteSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        await query('DELETE FROM chat_messages WHERE session_id = $1', [sessionId]);
        const result = await query(
            'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2 RETURNING *',
            [sessionId, req.user.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json({ message: 'Session deleted' });
    } catch (error) {
        next(error);
    }
};
