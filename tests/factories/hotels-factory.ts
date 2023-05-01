import faker from "@faker-js/faker";
// import { Hotel, Room } from "@prisma/client";
import { prisma } from "@/config";

export async function createHotel(){
    return prisma.hotel.create({
        data: {
            name: faker.name.findName(),
            image: faker.image.imageUrl()
        },
    });
    
}

export async function createRoom(hotelId: number){
    return prisma.room.create({
        data:{
            name: faker.name.findName(),
            capacity: 1,
            hotelId,
        },
    });
    
}


export async function createRoomWithHotelId(hotelId: number) {
    return prisma.room.create({
      data: {
        name: '1020',
        capacity: 3,
        hotelId: hotelId,
      },
    });
  }