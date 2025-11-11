const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

exports.getBookings = async (event) => {
  try {
    const name = event.queryStringParameters?.name; 
    const params = { TableName: "bookings" };

    if (name) {
      params.FilterExpression = "contains(#name, :name)";
      params.ExpressionAttributeNames = { "#name": "name" };
      params.ExpressionAttributeValues = { ":name": name };
    }

    const data = await docClient.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: data.Items }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch bookings" }),
    };
  }
};