import React from 'react';
import moment from 'moment';
import { Box } from 'rebass';
import { FloatingText } from "./floatingText";

export const TrainScheduleItem = ({ fromStation, toStation, trainNumber, departureTime }) => {
  const departureTimeMoment = moment(departureTime, 'h:mma');
  const diff = departureTimeMoment.diff(moment());
  const diffDuration = moment.duration(diff).minutes();
  if (diffDuration < 0) {
    return null;
  }
  return (
    <Box 
      m="4"
      p="4"
      style={{
        zIndex: 1,
        position: "relative"
      }}
      maxWidth="1000px"
    >
      <FloatingText>
        {fromStation} to {toStation} {trainNumber && <strong>#{trainNumber}</strong>} leaves in <strong>{diffDuration} {diffDuration === 1 ? "minute" : "minutes"}</strong>, at <strong>{departureTimeMoment.format('h:mma')}</strong>.
      </FloatingText>
    </Box>
  );
};