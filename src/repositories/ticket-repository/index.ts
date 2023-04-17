import { TicketType, Ticket } from '@prisma/client';
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

const ticketRepository = {
  getAllTicketsTypes,
  getAllUserTickets,
};

export default ticketRepository;
