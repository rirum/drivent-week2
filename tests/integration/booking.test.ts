import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from 'jsonwebtoken';
import supertest from "supertest";

import { cleanDb, generateValidToken } from "../helpers";

import app, {init} from '@/app';
import { createBooking, createCustomizedTicketType, createEnrollmentWithAddress, createHotel, createPayment, createRoom, createRoomWithHotelId, createTicket, createTicketWithHotel, createUser } from '../factories';
import { TicketStatus } from "@prisma/client";


beforeAll(async () => {
    await init();
});

beforeEach(async() => {
    await cleanDb();
});

const server = supertest(app);



describe('GET /booking', ()=> {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
        expect (response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe('when token if valid', () => {
        it('should respond with status 404 when there is no booking for given user', async () => {
            const token = await generateValidToken();
      
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toBe(httpStatus.NOT_FOUND);
          });

        it('should respond with status 200 and booking data - bookingId and room info', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);
            const booking = await createBooking(user.id, room.id);
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    capacity: expect.any(Number),
                    hotelId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            });
        });
      });
    
})



describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');
        expect (response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe('when token is valid', () =>{
        it('should respond with status 403 when user doesnt have an enrollment or ticket', async() => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const body = {roomId: 1};

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if the user ticket is not paid', async() => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            
            const body = {roomId: 1};
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if ticket type is remote', async() => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createCustomizedTicketType(true, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const body = {roomId: 1};
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if ticket doenst includes hotel', async()=> {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createCustomizedTicketType(false, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const body = {roomId: 1};
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if theres no vacancies on the room', async() => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createCustomizedTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const hotel = await createHotel();
            const room = await createRoom(hotel.id);
            await createBooking(user.id, room.id);

            const body = {roomId: room.id};
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        })

        it('should respond with status 404 if the room doenst exists', async()=> {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createCustomizedTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const body = {roomId: 1};
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and roomId', async() => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const body = {roomId: 1};
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
                roomId: room.id,
            });
            expect(response.status).toEqual(httpStatus.OK);
        });

        it('should respond with status 200 and bookingId', async()=> {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createCustomizedTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();

            const room = await createRoom(hotel.id);
            const body = { roomId: room.id};
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                bookingId: expect.any(Number),
            });
            
        });
        
      })
})




describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking/1');
        expect (response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
})