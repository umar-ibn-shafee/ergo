import * as React from "react"

import Button from '@material-ui/core/Button';

import { colorPalette, GameMode } from './Common'
import menuIconWhite from './Images/MenuIconWhite.svg'

interface HeaderProps {
  title: string;
  gameMode: GameMode;
  skipTutorial: () => void;
  backToMenu: () => void;
}

export default class Header extends React.Component<HeaderProps, {}> {
  skipTutorialButton() {
    const buttonStyle={
      background: "white",
      width: "150px",
      borderRadius: "7px",
      color: "white",
      border: `1px solid white`,
      fontWeight: 300,
      fontSize: "14px",
      backgroundColor: "black",
    } as React.CSSProperties;

   
    if(this.props.gameMode == GameMode.Tutorial) {
      return <Button style={buttonStyle} variant="outlined" onClick={this.props.skipTutorial}>
        Skip Tutorial
      </Button>
    }

    return <div></div>
  }

  menuButton() {
    const menuButtonStyle = {height: "32px", width: "32px"};

    return <Button  onClick={this.props.backToMenu}>
      <img src={menuIconWhite} style={menuButtonStyle}/>
    </Button>
  }

  render() {
    const headerStyle = {
      height: "50px",
      color: "white",
      alignItems: "center",
      backgroundColor: "black",
      display: "flex",
      flexDirection: 'row',
      fontWeight: 500,
    } as React.CSSProperties;
   
    return (<div style={headerStyle}>
      <div style={{marginLeft: "10px"}}>
        {this.props.title}
      </div>

      <div style={{marginLeft: "auto"}}>
        {this.skipTutorialButton()}
        {this.menuButton()}
      </div>
    </div>)
  }
}
