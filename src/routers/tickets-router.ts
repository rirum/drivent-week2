/* eslint-disable prettier/prettier */
import { Router } from 'express';
import ticketsController from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema } from '@/schemas/ticket-schemas';

const ticketsRouter = Router();

ticketsRouter
        .all('/*', authenticateToken)
        .get('/', ticketsController.getAllUserTickets)
        .post('/', validateBody(ticketSchema), ticketsController.postTicket)
        .get('/types', ticketsController.getAllTicketsTypes);

export { ticketsRouter };
