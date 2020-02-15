const express = require('express');
const NJTApi = require('njt-api');
const app = express();
const cors = require('cors');
const port = 8000;
const moment = require('moment');
const fs = require('fs');

const allowedOrigins = ['http://localhost:3000', 'http://localhost', '167.172.248.184'];

app.use(cors({
  origin: function(origin, callback){
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

const { Schedule, Stations } = NJTApi;

const getSchedule = async (fromStation, toStation) => {
  return Schedule.getScheduleForDay(fromStation, toStation, Date.now());
};

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/schedule/from/:fromStation/to/:toStation', async (req, res) => {
  const { fromStation, toStation } = req.params;
  const schedule = await getSchedule(fromStation, toStation);

  // only show trains that are after Now
  const trainsAfterNow = schedule.results.filter(entry => {
    const now = moment();
    const departureTime = moment(entry.origin.time, 'h:mma');

    return departureTime > now;
  });

  res.send(trainsAfterNow);
});

app.get('/videos/list', (req, res) => {
  res.send(fs.readdirSync('videos'));
});

app.use('/videos', express.static('videos'));

app.listen(port, () => console.log(`Listening on port ${port}!`));