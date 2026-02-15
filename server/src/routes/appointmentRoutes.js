import express from 'express';
import {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment
} from '../controllers/appointmentController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.route('/')
    .get(getAppointments)
    .post(createAppointment);

router.route('/:id')
    .get(getAppointment)
    .patch(updateAppointment)
    .delete(deleteAppointment);

export default router;
