import { TicketType, Ticket, TicketStatus } from '@prisma/client';
import { enrollmentNotFound } from './error';
import { prisma } from '@/config';
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

async function postTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const status: TicketStatus = 'RESERVED';

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw enrollmentNotFound();

  const result = await ticketRepository.createTicket(ticketTypeId, enrollment.id, status);

  if (!result) throw new Error();

  return result;
}

const ticketService = {
  getAllTicketsTypes,
  getAllUserTickets,
  postTicket,
};

export default ticketService;
