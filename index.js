const express = require('express');
const NJTApi = require('njt-api');
const cors = require('cors');
const moment = require('moment');
const weather = require('weather-js');
const fs = require('fs');

const port = 8000;
const app = express();
app.use(cors());

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

app.get('/weather', async (req, res) => {
  weather.find({search: 'Newark, NJ', degreeType: 'F'}, (err, result) => {
    if (err) console.log(err);
   
    res.send(result.length ? result[0] : result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));