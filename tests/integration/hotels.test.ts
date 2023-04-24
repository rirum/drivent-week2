import supertest from "supertest";
import httpStatus from "http-status";
import * as jwt from 'jsonwebtoken';
import faker from "@faker-js/faker";
import { Hotel, TicketStatus } from "@prisma/client";
import { cleanDb, generateValidToken } from "../helpers";
import { createEnrollmentWithAddress, createHotel, createTicketWithHotel,createRemoteTicketType, createTicketWithoutHotel, createTicket, createTicketType, createUser, createRoom } from "../factories";
import app, {init} from '@/app';

beforeAll(async () => {
    await init();
});

afterEach(async () => {
    await cleanDb()
})

const server = supertest(app);

describe("get /hotels", () => {
    describe ("when token is valid", () => {
        it("should respond with status 404(not found) if enrollment doesnt exists", async () => {
            const token = await generateValidToken();
            const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404)
        })

        it("should respond with status 404(not found) if there's no hotels", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithHotel();
            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

            const result = await server.get("/hotels").set('Authorization', `Bearer ${token}`);
            expect(result.status).toBe(404)

        })

        it("should respond with status 402(payment required) if the ticket is not paid", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

            const result = await server.get("/hotels").set('Authorization', `Bearer ${token}`);

            expect(result.status).toBe(402)
        })

        it("should respond with 402(payment required) if ticket status is paid but ticket is remote", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createRemoteTicketType();
            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(402)

        })

        it("should respond with 402(payment required) if tickets isnt remote but doenst includes hotel", async() => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketWithoutHotel();
            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(402)
        })
    })
})