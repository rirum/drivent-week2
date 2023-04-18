import { TicketType, Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function getAllTicketsTypes() {
  return prisma.ticketType.findMany();
}

async function getAllUserTickets(enrollmentId: number): Promise<Ticket & { TicketType: TicketType }> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

async function postTicket(
  ticketTypeId: number,
  enrollmentId: number,
  status: TicketStatus,
): Promise<Ticket & { TicketType: TicketType }> {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  getAllTicketsTypes,
  getAllUserTickets,
  postTicket,
};

export default ticketRepository;
