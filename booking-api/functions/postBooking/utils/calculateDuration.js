function calculateDuration(checkInDate, checkOutDate) {

const start = new Date(checkInDate);
const end = new Date(checkOutDate);

const durationMs = end.getTime() - start.getTime();
const durationDays = durationMs / (1000 * 3600 * 24);

console.log(durationDays);
return durationDays;

}

module.exports = calculateDuration;