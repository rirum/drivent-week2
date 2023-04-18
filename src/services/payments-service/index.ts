import { Payment } from '@prisma/client';
//error 400, 404, 401
import paymentRepository from '@/repositories/payment-repository';
import { invalidDataError, notFoundError, requestError, unauthorizedError } from '@/errors';
import { PaymentBody } from '@/protocols';
import ticketRepository from '@/repositories/ticket-repository';

async function getPayments(userId: number, ticketId: number): Promise<Payment> {
  const ticket = await ticketRepository.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  if (userId !== ticket.Enrollment.userId) throw unauthorizedError();

  return await paymentRepository.getPayments(ticketId);
}

// export async function processPayment(userId: number, paymentData: PaymentBody){
//     const ticket = await ticketRepository.getTicketById(paymentData.ticketId);
//     if (!ticket) throw notFoundError();

//     if (ticket.Enrollment.userId !== userId) throw unauthorizedError();
//     const price = ticket.TicketType.price;
//     const payment = await paymentRepository.processPayment(payment, price);
//     await ticketRepository.setTicketStatus(ticket.id, 'PAID');
//     return payment;
// }

async function postPayment(paymentData: PaymentBody, userId: number): Promise<Payment> {
  const paymentStatus = 'PAID';

  const ticket = await ticketRepository.getTicketById(paymentData.ticketId);

  if (!ticket) throw notFoundError();

  if (userId !== ticket.Enrollment.userId) throw unauthorizedError();

  const payment = await paymentRepository.postPayment(paymentData, ticket.TicketType.price);

  await ticketRepository.postTicket(ticket.ticketTypeId, ticket.enrollmentId, paymentStatus, ticket.id);

  return payment;
}

const paymentService = {
  getPayments,
  postPayment,
};

export default paymentService;
