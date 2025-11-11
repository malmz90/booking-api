const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

// Hämta alla bokningar från databasen
async function getAllBookings() {
  const result = await docClient.send(
    new ScanCommand({
      TableName: "bookings",
    })
  );
  return result.Items || [];
}

// Kolla om datumen överlappar
function datesOverlap(checkIn1, checkOut1, checkIn2, checkOut2) {
  return checkIn1 < checkOut2 && checkOut1 > checkIn2;
}

// Räkna totalt antal rum i en bokning
function countRooms(rooms) {
  let total = 0;
  for (const count of Object.values(rooms)) {
    total += count;
  }
  return total;
}

// Räkna hur många rum som är bokade under samma period
async function getBookedRooms(checkInDate, checkOutDate) {
  const bookings = await getAllBookings();
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  let bookedRooms = 0;
  for (const booking of bookings) {
    const bookingCheckIn = new Date(booking.checkInDate);
    const bookingCheckOut = new Date(booking.checkOutDate);

    if (datesOverlap(checkIn, checkOut, bookingCheckIn, bookingCheckOut)) {
      bookedRooms += countRooms(booking.rooms);
    }
  }

  return bookedRooms;
}

module.exports = {
  getAllBookings,
  datesOverlap,
  countRooms,
  getBookedRooms,
};
