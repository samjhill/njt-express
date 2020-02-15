import express from 'express';
import * as NJTApi from 'njt-api';

const app = express();
const port = 3000;

const { Schedule, Stations } = NJTApi.default;

const newarkStation = "Newark%20Broad%20Street";
const pennStation = "New%20York%20Penn%20Station";

const getSchedule = async (fromStation, toStation) => {
  return Schedule.getScheduleForDay(fromStation, toStation, Date.now());
};


app.get('/schedule/from/:fromStation/to/:toStation', async (req, res) => {
  const { fromStation, toStation } = req.params;
  const schedule = await getSchedule(fromStation, toStation);

  res.send(schedule);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));