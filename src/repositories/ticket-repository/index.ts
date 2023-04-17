import { TicketType, Ticket, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function getAllTicketsTypes() {
  return prisma.ticketType.findMany();
}

const ticketRepository = {
  getAllTicketsTypes,
};

export default ticketRepository;
