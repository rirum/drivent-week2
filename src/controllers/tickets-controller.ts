/* eslint-disable prettier/prettier */
import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/tickets-service';

async function getAllTicketsTypes(req: AuthenticatedRequest, res: Response) {
  //retorna todos os ticketstype (status 200)
  try {
    const allTicketsTypes = await ticketService.getAllTicketsTypes();
    return res.status(httpStatus.OK).send(allTicketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

async function getAllUserTickets(req: AuthenticatedRequest, res: Response) {
  //retorna todos os ingressos tickets do usuário(200)
 try{
    const userId = req.userId;
    console.log(userId);
    const allUserTickets = await ticketService.getAllUserTickets(userId);
    if (allUserTickets) return res.status(httpStatus.OK).json(allUserTickets);
    else throw new Error();
 }catch(error){
  return res.status(httpStatus.NOT_FOUND).send(error)
 }
  //sem inscrição ou sem cadastro 404
  //usuario sem ingresso 404
}

async function postTicket() {
  //cria um novo ingresso pro usuário (201)
  //usuário sem cadastro (404)
  //quando tickettypeid nao é enviada (400)
}

const ticketsController = {
  getAllTicketsTypes,
  getAllUserTickets,
  postTicket,
};

export default ticketsController;
