import * as React from "react"
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

import Graph from '../Graph'

import { colorPalette } from '../Common'
import { TutorialContents, TutorialState } from '../Tutorials'

import { 
  SidebarColumn,
  SidebarFooter,
} from './Common'

import BackDisabled from '../Images/BackDisabled.svg'
import BackEnabled from '../Images/BackEnabled.svg'

import CorrectIcon from '../Images/CorrectIcon.svg'

interface SubHeaderProps {
  subHeading: string,
  activeStep: number,
  maxSteps: number,
}

function SubHeader(props: SubHeaderProps) {
  const headingStyle = {
    fontSize: "14px",
    fontWeight: 400,
    color: "white",
    backgroundColor: colorPalette[4],
    height: "24px",
    padding: "8px",
    paddingLeft: "15px",
    paddingRight: "15px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  } as React.CSSProperties;

  return (<div style={headingStyle}>
      <div>
        {props.subHeading}
      </div>

      <div style={{marginLeft: "auto"}}>
        {props.activeStep + 1}/{props.maxSteps}
      </div>
  </div>)
}


interface TutorialFooterProps {
  activeStep: number;
  onBack: () => void;
  steps: Array<{
    contents: {
      title: string;
    }
  }>;
}

function TutorialFooter(props: TutorialFooterProps) {
  const circleStyle = {
    borderRadius: "50%",
    width: "15px",
    lineHeight: "15px",
    fontSize: "10px",
    GfontWeight: "bold",
    display: "inline-block",
    textAlign: "center",
    marginLeft: "5px"
  };

  const currentCircleStyle = Object.assign({
    background: colorPalette[2],
    color: "white",
    border: `1px solid ${colorPalette[2]}`
  }, circleStyle)

  const disabledCircleStyle = Object.assign({
    color: colorPalette[2],
    background: colorPalette[6],
    border: `1px solid ${colorPalette[2]}`
  }, circleStyle)

  const completedCircleStyle = Object.assign({
    background: CorrectIcon,
    color: "#ffffff",
    border: `1px solid ${colorPalette[8]}`
  }, circleStyle)

  const baseTextStyle = {
    fontWeight: 300,
    fontSize: "14px",
    marginBottom: "5px",
    color: colorPalette[4],
    textAlign: "right"
  } as React.CSSProperties;

  const backIcon = props.activeStep == 0 ? BackDisabled : BackEnabled;

  const footerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "20px"
  } as React.CSSProperties;

  return (
    <div style={footerStyle}>
        <Button onClick={props.onBack}>
          <img src={backIcon} style={{height: "36px", width: "36px"}} />
        </Button>
        <div style={{marginLeft: "auto"}}>
          {
            props.steps.map((slide, index) => {
              if(index < props.activeStep) {
                let textStyle = Object.assign({}, baseTextStyle, {fontWeight: 400, color: colorPalette[8]})
                let imgStyle = {verticalAlign: "middle", display: "inline-block", marginLeft: "5px"}

                return (<div key={`tutorial-slide-${index}`} style={textStyle}>
                  <span>{slide.contents.title}</span>
                  <img width="15px" height="15px" src={CorrectIcon} />
                </div>)
              } else if(index == props.activeStep) {
                let circleStyle = currentCircleStyle
                let textStyle = Object.assign({}, baseTextStyle, {color: colorPalette[2]})

                return (
                  <div key={`tutorial-slide-${index}`} style={textStyle}>
                    <span>{slide.contents.title}</span>
                    <span style={circleStyle}>{index + 1}</span>
                  </div>
                )
              } else {
                let circleStyle = disabledCircleStyle;
                let textStyle = baseTextStyle;

                return (
                  <div key={`tutorial-slide-${index}`} style={textStyle}>
                    <span>{slide.contents.title}</span>
                    <span style={circleStyle}>{index + 1}</span>
                  </div>
                )
              }
            })
          }
        </div>
    </div>
  )
}

interface TutorialSidebarProps {
  graph: Graph;
  notifyResult: any;
  backToMenu: () => void;
  onTutorialComplete: () => void;
  contents: TutorialContents;
}

interface TutorialSidebarState {
  activeStep: number;
  tutorialState: any;
}

export default class TutorialSidebar extends React.Component<TutorialSidebarProps, TutorialSidebarState> {
  constructor(props) {
    super(props)

    this.state = {
      activeStep: 0,
      tutorialState: {},
    };
  }

  onStepComplete(tutorialState) {
    const contents = this.props.contents;

    if(this.state.activeStep + 1 == contents.steps.length) {
      this.props.onTutorialComplete();
    } else {
      this.setState({
        tutorialState: tutorialState
      });

      this.goForward();
    }
  }

  goBack() {
    if(this.state.activeStep > 0) {
      this.setState({
        activeStep: this.state.activeStep - 1
      })
    }
  }

  goForward() {
    const contents = this.props.contents;

    if(this.state.activeStep < contents.steps.length - 1) {
      this.setState({
        activeStep: this.state.activeStep + 1
      })
    }
  }

  render() {
    const activeStep = this.state.activeStep;
    const contents = this.props.contents;
    const maxSteps = contents.steps.length;
    const currentStep = contents.steps[activeStep];
    const CurrentCard = currentStep.card;

    return (
      <SidebarColumn>
        <SubHeader subHeading={currentStep.contents.title} 
                   activeStep={activeStep}
                   maxSteps={maxSteps} />

        <CurrentCard contents={currentStep.contents}
                     graph={this.props.graph}
                     tutorialState={this.state.tutorialState}
                     onStepComplete={this.onStepComplete.bind(this)}
                     notifyResult={this.props.notifyResult.bind(this)}/>

        <SidebarFooter>
          <TutorialFooter steps={contents.steps}
                          onBack={this.goBack.bind(this)}
                          activeStep={activeStep} />
        </SidebarFooter>
      </SidebarColumn>
    )
  }
}



