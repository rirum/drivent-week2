import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";


export async function getBooking(req: AuthenticatedRequest, res: Response) {
    try{
        const booking = await bookingService.getBooking(req.userId);
        return res.status(httpStatus.OK).send(booking);
    }catch(error){
        return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response){
    const roomId: number = req.body.roomId;
    try{
        const createBooking = await bookingService.postBooking(req.userId, roomId);
        return res.status(httpStatus.OK).send({bookingId: createBooking.id})
    }catch(error){
        if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
        if (error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message);

    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const bookingId = req.params.bookingId;
    const roomId: number = req.body.roomId;
    try{
        const updateBooking = await bookingService.updateBooking(req.userId, Number(bookingId), roomId);
        return res.status(httpStatus.OK).send({ bookingId: updateBooking.id });
    }catch(error){
        if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
        if (error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message);
    }
}