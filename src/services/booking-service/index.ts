import { prisma } from "@/config";
import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";

//get all bookings getBooking - sucesso 200 
//usuario nao tem reserva 404 - necessario checar se há reserva ok
//necessario checar se há quarto disponivel ok

async function availableRoom(roomId:number){
    const room = await bookingRepository.findRoomById(roomId);
    if (!room) throw notFoundError();
    if (room.Booking.length >= room.capacity) throw forbiddenError('There isnt room!')

}

async function getBooking(userId: number){
    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw notFoundError();
    return booking;
}

async function postBooking(userId: number, roomId: number) {
    const info = await enrollmentRepository.findWithTicketByUserId(userId);
    if (!info || !info.Ticket[0]) throw forbiddenError('there isnt enrollment or ticket');

    const ticket = info.Ticket[0];
    if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw forbiddenError('there isnt booking set for this user')
    
    await availableRoom(roomId);

    const booking = await bookingRepository.postBooking(userId, roomId);
    return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number){
    const booking = await bookingRepository.getBooking(userId);
    if (!booking) throw forbiddenError('there isnt booking');
    if (booking.id !== bookingId) throw forbiddenError('user isnt allowed to update this booking');

    await availableRoom(roomId);
    const updateBooking = await bookingRepository.updateBooking(bookingId, roomId);
    return updateBooking;
}

const bookingService = {
    availableRoom,
    getBooking,
    postBooking,
    updateBooking,    
}

export default bookingService;