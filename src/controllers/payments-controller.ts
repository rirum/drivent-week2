import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { PaymentBody, TicketId } from '@/protocols';
import paymentService from '@/services/payments-service';

export async function getPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { ticketId } = req.query as TicketId;
  try {
    if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);
    const payment = await paymentService.getPayments(userId, parseInt(ticketId));
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const body = req.body as PaymentBody;
    if (!body.ticketId || !body.cardData) return res.sendStatus(httpStatus.BAD_REQUEST);
    const paid = await paymentService.postPayment(body, userId);
    return res.status(httpStatus.OK).send(paid);
  } catch (error) {
    next(error);
  }
}
