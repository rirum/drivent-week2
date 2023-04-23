
import { notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";


async function validateInformation(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw notFoundError();

    const ticket = await ticketRepository.getAllUserTickets(enrollment.id);
    if (!ticket) throw notFoundError();
    console.log(ticket);
    if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw paymentRequiredError();


    return;

}

async function getAllHotels(userId: number){
    await validateInformation(userId);
    const hotels = await hotelRepository.getAllHotels();

    if (hotels.length === 0) throw notFoundError();
    return hotels
}

async function getHotelById(hotelId: number, userId: number){
    await validateInformation(userId);
    const hotel = await hotelRepository.getHotelById(hotelId)
    if (!hotel) throw notFoundError();
    return hotel;
    
}

const hotelService = {
    getAllHotels,
    getHotelById

}

export default hotelService;