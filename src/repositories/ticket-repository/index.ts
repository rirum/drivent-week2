import { TicketType, Ticket, TicketStatus, Enrollment } from '@prisma/client';
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

async function getTicketById(ticketId: number): Promise<Ticket & { Enrollment: Enrollment; TicketType: TicketType }> {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}

async function postTicket(
  ticketTypeId: number,
  enrollmentId: number,
  status: TicketStatus,
  id?: number,
): Promise<Ticket & { TicketType: TicketType }> {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status,
      id,
    },
    include: {
      TicketType: true,
    },
  });
}

async function setTicketStatus(ticketId: number, status: 'PAID' | 'RESERVED') {
  await prisma.ticket.update({ where: { id: ticketId }, data: { status } });
}

const ticketRepository = {
  getAllTicketsTypes,
  getAllUserTickets,
  postTicket,
  getTicketById,
  setTicketStatus,
};

export default ticketRepository;
