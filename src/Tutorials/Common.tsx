import * as React from "react"

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { colorPalette } from '../Common';

import Graph from '../Graph';

import enterButtonIcon from '../Images/EnterEnabled.svg'

export function StepContent(props) {
  var style = {
    fontWeight: 400,
    fontSize: "14px",
    color: colorPalette[2]
  } as React.CSSProperties;

  if(props.highlight) {
    style.color = colorPalette[9]
  }

  return <div style={style}>{props.children}</div>
}

export function StepAction(props) {
  var style = {
    fontWeight: 400,
    fontSize: "14px",
    color: colorPalette[14]
  } as React.CSSProperties;

  if(props.highlight) {
    style.color = colorPalette[9]
  }

  if(props.greyOut) {
    style.color = colorPalette[4]
  }

  return <span style={style}>{props.children}</span>
}

export function Bold(props) {
  var style = {
    fontSize: "14px",
    fontWeight: 600
  } as React.CSSProperties;

  return <span style={style}>{props.children}</span>
}

export function Block(props) {
  var style = {
    paddingTop: "15px",
  }

  return <div style={style}>{props.children}</div>
}

export function BlankSpace() {
  var style = {
    display: "inline-block",
    height: "15px",
    width: "185px",
    background: colorPalette[6],
    position: "relative",
    top: "2px"
  } as React.CSSProperties;

  return <div style={style}></div>
}

export function Highlight(props) {
  const style = {
    color: colorPalette[15],
    marginLeft: "5px",
    fontWeight: 600,
  } as React.CSSProperties;


  return <span style={style}>{props.children}</span>
}

export interface TutorialState {
  completedUpto: number;
  completed: boolean;
}

interface TutorialStepContents {
  title: string;
  [x: string]: any
}

export interface TutorialContents {
  heading: string;
  subHeading: string;
  steps: Array<{
    contents: TutorialStepContents;
    card: new([any]) => React.Component<any, any, any>;
  }>
}

export interface TutorialStepProps {
  contents: any;
  graph: Graph;
  notifyResult: (bool) => void;
  onStepComplete: (any) => void;
  tutorialState: any;
}

export const TutorialCard = withStyles({
  root: {
    borderRadius: 0,
    boxShadow: "none",
    border: "none",
    borderBottom: `1px solid ${colorPalette[3]}`,
    overflow: "visible",
  }
})(Card)

export function equationToText(equation) {
  const [a, b, c] = equation;

  const a1 = Math.abs(a);
  const b1 = Math.abs(b);
  const c1 = Math.abs(c);

  const a2 = a1 == 1 ? "" : `${a1}`;
  const b2 = b1 == 1 ? "" : `${b1}`;
  const c2 = c1 == 1 ? "" : `${c1}`;

  var aPart = a == 0 ? " " : `${a2}x`;
  var bPart = b == 0 ? " " : `${b2}y`;
  var cPart = c == 0 ? " " : `${c2}`;

  var prefix = a >= 0 ? "" : "-";

  var abSeparator = b == 0 ? "" : (b > 0 ? " + " : " - ");
  var bcSeparator = c == 0 ? "" : (c > 0 ? " + " : " - ");

  return `${prefix}${aPart}${abSeparator}${bPart}${bcSeparator}${cPart}`
}

export function formatEquationLHS(equation, xElement, yElement) {
  const [a, b, c] = equation;

  const a1 = Math.abs(a);
  const b1 = Math.abs(b);
  const c1 = Math.abs(c);

  const a2 = a1 == 1 ? "" : `${a1}`;
  const b2 = b1 == 1 ? "" : `${b1}`;
  const c2 = c1 == 1 ? "" : `${c1}`;

  var aPart = a == 0 ? " " : <span>{a2}{xElement}</span>;
  var bPart = b == 0 ? " " : <span>{b2}{yElement}</span>;
  var cPart = c == 0 ? " " : <span>{c2}</span>;

  var prefix = a >= 0 ? "" : "-";

  var abSeparator = b == 0 ? "" : (b > 0 ? " + " : " - ");
  var bcSeparator = c == 0 ? "" : (c > 0 ? " + " : " - ");

  return <span>{prefix}{aPart}{abSeparator}{bPart}{bcSeparator}{cPart}</span>
}

