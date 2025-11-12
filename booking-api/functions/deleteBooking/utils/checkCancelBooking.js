function checkCancelDuration(checkInDate) {

let cancel = true;
const today = new Date()
const checkIn = new Date(checkInDate);
const differenceMs = checkIn - today;
const msPerDay =  1000 * 60 * 60 * 24;
const differenceDays = Math.round(differenceMs / msPerDay);

if (differenceDays < 2) {
  cancel = false;
}

return cancel;

}

module.exports = checkCancelDuration;