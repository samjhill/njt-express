import React, { useState, useEffect } from 'react';
import { Flex, Text } from 'rebass';
import moment from 'moment';
import { FloatingText } from './floatingText';

export const Clock = () => {
  const currentTime = moment();
  const formattedTime = currentTime.format("hh:mma");
  const formattedDate = currentTime.format("dddd, MMMM D");

  return (
    <Flex 
      m="4"
      p="4"
      style={{
        zIndex: 1,
        position: "absolute",
        right: 0
      }}
      flexDirection="column"
    >
      <FloatingText fontSize="8">{formattedTime}</FloatingText>
      <FloatingText fontSize="6">{formattedDate}</FloatingText>
    </Flex>
  );
};