import { Router } from "express";

const router = Router();

// Example Route
router.get("/welcome", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the AWS Student Community Day API",
  });
});

import authRouter from './auth.routes.js';
import attendeeRouter from './attendee.routes.js';
import speakerRouter from './speaker.routes.js';
import agendaRouter from './agenda.routes.js';
import eventRouter from './event.routes.js';
import sponsorRouter from './sponsor.routes.js';
import uploadRouter from './upload.routes.js';
import emailRouter from './email.routes.js';
import certificatesRouter from './certificates.routes.js';
import organizerRouter from './organizer.routes.js';
import volunteerRouter from './volunteer.routes.js';
import paymentRouter from './payment.routes.js';

router.use('/auth', authRouter);
router.use('/attendees', attendeeRouter);
router.use('/speakers', speakerRouter);
router.use('/agenda', agendaRouter);
router.use('/event', eventRouter);
router.use('/sponsors', sponsorRouter);
router.use('/uploads', uploadRouter);
router.use('/emails', emailRouter);
router.use('/certificates', certificatesRouter);
router.use('/organizers', organizerRouter);
router.use('/volunteers', volunteerRouter);
router.use('/payments', paymentRouter);

export default router;
