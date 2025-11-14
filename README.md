POST - https://jmswefgzei.execute-api.eu-north-1.amazonaws.com/bookings
DELETE - https://jmswefgzei.execute-api.eu-north-1.amazonaws.com/bookings/{id}
GET - https://jmswefgzei.execute-api.eu-north-1.amazonaws.com/bookings
PUT - https://jmswefgzei.execute-api.eu-north-1.amazonaws.com/bookings/{id}

Booking example JSON
{
    "guests": 6,
    "rooms": {
        "double": 2,
        "single": 2
    },
    "checkInDate": "2025-12-20",
    "checkOutDate": "2025-12-23",
    "guest": "Alex Andersson",
    "email": "alex@example.com"
}
