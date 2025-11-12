const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { sendResponse } = require("../../responses"); 
const calculateSum = require("../postBooking/utils/calculateSum"); 
const calculateDuration = require("../postBooking/utils/calculateDuration"); 
const validateBooking = require("../postBooking/utils/validateBooking"); 
const checkRoomSize = require("../postBooking/utils/checkRoomSize");

const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

exports.updateBooking = async (event) => {
    try {
        const bookingId = event.pathParameters.id;
        const body = JSON.parse(event.body);

        // 1. Validera inkommande data
        const validation = validateBooking(body);
        if (!validation.valid) {
            return sendResponse(400, { error: `Validation failed: ${validation.error}` });
        }

        // 2. Validera gästantal (User Story 1)
        if (!checkRoomSize(body.guests, body.rooms)) {
            return sendResponse(400, {
                error: "Too many guests, the selected rooms cannot accommodate this number of guests.",
            });
        }

        // 3. Beräkna nytt pris
        const duration = calculateDuration(body.checkInDate, body.checkOutDate);
        const newSum = calculateSum(body.rooms, duration);
        
        // Lägg till summan till bokningsobjektet
        body.sum = newSum;

        // 4. Bygg upp UpdateExpression för DynamoDB
        let updateExpression = 'set ';
        const expressionAttributeValues = {};
        const allowedUpdates = [
            'guests', 
            'rooms', 
            'checkInDate', 
            'checkOutDate', 
            'name', 
            'email',
            'sum'
        ];

        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updateExpression += `${key} = :${key}, `;
                expressionAttributeValues[`:${key}`] = body[key];
            }
        }

        // Ta bort det sista ", "
        updateExpression = updateExpression.slice(0, -2); 

        if (Object.keys(expressionAttributeValues).length === 0) {
             return sendResponse(400, { error: 'No valid fields provided for update.' });
        }

        // 5. Utför uppdatering i DynamoDB
        await docClient.send(
            new UpdateCommand({
                TableName: "bookings",
                Key: { bookingId: bookingId },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: expressionAttributeValues,
            })
        );

        return sendResponse(200, { 
            message: `Booking ${bookingId} updated successfully. New total price: ${newSum}`,
            updatedBooking: body
        });
    } catch (error) {
        console.error("Error:", error);
        return sendResponse(500, {
            success: false,
            message: "Could not update booking",
        });
    }
};