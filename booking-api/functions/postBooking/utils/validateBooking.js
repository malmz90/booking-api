function validateBooking(body) {
  const { guests, rooms, checkInDate, checkOutDate, guest, email } = body;

  // Kolla att alla fält finns
  if (!guests || !rooms || !checkInDate || !checkOutDate || !guest || !email) {
    return { valid: false, error: "Missing required fields" };
  }

  // Validera guests
  if (typeof guests !== "number" || guests < 1) {
    return { valid: false, error: "Guests must be a positive number" };
  }

  // Validera rooms
  if (typeof rooms !== "object" || Object.keys(rooms).length === 0) {
    return {
      valid: false,
      error: "Rooms must be an object with at least one room type",
    };
  }

  // Kolla att rumtyper är giltiga
  const validRoomTypes = ["single", "double", "suite"];
  for (const [roomType, count] of Object.entries(rooms)) {
    if (!validRoomTypes.includes(roomType)) {
      return {
        valid: false,
        error: `Invalid room type: ${roomType}. Use: single, double, or suite`,
      };
    }
    if (typeof count !== "number" || count < 1) {
      return {
        valid: false,
        error: `Room count for ${roomType} must be a positive number`,
      };
    }
  }

  // Validera datum
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { valid: false, error: "Invalid date format. Use YYYY-MM-DD" };
  }

  if (checkOut <= checkIn) {
    return {
      valid: false,
      error: "Check-out date must be after check-in date",
    };
  }

  // Validera namn
  if (typeof guest !== "string" || guest.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }

  return { valid: true };
}

module.exports = validateBooking;
