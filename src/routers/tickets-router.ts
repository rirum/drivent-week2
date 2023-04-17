/* eslint-disable prettier/prettier */
import { Router } from 'express';
import ticketsController from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
        .all('/*', authenticateToken)
        .get('/', ticketsController.getAllUserTickets)
        .get('/types', ticketsController.getAllTicketsTypes)
        .post('/');

export { ticketsRouter };
