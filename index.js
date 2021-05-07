// index.js
const { nextISSTimesForMyLocation } = require('./iss');

// fetchCoordsByIp('142.59.109.140', (error, location)=>{
//   if (error) {
//     console.log('It didn\'t work! ', error);
//     return;
//   }

//   console.log('Co-ordinates: ', location);
// });
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });
// fetchISSFlyOverTimes({ latitude: '50.9533', longitude: '-114.3589'}, (error, flyTimes)=>{
//   if (error) {
//     console.log('It didn\'t work! ', error);
//     return;
//   }
//   console.log('it worked! ', flyTimes);
// });
const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`)
  }
};

nextISSTimesForMyLocation((error, passTimes)=>{
  if (error) {
    return console.log("It didn't work! ", error);
  }

  printPassTimes(passTimes);
});