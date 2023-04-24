import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

async function getAllHotels(): Promise<Hotel[]>{
    return prisma.hotel.findMany();
}

async function getHotelById(id: number):Promise<Hotel & {Rooms: Room[];}> {
    return prisma.hotel.findFirst({
        where: {
            id },
        include: {
            Rooms: true
        }
        
    })
    
}

const hotelRepository = {
    getAllHotels,
    getHotelById,
}

export default hotelRepository