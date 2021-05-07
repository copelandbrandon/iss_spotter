const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (err, response, body)=>{
    if (err) {
      callback(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body).ip;
    callback(null, data);
  });
  // use request to fetch IP address from JSON API
};

const fetchCoordsByIp = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (err, response, body) => {
    if (err) {
      return callback(err, null);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching location. Response: ${body}`), null);
      return;
    }

    let info = JSON.parse(body);

    let location = {
      latitude: JSON.stringify(info.latitude),
      longitude: JSON.stringify(info.longitude)
    };
    callback(null, location);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}&alt=1650`, (err, response, body)=>{
    if (err) {
      return callback(err), null;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching fly over times. Response: ${body}`), null);
      return;
    }
    const flyTimes = JSON.parse(body).response;
    callback(null, flyTimes);
  });
};

const nextISSTimesForMyLocation = function(callback){
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIp(ip, (error, location) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(location, (error, flyTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, flyTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
