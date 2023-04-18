import { Payment, TicketStatus, Ticket } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentBody } from '@/protocols';

async function getPayments(ticketId: number) {
  const payment = prisma.payment.findFirst({
    where: { ticketId },
  });
  return payment;
}

async function postPayment(paymentData: PaymentBody, price: number): Promise<Payment> {
  const payment = await prisma.payment.create({
    data: {
      ticketId: paymentData.ticketId,
      cardIssuer: paymentData.cardData.issuer,
      cardLastDigits: paymentData.cardData.number.toString().substring(11, 16),
      value: price,
    },
  });
  return payment;
}

async function updateTicket(status: TicketStatus, ticketId: number): Promise<Ticket> {
  return await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status,
    },
  });
}

export default {
  getPayments,
  postPayment,
  updateTicket,
};
