import * as React from "react";
import { useCallback } from "react";
// import Card from '@material-ui/core/Card';
// import { withStyles } from '@material-ui/core/styles';

// import Graph from './Graph';

export const colorPalette = {
  1  :"#231f20",
  2  :"#6d6e70",
  3  :"#929497",
  4  :"#bbbdbf",
  5  :"#d0d2d3",
  6  :"#f3f4f5",
  7  :"#b29ac6",
  8  :"#70c48f",
  9  :"#f16a5e",
  10 :"#f9ad84",
  11 :"#67babf",
  12 :"rgba(247, 206, 62, 0.5)",
  13 :"#662d91",
  14: "#f7941d", 
  15: "#1b75bb",
}

export enum GameMode {
  Tutorial="Tutorial",
  Game="Game", 
}

export interface Point {
  x: number;
  y: number;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomSample(array) {
  return array[getRandomInt(0, array.length - 1)];
}

export function SidebarDivider() {
  const sidebarDividerStyle = {
    marginTop: '10px',
    marginBottom: '10px',
    backgroundColor: colorPalette[3],
    width: "100%"
  };

  return <hr style={sidebarDividerStyle} />
}

export function Column(props) {
  const style = {
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties;

  return <div style={style}>{props.children}</div>
}

export function Row(props) {
  const style = {
    display: "flex",
    flexDirection: "row",
  } as React.CSSProperties;

  return <div style={style}>{props.children}</div>
}

//Returns the gcd of a and b. Uses floor to make integers. 
export function gcd(a,b) {
  a = Math.round(Math.abs(a));
  b = Math.round(Math.abs(b));
  if (b > a) {var temp = a; a = b; b = temp;}
  while (true) {
      if (b == 0) return a;
      a %= b;
      if (a == 0) return b;
      b %= a;
  }
}
