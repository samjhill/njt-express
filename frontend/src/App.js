import React, { useEffect, useState } from 'react';
import './App.css';

import moment from 'moment';
  

function App() {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/schedule/from/Newark%20Broad%20Street/to/New%20York%20Penn%20Station")
      .then(res => res.json())
      .then(
        (result) => {
          setSchedule(result);
        },
        (error) => {
          console.error(error);
        }
      );
  }, [setSchedule]);

  if (!schedule) {
    return <p>Loading...</p>
  }

  const nextTrain = schedule[0];
  const departureTime = moment(nextTrain.origin.time, 'h:mma');
  const diff = departureTime.diff(moment());
  const diffDuration = moment.duration(diff);
  
  return (
    <div className="App">
      <p>Next Train</p>
      <p>{diffDuration.minutes()} minutes</p>
      <p>{departureTime.format('h:mma')}</p>
      
    </div>
  );
}

export default App;
