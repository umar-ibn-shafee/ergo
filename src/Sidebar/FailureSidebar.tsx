import * as React from "react"
import Grid from '@material-ui/core/Grid';
import {  GridSpacing } from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import levelLockedIcon from '../Images/LevelLocked.svg'

import { colorPalette } from '../Common'

interface FailureSidebarProps {
  level: string;
  tutorialSkipped: boolean;
  backToMenu: () => void;
  startTutorial: () => void;
}

const FailureSidebarGrid = withStyles({
  container: {
  background: colorPalette[9],
  width: '360px',
  minWidth: '360px',
  height: "calc(100vh - 50px)",
  minHeight: '600px',
  margin: '0px',
  padding: '15px',
  borderRight: `1px solid ${colorPalette[3]}`
}})(Grid)

function FailureSidebarContents(props: FailureSidebarProps) {
  const buttonStyle={
    color: "white",
    border: "1px solid white"
  };

  var message = null;
  var button = null;

  if(props.tutorialSkipped) {
    message = <div>
      <p>We see that you haven’t completed the Tutorial 01: Basic Graph Terminology.</p>
      <p>Now you need to complete it before trying this Game Level 01 again.</p>
    </div>

    button = <Button onClick={props.startTutorial} style={buttonStyle} variant="outlined"> Start Tutorial 01 </Button>
  } else {
    message = <p>We highly recommend that you reach out to a teacher to guide you.</p>

    button = <Button onClick={props.backToMenu} style={buttonStyle} variant="outlined"> Main menu </Button>
  }

  return <div style={{marginTop: "100px", color: "white" }}>
    <Grid alignItems="center" direction="column" container spacing={Number(16) as GridSpacing}>
      <Grid item>
        <img src={levelLockedIcon} style={{height: "75px", width: "75px"}}/>
      </Grid>

      <Grid item>
        <span style={{fontSize: "20px"}}> Level Failed. </span>
      </Grid>
      <Grid item>
        <div>
          {message}
        </div>
      </Grid>

      <Grid item>
        {button}
      </Grid>
    </Grid>
  </div> 
}

export default class FailureSidebar extends React.Component<FailureSidebarProps, {}> {
  render() {
    return (
      <FailureSidebarGrid direction="column" justify="flex-start" spacing={Number(16) as GridSpacing} container>
        <Grid item>
          <FailureSidebarContents {...this.props} />
        </Grid>
      </FailureSidebarGrid>
    )
  }
}
