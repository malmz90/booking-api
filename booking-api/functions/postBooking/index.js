const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

exports.createBooking = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { guests, rooms, checkInDate, checkOutDate, name, email } = body;

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

    await docClient.send(
      new PutCommand({
        TableName: "bookings",
        Item: booking,
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Booking created", booking }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create booking" }),
    };
  }
};
