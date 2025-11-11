const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

exports.getBookings = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const { name, email, guests, checkInDate, checkOutDate, roomType } = queryParams;

    // Hämta ALLA bokningar först
    const data = await docClient.send(new ScanCommand({ TableName: "bookings" }));
    let bookings = data.Items || [];

    // Filtrera i JS (case-insensitive)
    if (name) {
      bookings = bookings.filter((b) =>
        b.name?.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (email) {
      bookings = bookings.filter((b) =>
        b.email?.toLowerCase().includes(email.toLowerCase())
      );
    }

    if (guests) {
      bookings = bookings.filter((b) => b.guests === Number(guests));
    }

    if (checkInDate) {
      bookings = bookings.filter((b) => b.checkInDate === checkInDate);
    }

    if (checkOutDate) {
      bookings = bookings.filter((b) => b.checkOutDate === checkOutDate);
    }

    if (roomType) {
      // Filtrerar om "rooms" innehåller t.ex. "double"
      const search = roomType.toLowerCase();
      bookings = bookings.filter((b) =>
        JSON.stringify(b.rooms).toLowerCase().includes(search)
      );
    }

    // Returnera resultatet
    return {
      statusCode: 200,
      body: JSON.stringify({
        count: bookings.length,
        bookings,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch bookings" }),
    };
  }
};