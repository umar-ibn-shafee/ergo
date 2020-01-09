import * as React from "react"
import Grid from '@material-ui/core/Grid';
import {  GridSpacing } from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import levelUnlockedIcon from '../Images/LevelUnlocked.svg'

import { colorPalette } from '../Common'

interface SuccessSidebarProps {
  level: string;
  backToMenu: () => void;
}

const SuccessSidebarGrid = withStyles({
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

function SuccessSidebarContents(props: SuccessSidebarProps) {
  const buttonStyle={
    color: "white",
    border: "1px solid white"
  };

  return <div style={{marginTop: "100px", color: "white" }}>
    <Grid alignItems="center" direction="column" container spacing={Number(16) as GridSpacing}>
      <Grid item>
        <img src={levelUnlockedIcon} style={{height: "75px", width: "75px"}}/>
      </Grid>

      <Grid item>
        <span style={{fontSize: "20px"}}> Awesome! </span>
      </Grid>
      <Grid item>
        <div>
          You have just completed this Level and unlocked Level {props.level}
        </div>
      </Grid>

      <Grid item>
        <Button style={buttonStyle} variant="outlined" onClick={props.backToMenu}>
          Back to main menu
        </Button>
      </Grid>
    </Grid>
  </div> 
}

export default class SuccessSidebar extends React.Component<SuccessSidebarProps, {}> {
  render() {
    return (
      <SuccessSidebarGrid direction="column" justify="flex-start" spacing={Number(16) as GridSpacing} container>
        <Grid item>
          <SuccessSidebarContents {...this.props} />
        </Grid>
      </SuccessSidebarGrid>
    )
  }
}
