import React from 'react';
import { Text } from 'rebass';

export const FloatingText = ({ children }) => (
  <Text 
    textAlign="left"
    fontSize="8" 
    color="white" 
    fontFamily="'Roboto', sans-serif"
    border="1px solid white"
    sx={{
      textShadow: "1px 1px 7px #010101c7",
    }}
  >
    {children}
  </Text>
);