/* eslint-disable prettier/prettier */
import Joi from 'joi';
import { TicketPost } from '@/protocols';

export const ticketSchema = Joi.object<TicketPost>({
  ticketTypeId: Joi.number().required(),
});
