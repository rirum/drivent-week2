import { TicketType, Ticket, TicketStatus } from '@prisma/client';
import { enrollmentNotFound } from './error';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getAllTicketsTypes(): Promise<TicketType[]> {
  const result = await ticketRepository.getAllTicketsTypes();
  return result;
}

async function getAllUserTickets(id: number): Promise<Ticket & { TicketType: TicketType }> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(id);
  if (!enrollment) throw enrollmentNotFound();
  const ticket = await ticketRepository.getAllUserTickets(enrollment.id);
  if (!ticket) throw new Error();
  return ticket;
}

async function postTicket(ticketTypeId: number, id: number): Promise<Ticket & { TicketType: TicketType }> {
  const status: TicketStatus = 'RESERVED';
  const enrollment = await enrollmentRepository.findWithAddressByUserId(id);
  if (!enrollment) throw enrollmentNotFound();

  const result = await ticketRepository.postTicket(ticketTypeId, enrollment.id, status);
  return result;
}
const ticketService = {
  getAllTicketsTypes,
  getAllUserTickets,
  postTicket,
};

export default ticketService;
