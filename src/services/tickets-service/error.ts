/* eslint-disable prettier/prettier */
import { ApplicationError } from '@/protocols';

export function enrollmentNotFound(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'User doenst have an enrollment yet',
  };
}
