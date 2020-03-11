import * as React from "react"
import Grid from '@material-ui/core/Grid';
import {  GridSpacing } from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import CorrectIcon from '../Images/CorrectIcon.svg'

import { colorPalette } from '../Common'

interface TutorialCompleteSidebarProps {
  title: string;
  levelTitle: string;
  startGameLevel: () => void;
}

const TutorialCompleteSidebarGrid = withStyles({
  container: {
  background: colorPalette[8],
  width: '360px',
  minWidth: '360px',
  height: "calc(100vh - 50px)",
  minHeight: '600px',
  margin: '0px',
  padding: '15px',
  borderRight: `1px solid ${colorPalette[3]}`
}})(Grid)

function TutorialCompleteSidebarContents(props: TutorialCompleteSidebarProps) {
  const buttonStyle={
    color: "white",
    border: "1px solid white"
  };

  return <div style={{marginTop: "100px", color: "white" }}>
    <Grid alignItems="center" direction="column" container spacing={Number(16) as GridSpacing}>
      <Grid item>
        <img src={CorrectIcon} style={{height: "75px", width: "75px"}}/>
      </Grid>

      <Grid item>
        <span style={{fontSize: "20px"}}> Excellent! </span>
      </Grid>
      <Grid item>
        <div>
          You have just completed Tutorial {props.title}
        </div>
      </Grid>

      <Grid item>
        <Button style={buttonStyle} variant="outlined" onClick={props.startGameLevel}>
          Start {props.levelTitle}
        </Button>
      </Grid>
    </Grid>
  </div> 
}

export default class TutorialCompleteSidebar extends React.Component<TutorialCompleteSidebarProps, {}> {
  render() {
    return (
      <TutorialCompleteSidebarGrid direction="column" justify="flex-start" spacing={Number(16) as GridSpacing} container>
        <Grid item>
          <TutorialCompleteSidebarContents {...this.props} />
        </Grid>
      </TutorialCompleteSidebarGrid>
    )
  }
}