export function formatEquation(equation, xElement, yElement) {
  return <span>{formatEquationLHS(equation, xElement, yElement)} = 0</span>
}

export function formatAddition(numbers) {
  const equation = []

  numbers.forEach((n, i) => {
    if(i > 0) {
      equation.push(n >= 0 ? "+" : "-")
      equation.push(Math.abs(n))
    } else {
      equation.push(n)
    }
  })

  return equation.join(" ");
}

export const lineAttr = {
  stroke: colorPalette[15],
  "stroke-width": "2"
}

export function TutorialContainer(props) {
  const style = {
    border: "none",
    borderBottom: `1px solid ${colorPalette[3]}`,
    overflow: "visible",
    backgroundColor: "white",
    padding: "16px",
    paddingBottom: "24px",
  } as React.CSSProperties;

  return <div style={style}>{props.children}</div>
}
  
/*
* Following code added or edited by Umar
*/

export class EnterButton extends React.Component<{onClick: () => void}> {
  buttonRef: React.RefObject<HTMLButtonElement>;

  constructor(props) {
    super(props)

    this.buttonRef = React.createRef()
  }

  focus() {
    this.buttonRef.current.focus();
  }

  blur = () => this.buttonRef.current.blur();

  render() {
    const imageStyle = {
      height: "36px",
      width: "36px",
    } as React.CSSProperties;
  
    const buttonStyle = {
      float: "right",
      marginBottom: "-47px"
    } as React.CSSProperties;

    return <Button style={buttonStyle} ref= {this.buttonRef} onClick={this.props.onClick}>
            <img src={enterButtonIcon} style={imageStyle}/>
          </Button>
  }

}

export const equations = [
  {
    coefficients: [2, -1, -10*10],
    simplification1: "\\frac{2x}{-100} - \\frac{y}{-100} - \\frac{100}{-100} = 0",
    simplification2: "-\\frac{x}{50} + \\frac{y}{100} + 1 = 0",
    simplifiedXCoeff: "-\\frac{1}{50}",
    simplifiedYCoeff: "\\frac{1}{100}",
  },
  {
    coefficients: [5, -4, 20*10],
    simplification1: "\\frac{5x}{200} + \\frac{-4y}{200} + \\frac{200}{200} = 0",
    simplification2: "\\frac{x}{40} - \\frac{y}{50} + 1 = 0",
    simplifiedXCoeff: "\\frac{1}{40}",
    simplifiedYCoeff: "-\\frac{1}{50}",
  },
  {
    coefficients: [-5, -2, 20*10],
    simplification1: "\\frac{-5x}{200} - \\frac{2y}{200} + \\frac{200}{200} = 0",
    simplification2: "-\\frac{x}{40} - \\frac{y}{100} + 1 = 0",
    simplifiedXCoeff: "-\\frac{1}{40}",
    simplifiedYCoeff: "-\\frac{1}{100}",
  },
  {
    coefficients: [1, -2, 18*10],
    simplification1: "\\frac{x}{180} + \\frac{-2y}{180} + \\frac{180}{180} = 0",
    simplification2: "\\frac{x}{180} - \\frac{y}{90} + 1 = 0",
    simplifiedXCoeff: "\\frac{1}{180}",
    simplifiedYCoeff: "-\\frac{1}{90}",
  },
  {
    coefficients: [-2, -4, 8*20],
    simplification1: "\\frac{-2x}{160} + \\frac{-4y}{160} + \\frac{160}{160} = 0",
    simplification2: "-\\frac{x}{80} - \\frac{y}{40} + 1 = 0",
    simplifiedXCoeff: "-\\frac{1}{80}",
    simplifiedYCoeff: "-\\frac{1}{40}",
  },
  {
    coefficients: [-1, 4, -8*20],
    simplification1: "\\frac{-x}{-160} + \\frac{4y}{-160} + \\frac{-160}{-160} = 0",
    simplification2: "\\frac{x}{160} - \\frac{y}{40} + 1 = 0",
    simplifiedXCoeff: "\\frac{1}{160}",
    simplifiedYCoeff: "-\\frac{1}{40}",
  }
]

