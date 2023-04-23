import supertest from "supertest";
import httpStatus from "http-status";
import * as jwt from 'jsonwebtoken';
import faker from "@faker-js/faker";
import { Hotel, TicketStatus } from "@prisma/client";
import { cleanDb, generateValidToken } from "../helpers";
import { createEnrollmentWithAddress, createHotel, createTicketWithHotel, createTicketWithoutHotel, createTicket, createTicketType, createUser, createRoom } from "../factories";
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
    })
})