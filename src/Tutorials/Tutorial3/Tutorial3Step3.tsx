import * as React from "react"

import { NumberInput }from '../../Input'

import {
  colorPalette,
} from '../../Common';

import {
  StepContent,
  StepAction,
  Bold,
  Block,
  TutorialStepProps,
  TutorialContainer,
  EnterButton,
  formatEquationLHS,
  formatAddition,
  lineAttr,
} from '../Common';

interface Tutorial3Step3State {
  currentSubStep: number;
  showSimplifications: boolean;
  highlightContent: boolean;
}

export default class Tutorial3Step3 extends React.Component<TutorialStepProps, Tutorial3Step3State> {
  xRef: React.RefObject<NumberInput>
  yRef: React.RefObject<NumberInput>
  p: {x: number, y: number}

  text1 = (p) => <span>Consider the point <Bold>P({p.x}, {p.y})</Bold> not on the line</span>;
  text2 = "As before we substitute the coordinates in the left hand side of the equation.";
  text3 = "That means that L.H.S ≠ R.H.S and so the point does not satisfy the line equation.";
  text4 = "We observe that points not on the line do not satisfy the line equation.";

  constructor(props) {
    super(props)
    
    this.state = {
      currentSubStep: 0,
      showSimplifications: false,
      highlightContent: false,
    }

    this.xRef = React.createRef()
    this.yRef = React.createRef()

    this.p = this.locatePointNotOnLine(props.contents.equation, props.graph.axesDef.subTickSize);
  }

  locatePointNotOnLine(equation, subTickSize) {
    const [a, b, c] = equation;

    const yIntercept = -c/b
    return {x: 0, y: yIntercept - 2*subTickSize}
  }
  
  componentDidMount() {
    const graph = this.props.graph;
    const [a, b, c] = this.props.contents.equation;

    graph.reset();
    graph.drawLine([a, b, c], null, lineAttr)

    const p = this.p;
    graph.addPoint(p, 5, {
      "fill": colorPalette[1],
    })

    graph.addPoint(p, 8, {
      "fill": "none",
      "stroke": colorPalette[1],
      "stroke-width": "2px",
    })

    graph.annotatePoint(`P(${p.x}, ${p.y})`, p, colorPalette[1])
  }

  componentDidUpdate() {
    if(this.xRef.current) {
      this.xRef.current.focus();
    }
  }

  onNextButton() {
    const currentSubStep = this.state.currentSubStep;

    if(!this.state.showSimplifications) {
      this.setState({
        showSimplifications: true,
      });
      return;
    }

    if(currentSubStep > 4) {
      this.props.onStepComplete(this.props.tutorialState);
    } else {
      const p = this.p;

      if(currentSubStep == 0) {
        const x = this.xRef.current.value;
        const y = this.yRef.current.value;

        if(!(Math.abs(x - p.x) < 0.01) || !(Math.abs(y - p.y) < 0.01)) {
          this.setState({
            highlightContent: true
          })
          return;
        } else {
          this.setState({
            highlightContent: false
          })
        }
      } 

      this.setState({
        currentSubStep: currentSubStep + 1 
      })
    }
  }

  renderSimplificationForPoint(currentSubStep, highlightContent) {
      const contents = this.props.contents
      const [a, b, c] = contents.equation;
      const p = this.p;

      var e1 = null;
      var e2 = null;
      var e3 = null;
      var e4 = null;
      var e5 = null;
      var e6 = null;
      var finaleSubStepStyle = {
        color: colorPalette[9],
        fontWeight: 600,
        fontSize: "14px",
      } as React.CSSProperties;

      if (currentSubStep == 0) {
        e1 = <StepAction>
        L.H.S = {
          formatEquationLHS(
            [a, b, c],
            <span>(<NumberInput ref={this.xRef} placeholder="x" />)</span>,
            <span>(<NumberInput ref={this.yRef} placeholder="y" />)</span>
          )
        } </StepAction>
      }

      if (currentSubStep > 0) {
        e1 = <StepContent> <Bold> L.H.S = {formatEquationLHS([a, b, c], <span>({p.x})</span>, <span>({p.y})</span>)} </Bold> </StepContent>
        e2 = <StepContent> <Bold> = {formatAddition([a*p.x, b*p.y, c])} </Bold> </StepContent>
      }

      if (currentSubStep > 1) {
        e3 = <StepContent> <Bold> = {formatAddition([a*p.x + b*p.y, c])} </Bold> </StepContent>
      }

      if (currentSubStep > 2) {
        e4 = <div style={finaleSubStepStyle}> = {a*p.x + b*p.y + c} ≠ R.H.S </div>
      }

      if(currentSubStep > 3) {
        e5 = <Block>
          <StepContent> {this.text3} </StepContent>
        </Block>
      }

      if(currentSubStep > 4) {
        e6 = <Block>
          <StepContent> {this.text4} </StepContent>
        </Block> 
      }

      return <div>
        <Block>
          <StepContent highlight={highlightContent}>{this.text2}</StepContent>
        </Block>
        <Block>
          {e1}
          {e2}
          {e3}
          {e4}
          {e5}
          {e6}
        </Block>
      </div>
  }

  render() {
    const contents = this.props.contents;
    const text1 = this.text1(this.p);

    var text2Element = null;

    var simplificationElement = null;

    if(this.state.showSimplifications) {
      const {currentSubStep, highlightContent} = this.state;

      simplificationElement = this.renderSimplificationForPoint(currentSubStep, highlightContent)
    }

    return (
      <TutorialContainer>
        <StepContent>{text1}</StepContent>
        {simplificationElement}

        <EnterButton onClick={this.onNextButton.bind(this)}/>
      </TutorialContainer>
    )
  }
}

