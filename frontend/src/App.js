import React, { useEffect, useState } from 'react';
import './App.css';

import moment from 'moment';
import BackgroundVideo from 'react-background-video-player';

import { Box, Text, Flex } from "rebass";
import { motion } from "framer-motion"

const { NODE_ENV } = process.env;

const URLS = {
  production: "http://167.172.248.184:8000",
  default: "http://localhost:8000",
};

const serverUrl = URLS[NODE_ENV] || URLS.default;

const FloatingText = ({ children }) => (
  <Text 
    textAlign="left"
    fontSize="8" 
    color="white" 
    fontFamily="'Roboto', sans-serif"
    sx={{
      textShadow: "5px 5px #010101c7",
    }}
  >
    {children}
  </Text>
);

function App() {
  const [schedule, setSchedule] = useState(null);
  const [videosList, setVideosList] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoIsLoading, setVideoIsLoading] = useState(true);
  const [weather, setWeather] = useState(null);

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
          setSelectedVideo(result[Math.floor(Math.random() * result.length)])
        },
        (error) => {
          console.error(error);
        }
      );

    fetch(`${serverUrl}/weather`)
      .then(res => res.json())
      .then(
        (result) => 
          setWeather(result),
        (error) => {
          console.error(error);
        }
      );
  }, [setSchedule, setVideosList, setWeather]);

  if (!schedule || !videosList) {
    return <p>Loading...</p>
  }

  const nextTrain = schedule[0];

  const departureTime = nextTrain && moment(nextTrain.origin.time, 'h:mma');
  const diff = nextTrain && departureTime.diff(moment());
  const diffDuration = nextTrain && moment.duration(diff);

  return (
    <div className="App">
        <Box>
          <Box sx={{
              backgroundColor: "#333", 
              position: 'absolute', width: ' 100%', height: '100%'
            }}>
          <motion.div 
            animate={
              videoIsLoading
                ? { opacity: 0 }
                : { opacity: 1 }
            }
            transition={{ duration: 1 }}
          >
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
                  zIndex: 0,
                }}
                loop={false}
                onReady={() => {
                  setVideoIsLoading(false);
                }}
                onEnd={() => {
                  setVideoIsLoading(true);
                  setSelectedVideo(videosList[Math.floor(Math.random() * videosList.length)]);
                }}
              />
            </div>
          </motion.div>
          </Box>

        {nextTrain && (
          <Box 
            m="4"
            p="4"
            style={{
              zIndex: 1,
              position: "absolute"
            }}
          >
            <FloatingText>Broad Street to Penn Station <strong>#{nextTrain.origin.trainNumber}</strong></FloatingText>

            <FloatingText>leaves in <strong>{diffDuration.minutes()} minutes</strong>, at <strong>{departureTime.format('h:mma')}</strong>.</FloatingText>
          </Box>
        )}

        {weather && (
          <motion.div 
            transition={{ duration: 1 }}
          >
            <Flex 
              m="4"
              p="4"
              style={{
                zIndex: 1,
                position: "absolute",
                bottom: 0
              }}
              flexDirection="column"
            >
              <FloatingText>
                It's <strong>{weather.current?.temperature}°</strong>, but it feels like <strong>{weather.current?.feelslike}°</strong>
              </FloatingText>
              <FloatingText ml="2">
                {weather.current?.skytext}
              </FloatingText>
            </Flex>
          </motion.div>
        )}
      </Box>
    </div>
  );
}

export default App;
