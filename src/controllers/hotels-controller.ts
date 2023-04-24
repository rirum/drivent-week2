import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";


export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const {userId} = req;
    try{
       
        const hotels = await hotelService.getAllHotels(userId);
   
        return res.status(httpStatus.OK).send(hotels);
    } catch(error){
        if (error.name === 'PaymentRequiredError') {
            return res.status(httpStatus.PAYMENT_REQUIRED).send(error);
          }
          return res.status(httpStatus.NOT_FOUND).send(error);
        }
    
}


export async function getHotelById(req: AuthenticatedRequest, res: Response, next: NextFunction ) {
    const { userId } = req;
    const { id } = req.params as { id: string }; 
    try{
        const hotel = await hotelService.getHotelById(userId, parseInt(id));
        return res.status(httpStatus.OK).send(hotel);

    }catch(error){
        next(error)
    }
}