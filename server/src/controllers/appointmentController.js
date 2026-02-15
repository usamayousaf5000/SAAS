import { query } from '../config/db.js';

export const createAppointment = async (req, res, next) => {
    try {
        const { title, description, startTime, endTime } = req.body;

        if (!title || !startTime) {
            return res.status(400).json({ message: 'Title and start time required' });
        }

        const result = await query(
            'INSERT INTO appointments (user_id, title, description, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.id, title, description, startTime, endTime, 'scheduled']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const getAppointments = async (req, res, next) => {
    try {
        const result = await query(
            'SELECT * FROM appointments WHERE user_id = $1 ORDER BY start_time DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const getAppointment = async (req, res, next) => {
    try {
        const result = await query(
            'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const updateAppointment = async (req, res, next) => {
    try {
        const { title, description, startTime, start_time, endTime, end_time, status } = req.body;

        const updates = {
            title,
            description,
            start_time: startTime || start_time,
            end_time: endTime || end_time,
            status
        };

        const fields = [];
        const values = [];
        let idx = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                fields.push(`${key} = $${idx++}`);
                values.push(value);
            }
        }

        if (!fields.length) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.params.id, req.user.id);
        const result = await query(
            `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
            values
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteAppointment = async (req, res, next) => {
    try {
        const result = await query(
            'DELETE FROM appointments WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.params.id, req.user.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment deleted' });
    } catch (error) {
        next(error);
    }
};
