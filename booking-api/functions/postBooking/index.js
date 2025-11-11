const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");
const { sendResponse } = require("../../responses");
const calculateSum = require("./utils/calculateSum");
const createBookingConfirm = require("./utils/createBookingConfirm");
const calculateDuration = require("./utils/calculateDuration");
const { getBookedRooms, countRooms } = require("./utils/bookingUtils");
const checkRoomSize = require("./utils/checkRoomSize");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

exports.createBooking = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { guests, rooms, checkInDate, checkOutDate, name, email } = body;

    const bookedRooms = await getBookedRooms(checkInDate, checkOutDate);
    const requestedRooms = countRooms(rooms);

    if (bookedRooms + requestedRooms > 20) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Not enough rooms available",
          availableRooms: 20 - bookedRooms,
          requestedRooms: requestedRooms,
        }),
      };
    }

    if (!checkRoomSize(guests, rooms)) {
      return sendResponse(500, {error: "Too many guests, choose different room type(s)"});
      };

    const bookingId = randomUUID();
    const booking = {
      bookingId,
      guests,
      rooms,
      checkInDate,
      checkOutDate,
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    const sum = calculateSum(
      booking.rooms,
      calculateDuration(checkInDate, checkOutDate)
    );
    const bookingConfirm = createBookingConfirm(booking, sum);

    await docClient.send(
      new PutCommand({
        TableName: "bookings",
        Item: booking,
      })
    );

    return sendResponse(200, { content: bookingConfirm });
  } catch (error) {
    console.error("Error:", error);
    return sendResponse(500, {
      success: false,
      message: "could not create booking",
    });
  }
};
