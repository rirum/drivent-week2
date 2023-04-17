import { TicketType, Ticket } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  const result = await ticketRepository.getAllTicketsTypes();
  return result;
}

const ticketService = {
  getAllTicketsTypes,
};

export default ticketService;
