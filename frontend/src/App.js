import React, { useEffect, useState } from 'react';
import './App.css';

import moment from 'moment';
import BackgroundVideo from 'react-background-video-player';

import { Box, Text } from "rebass";

const { NODE_ENV } = process.env;

const URLS = {
  production: "http://167.172.248.184:8000",
  default: "http://localhost:8000",
};

const serverUrl = URLS[NODE_ENV] || URLS.default;

const FloatingText = ({ children }) => (
  <Text 
    textAlign="left"
    fontSize="6" 
    color="white" 
    sx={{
      textShadow: "2px 2px #010101c7",
    }}
  >
    {children}
  </Text>
);

function App() {
  const [schedule, setSchedule] = useState(null);
  const [videosList, setVideosList] = useState(null);
  
  useEffect(() => {
    fetch(`${serverUrl}/schedule/from/Newark%20Broad%20Street/to/New%20York%20Penn%20Station`)
      .then(res => res.json())
      .then(
        (result) => {
          setSchedule(result);
        },
        (error) => {
          console.error(error);
        }
      );

    fetch(`${serverUrl}/videos/list`)
    .then(res => res.json())
    .then(
      (result) => {
        setVideosList(result);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [setSchedule, setVideosList]);

  if (!schedule || !videosList) {
    return <p>Loading...</p>
  }

  const nextTrain = schedule[0];
  const departureTime = moment(nextTrain.origin.time, 'h:mma');
  const diff = departureTime.diff(moment());
  const diffDuration = moment.duration(diff);

  const selectedVideo = videosList[Math.floor(Math.random() * videosList.length)];

  return (
    <div className="App">
      <div style={{position: 'absolute', width: ' 100%', height: '100%'}}>
        <BackgroundVideo 
          playsInline={true}
          containerWidth={100}
          containerHeight={100}
          src={`${serverUrl}/videos/${selectedVideo}`}
          poster={''}
          autoPlay={true}
          volume={0}
          style={{
            zIndex: 0
          }}
        />
      </div>
      <Box 
      m="4"
      p="4"
      style={{
        zIndex: 1,
        position: "absolute"
      }}>
        <FloatingText>Next Train</FloatingText>
        <FloatingText>{diffDuration.minutes()} minutes - {departureTime.format('h:mma')}</FloatingText>
      </Box>
    </div>
  );
}

export default App;
