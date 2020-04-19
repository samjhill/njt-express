import React, { useState, useEffect } from 'react';
import { Flex } from 'rebass';
import moment from 'moment';

import { FloatingText } from './floatingText';
import { UmbrellaSvgComponent } from "./svg/umbrella";

import { serverUrl } from "../constants";

export const Weather = () => {
  const [weather, setWeather] = useState(null);
  const fetchData = useEffect(() => {
    fetch(`${serverUrl}/weather`)
      .then(res => res.json())
      .then(
        (result) => 
          setWeather(result),
        (error) => {
          console.error(error);
        }
      );
  }, [setWeather]);
  setInterval(fetchData, 60000);

  if (!weather) {
    return <p>Loading...</p>
  }
  
  return (
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
        {weather.current?.temperature !== weather.current?.feelslike ? (
          <>It's <strong>{weather.current?.temperature}°</strong>, but it feels like <strong>{weather.current?.feelslike}°</strong>.</>
        ): 
        (
          <>It's <strong>{weather.current?.temperature}°</strong> outside.</>
        )
        }
        
      </FloatingText>
      <FloatingText ml="2">
        {weather.current?.skytext},
        wind {weather.current?.winddisplay}
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
                    filter: "drop-shadow(5px 5px #010101c7)",
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
  );
}