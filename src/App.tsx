import * as React from "react"

import Graph from './Graph'
import Notification from './Notification'

import MainMenu from './MainMenu'
import Header from './Header'

import { tutorialConstructors, TutorialContents } from './Tutorials'

import { levelDefs, LevelDefinition } from './Levels'

import { 
  GameMode,
  Column,
  Row,
}  from './Common'

import {
  TutorialCompleteSidebar,
  FailureSidebar,
  SuccessSidebar,
  TutorialSidebar,
  LevelSidebar
} from './Sidebar'

enum SidebarType {
  Tutorial,
  TutorialComplete,
  Level,
  Failure,
  Success,
}

interface AppState {
  notification: {
    open: boolean;
    variant: string
  };
  sidebarType: SidebarType;
  graphLoaded: boolean;
  showMenu: boolean;
  gameMode: GameMode;
  level: number;
  completedUpto: number;
  tutorialCompleted: boolean;
  tutorialSkipped: boolean;
  tutorialContents: TutorialContents;
  levelDef: LevelDefinition<any>;
}

export default class App extends React.Component<{}, AppState> {
  graphRef: React.RefObject<Graph>

  constructor(props: {}) {
    super(props)

    this.state = {
      notification: {
        open: false,
        variant: "success"
      },
      sidebarType: SidebarType.Level,
      graphLoaded: false,
      showMenu: true,
      gameMode: GameMode.Game,
      level: 0,
      completedUpto: 0,
      tutorialCompleted: false,
      tutorialSkipped: false,
      tutorialContents: new tutorialConstructors[0](),
      levelDef: new levelDefs[0]()
    }

    this.graphRef = React.createRef();
  }
  
  handleNotificationClose() {
    this.setState({notification: {open: false, variant: this.state.notification.variant}})
  }

  notifyResult(result: boolean) {
    if(result) {
      this.setState({notification: {open: true, variant: "success"}})
    } else {
      this.setState({notification: {open: true, variant: "failure"}})
    }
  }

  onLevelComplete(result: boolean) {
    const completedUpto = this.state.completedUpto;
    const level = this.state.level;

    if(result) {
      if(level > completedUpto - 1) {
        const newLevel = level + 1;
        const tutorialContents = new tutorialConstructors[newLevel%tutorialConstructors.length]()
        const levelDef = new levelDefs[newLevel%levelDefs.length]()

        this.setState({
          completedUpto: newLevel,
          tutorialContents: tutorialContents,
          tutorialCompleted: false,
          tutorialSkipped: false,
          levelDef: levelDef,
        })
      }

      this.setState({sidebarType: SidebarType.Success})
    } else {
      this.setState({sidebarType: SidebarType.Failure})
    }
  }

  onTutorialComplete() {
    const completedUpto = this.state.completedUpto;
    const level = this.state.level;

    if(level > completedUpto - 1) {
      this.setState({
        tutorialCompleted: true,
        tutorialSkipped: false,
        sidebarType: SidebarType.TutorialComplete
      })
    }
  }

  selectLevel(gameMode, levelNumber) {
    const sidebarType = (gameMode == GameMode.Tutorial ? SidebarType.Tutorial : SidebarType.Level)

    this.setState({
      gameMode: gameMode,
      level: levelNumber,
      sidebarType: sidebarType,
      showMenu: false,
    })
  }

  onGraphLoad() {
    this.setState({graphLoaded: true})
  }

  backToMenu() {
    this.setState({showMenu: true, graphLoaded: false})
  }

  startTutorial() {
    this.selectLevel(GameMode.Tutorial, this.state.level)
  }

  startGameLevel() {
    this.selectLevel(GameMode.Game, this.state.level)
  }

  sidebar() {
    const sidebarStyle = {
      width: "360px",
      minWidth: "360px",
      minHeight: "600px",
      height: "calc(100vh)",
    }

    if(!this.state.graphLoaded) {
      return <div style={sidebarStyle}></div>
    }

    switch(this.state.sidebarType) {
      case SidebarType.Tutorial:
        return <TutorialSidebar graph={this.graphRef.current}
                                notifyResult={this.notifyResult.bind(this)}
                                backToMenu={this.backToMenu.bind(this)}
                                onTutorialComplete={this.onTutorialComplete.bind(this)}
                                contents={this.state.tutorialContents}
                                 />;

      case SidebarType.TutorialComplete:
        return <TutorialCompleteSidebar startGameLevel={this.startGameLevel.bind(this)}
                                        levelTitle={this.state.levelDef.heading}
                                        title={this.title()}/>;

      case SidebarType.Level:
        return <LevelSidebar graph={this.graphRef.current}
          onLevelComplete={this.onLevelComplete.bind(this)}
          levelDef={this.state.levelDef}
          backToMenu={this.backToMenu.bind(this)}/>;

      case SidebarType.Success:
        return <SuccessSidebar level="02" backToMenu={this.backToMenu.bind(this)}/>;

      case SidebarType.Failure:
        return <FailureSidebar level="02"
                               tutorialSkipped={this.state.tutorialSkipped}
                               startTutorial={this.startTutorial.bind(this)}
                               backToMenu={this.backToMenu.bind(this)}/>;

    }
  }

  skipTutorial() {
    const completedUpto = this.state.completedUpto;

    if(this.state.level > completedUpto - 1) {
      this.setState({
        tutorialSkipped: true
      })
    }
    this.backToMenu()
  }

  title() {
    if(this.state.gameMode == GameMode.Tutorial) {
      const tutorialContents = this.state.tutorialContents;

      return `${tutorialContents.heading} - ${tutorialContents.subHeading}`;
    }

    const levelDef = this.state.levelDef;

    return `${levelDef.heading} - ${levelDef.subHeading}`;
  }

  render() {
    const containerStyle = {
      margin: "0px",
      fontFamily: 'Open Sans',
      fontWeight: 400,
    } as React.CSSProperties;

    const showTutorial = !(this.state.tutorialCompleted || this.state.tutorialSkipped)

    if(this.state.showMenu) {
      return <div style={containerStyle}>
        <MainMenu completedUpto={this.state.completedUpto}
                  showTutorial={showTutorial}
                  selectLevel={this.selectLevel.bind(this)}/>
      </div>
    }

    
    return (
      <div style={containerStyle}>
        <Notification {...this.state.notification} handleClose={this.handleNotificationClose.bind(this)}/>
        <Column>
          <Header title={this.title()}
                  gameMode={this.state.gameMode}
                  skipTutorial={this.skipTutorial.bind(this)}
                  backToMenu={this.backToMenu.bind(this)} />
          
          <Row>
            {this.sidebar()}
            <Graph ref={this.graphRef} onLoad={this.onGraphLoad.bind(this)} />
          </Row>
        </Column>
      </div>
    );
  }
}

/*
import React from 'react'

import './App.scss'

const App:React.StatelessComponent<{}>  = () => (
    <div className='container'>
        <h1>Hello World, React!</h1>
    </div>
)

export default App;
*/