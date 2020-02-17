import React, { useEffect, useState } from 'react';
import './App.css';

import moment from 'moment';
import BackgroundVideo from 'react-background-video-player';

import { Box, Flex } from "rebass";
import { motion } from "framer-motion"

import { TrainScheduleItem } from "./components/trainScheduleItem";
import { FloatingText } from "./components/floatingText";
import { UmbrellaSvgComponent } from "./components/svg/umbrella";

const { NODE_ENV } = process.env;

const URLS = {
  production: "http://167.172.248.184:8000",
  default: "http://localhost:8000",
};

const serverUrl = URLS[NODE_ENV] || URLS.default;

function App() {
  const [schedule, setSchedule] = useState(null);
  const [videosList, setVideosList] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoIsLoading, setVideoIsLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [pathTrainSchedule, setPathTrainSchedule] = useState(null);

  const fetchData = useEffect(() => {
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

    fetch(`https://path.api.razza.dev/v1/stations/newark/realtime`)
      .then(res => res.json())
      .then(
        (result) => 
          setPathTrainSchedule(result),
        (error) => {
          console.error(error);
        }
      );

    setTimeout(fetchData, 60000);
  }, [setSchedule, setVideosList, setWeather, setPathTrainSchedule]);

  if (!schedule || !videosList) {
    return <p>Loading...</p>
  }
  
  const nextTrain = schedule[0];
  const toReturn = (
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
        
        <Box 
          sx={{
            position: 'absolute', width: ' 100%', height: '100%'
          }}
        >
          {nextTrain && (
            <TrainScheduleItem 
              fromStation="Broad Street" 
              toStation="New York Penn" 
              trainNumber={nextTrain.origin.trainNumber}
              departureTime={nextTrain.origin.time}
            />
          )}

          {pathTrainSchedule && (
            <TrainScheduleItem 
              fromStation="PATH from Newark Penn" 
              toStation={pathTrainSchedule.upcomingTrains[0].headsign}
              departureTime={moment(pathTrainSchedule.upcomingTrains[0].projectedArrival).format('h:mma')}
            />
          )}
        </Box>

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
                It's <strong>{weather.current?.temperature}°</strong>, but it feels like <strong>{weather.current?.feelslike}°</strong>.
              </FloatingText>
              <FloatingText ml="2">
                {weather.current?.skytext}
                {
                  weather.forecast.find(
                    forecast => forecast.day === moment().format('dddd')
                  )
                    .skytextday
                    .toLowerCase()
                    .indexOf('rain') > -1 && (
                      <>
                        <UmbrellaSvgComponent 
                          fill="white" 
                          width="200" 
                          height="200" 
                          style={{
                            filter: "drop-shadow( 5px 5px #010101c7)",
                            position: 'fixed',
                            bottom: '2rem',
                            right: '2rem'
                          }}
                        />
                      </>
                    )
                }
              </FloatingText>
            </Flex>
          </motion.div>
        )}
      </Box>
    </div>
  );
  
  // we're running into an occasional weird error with the background video player
  // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
  try {
    return toReturn;
  } catch (e) {
    console.error(e);
    setSelectedVideo(videosList[Math.floor(Math.random() * videosList.length)]);
    setVideoIsLoading(false);
  }
}

export default App;
