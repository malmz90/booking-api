const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

const docClient = new DynamoDBClient({ region: 'eu-north-1' });

const getBookingById = async (id) => {
  
  try {
    const data = await docClient.send(new GetCommand({
      TableName: 'bookings',
      Key: { bookingId: id },
    }));
  
    return data.Item;

  } catch (error) {
    console.error(error);
  }
};

module.exports = getBookingById;