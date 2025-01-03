import React, { Component } from 'react';
import { Circle } from "@shopify/react-native-skia";



const Note = ({ color, cx, cy }) => {
  return (
    <Circle cx={cx} cy={cy} r={16} color={color} />
  );
};



export default Note;