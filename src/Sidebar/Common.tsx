import * as React from "react"

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { colorPalette } from '../Common'

import menuIconGrey from '../Images/MenuIconGrey.svg'

import Button from '@material-ui/core/Button';

export const FooterGridItem = withStyles({
  item: {
  marginTop: "auto",
  padding: "8px"
}})(Grid)

export const SidebarGrid = withStyles({
  container: {
  background: colorPalette[6],
  width: '360px',
  minWidth: '360px',
  height: "calc(100vh - 50px)",
  minHeight: '550px',
  margin: '0px',
  padding: '0px',
  borderRight: `1px solid ${colorPalette[3]}`,
  flexWrap: "nowrap",
  overflowY: "auto",
  scrollbarWidth: "thin",
}})(Grid)

export function SidebarColumn(props) {
  const style = {
    background: colorPalette[6],
    width: '360px',
    minWidth: '360px',
    height: "calc(100vh - 50px)",
    minHeight: '550px',
    margin: '0px',
    padding: '0px',
    borderRight: `1px solid ${colorPalette[3]}`,
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    overflowY: "auto",
    scrollbarWidth: "thin",
  } as React.CSSProperties;

  return <div style={style}>{props.children}</div>
}

export function SidebarFooter(props) {
  const style = {
    marginTop: "auto",
    padding: "8px"
  } as React.CSSProperties;

  return <div style={style}>{props.children}</div>
}
