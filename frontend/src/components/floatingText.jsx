import React from 'react';
import { Text } from 'rebass';

export const FloatingText = ({ children, fontSize = "8" }) => (
  <Text 
    textAlign="left"
    fontSize={fontSize}
    color="white" 
    fontFamily="'Roboto', sans-serif"
    border="1px solid white"
    sx={{
      textShadow: "5px 5px #010101c7",
    }}
  >
    {children}
  </Text>
);