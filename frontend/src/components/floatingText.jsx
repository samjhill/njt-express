import React from 'react';
import { Text } from 'rebass';

export const FloatingText = ({ children }) => (
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