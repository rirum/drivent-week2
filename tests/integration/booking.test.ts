import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from 'jsonwebtoken';
import supertest from "supertest";

import { cleanDb, generateValidToken } from "../helpers";

import app, {init} from '@/app';
import { createBooking, createHotel, createRoom, createUser } from '../factories';


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

})




describe('PUT /booking/:bookingId', () => {

})