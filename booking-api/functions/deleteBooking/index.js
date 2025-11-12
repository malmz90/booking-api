const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const checkCancelDuration = require("./utils/checkCancelBooking");
const { sendResponse } = require("../../responses");
const getBookingById = require("./utils/getBookingById");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);
exports.deleteBooking = async (event) => {

const { id } = event.pathParameters;
const bookingInfo = await getBookingById(id);
const checkInDate = bookingInfo.checkInDate;
const cancel = checkCancelDuration(checkInDate);


if (cancel) {

  try {
    // const { id } = event.pathParameters;
    
    await docClient.send(
      new DeleteCommand({
        TableName: "bookings",
        Key: { bookingId: id },
      })
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Bookning ${id} deleted.` }),
    };
  } catch (err) {
    console.error("Fel:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Issues with deletetion" }),
    };
  }
} else {
  return (
    sendResponse(500, {error: 'Too late for cancelation'})
  )
}
  };