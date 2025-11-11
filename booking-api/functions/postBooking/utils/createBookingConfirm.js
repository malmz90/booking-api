function createBookingConfirm(booking, sum) {
  return {
    bookingId: booking.bookingId,
    name: booking.name,
    guests: booking.guests,
    rooms: booking.rooms,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    sum
  };
}

module.exports = createBookingConfirm;