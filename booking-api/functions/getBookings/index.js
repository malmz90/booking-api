const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

exports.getBookings = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const { guest, email, guests, checkInDate, checkOutDate, roomType } =
      queryParams;

    let filterExpressions = [];
    let expressionValues = {};
    let expressionNames = {};

    if (guest) {
      filterExpressions.push("contains(#guest, :guest)");
      expressionValues[":guest"] = guest;
      expressionNames["#guest"] = "guest";
    }

    if (email) {
      filterExpressions.push("contains(#email, :email)");
      expressionValues[":email"] = email;
      expressionNames["#email"] = "email";
    }

    if (guests) {
      filterExpressions.push("guests = :guests");
      expressionValues[":guests"] = Number(guests);
    }

    if (checkInDate) {
      filterExpressions.push("checkInDate = :checkInDate");
      expressionValues[":checkInDate"] = checkInDate;
    }

    if (checkOutDate) {
      filterExpressions.push("checkOutDate = :checkOutDate");
      expressionValues[":checkOutDate"] = checkOutDate;
    }

    if (roomType) {
      filterExpressions.push("contains(#rooms, :roomType)");
      expressionValues[":roomType"] = roomType;
      expressionNames["#rooms"] = "rooms";
    }

    const params = {
      TableName: "bookings",
      ...(filterExpressions.length > 0 && {
        FilterExpression: filterExpressions.join(" AND "),
        ExpressionAttributeValues: expressionValues,
        ...(Object.keys(expressionNames).length > 0 && {
          ExpressionAttributeNames: expressionNames,
        }),
      }),
    };

    const data = await docClient.send(new ScanCommand(params));
    const bookings = data.Items || [];

    return {
      statusCode: 200,
      body: JSON.stringify({
        count: bookings.length,
        bookings,
      }),
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch bookings" }),
    };
  }
};
