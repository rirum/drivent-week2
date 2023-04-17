import { TicketType, Ticket } from '@prisma/client';
import { enrollmentNotFound } from './error';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  const result = await ticketRepository.getAllTicketsTypes();
  return result;
}

async function getAllUserTickets(id: number): Promise<Ticket> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(id);
  if (!enrollment) throw enrollmentNotFound();
  const ticket = await ticketRepository.getAllUserTickets(enrollment.id);
  if (!ticket) throw new Error();
  return ticket;
}

const ticketService = {
  getAllTicketsTypes,
  getAllUserTickets,
};

export default ticketService;
