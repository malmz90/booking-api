function calculateSum(rooms, duration){
  
  const roomPrices = {
    single: 500,
    double: 1000,
    suite: 1500,
  }
  
let sum = 0;

for (const [roomType, quantity] of Object.entries(rooms)) {
  const roomPrice = roomPrices[roomType] || 0;
  sum += (roomPrice * quantity) * duration;
}

return sum;

}

module.exports = calculateSum;