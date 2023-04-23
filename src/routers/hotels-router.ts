import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelById, getHotels } from "@/controllers";



const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/', getHotels)
    .get('/:id', getHotelById);


export {hotelsRouter}


