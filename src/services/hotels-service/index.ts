
import { notFoundError } from "@/errors";
import { paymentRequiredError} from "@/errors/payment-required-error";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";


async function getAllHotels(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketRepository.getAllUserTickets(enrollment.id);
   
    if (!ticket) throw notFoundError();
   
    const { TicketType: { isRemote, includesHotel }} = ticket;
      
  
      if (ticket.status !== 'PAID' || isRemote || !includesHotel) throw paymentRequiredError()
      
      const hotels = await hotelRepository.getAllHotels();
      
      if (hotels.length === 0) throw notFoundError();
     
      return hotels;
    

}



async function getHotelById(userId: number, hotelId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
    const ticket = await ticketRepository.getAllUserTickets(enrollment.id);
    if(!ticket) throw notFoundError();
    
    const {
        TicketType: { isRemote, includesHotel },
      } = ticket;
      if (ticket.status !== 'PAID' || isRemote || !includesHotel) throw paymentRequiredError();

    const hotel = await hotelRepository.getHotelById(hotelId)
    if (!hotel) throw notFoundError();
    return hotel;
    
}

const hotelService = {
    getAllHotels,
    getHotelById

}

export default hotelService;