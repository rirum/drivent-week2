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
  enrollmentId: number,
  ticketTypeId: number,
  status: TicketStatus,
  id?: number,
): Promise<Ticket> {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

async function createTicket(ticketTypeId: number, enrollmentId: number, status: TicketStatus): Promise<Ticket> {
  return await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status,
    },
    select: {
      createdAt: true,
      updatedAt: true,
      id: true,
      status: true, //RESERVED | PAID
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

const ticketRepository = {
  getAllTicketsTypes,
  getAllUserTickets,
  postTicket,
  getTicketById,
  createTicket,
  // getTicketByEnrollmentId,
};

export default ticketRepository;
