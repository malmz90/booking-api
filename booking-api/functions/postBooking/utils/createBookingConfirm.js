function createBookingConfirm(booking, sum) {
  return {
    bookingId: booking.bookingId,
    guest: booking.guest,
    guests: booking.guests,
    rooms: booking.rooms,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
    sum
  };
}

module.exports = createBookingConfirm;