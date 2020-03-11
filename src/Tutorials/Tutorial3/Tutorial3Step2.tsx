import * as React from "react"

import { SidebarDivider } from '../../Common';

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
  formatEquation,
  formatAddition,
  formatEquationLHS,
  lineAttr,
} from '../Common';

interface Tutorial3Step2State {
  currentSubStep: number;
  showSimplifications: boolean;
  highlightContent: boolean;
  currentPointIndex: number;
}

export default class Tutorial3Step2 extends React.Component<TutorialStepProps, Tutorial3Step2State> {
  xRef: React.RefObject<NumberInput>;
  yRef: React.RefObject<NumberInput>;
  simplificationRefs: Array<React.RefObject<HTMLDivElement>>;
  pointHighlight: any;

  text1 =  (p) => <span>
    Consider the point <Bold>P1({p.x}, {p.y})</Bold> on the line and verify if it satisfies the line equation,
  </span>;

  text2 = "To verify, substitute x and y in the left hand side (L.H.S) of the equation with the x-coordinate and y-coordinate of P1";

  text3 = (p, equation) => {
    const formattedEquation = formatEquation(equation, "x", "y");

    return <span>
      As L.H.S = R.H.S, the point <Bold>P1({p.x}, {p.y})</Bold> statisfies the line equation <Bold>{formattedEquation}</Bold>
    </span>;
  }

  text4 = (p, i) => <span>
    Similarly, <Bold>P{i + 1}({p.x}, {p.y})</Bold> satisfies the line equation:
  </span>;


  constructor(props) {
    super(props)
    
    this.state = {
      currentSubStep: 0,
      showSimplifications: false,
      highlightContent: false,
      currentPointIndex: 0,
    }

    this.xRef = React.createRef()
    this.yRef = React.createRef()
    
    this.simplificationRefs = [1, 2, 3, 4].map(() => React.createRef())
    this.pointHighlight = null;
  }

  componentDidMount() {
    const graph = this.props.graph;
    const [a, b, c] = this.props.contents.equation;

    graph.reset();

    graph.drawLine([a, b, c], null, lineAttr)

    var points = this.props.tutorialState.points;

    points.forEach((p, i) => {
      graph.addPoint(p, 5, {
        "fill": colorPalette[1],
      })

      graph.annotatePoint(`P${i + 1}(${p.x}, ${p.y})`, p, colorPalette[1])
    })

    this.highlightPoint(points[0])
  }

  componentDidUpdate() {
    if(this.xRef.current) {
      this.xRef.current.focus();
    }

    const ref = this.simplificationRefs[this.state.currentPointIndex]

    if(ref.current) {
      ref.current.scrollIntoView()
    }
  }

  highlightPoint(point) {
    const graph = this.props.graph;

    if(this.pointHighlight) {
      graph.removePoint(this.pointHighlight)
    }

    this.pointHighlight = graph.addPoint(point, 8, {
      "fill": "none",
      "stroke": colorPalette[1],
      "stroke-width": "2px",
    })
  }

  onNextButton() {
    const currentSubStep = this.state.currentSubStep;
    const points = this.props.tutorialState.points;
    const currentPointIndex = this.state.currentPointIndex;

    if(!this.state.showSimplifications) {
      this.setState({
        showSimplifications: true,
      });
      return;
    }

    if(currentSubStep > 2) {
      const newIndex = currentPointIndex + 1;

      if(newIndex == points.length) {
        this.props.onStepComplete(this.props.tutorialState);
      } else {
        this.highlightPoint(points[newIndex])

        this.setState({
          currentSubStep: newIndex > 1 ? 3 : 0,
          currentPointIndex: newIndex,
        })
      }

      return;
    } else {
      const p = points[currentPointIndex];

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

  renderSimplificationForPoint(p, index, text, currentSubStep, highlightContent) {
      const contents = this.props.contents;
      const [a, b, c] = contents.equation;

      var e1 = null;
      var e2 = null;
      var e3 = null;
      var e4 = null;
      var finaleSubStepStyle = {color: colorPalette[8], fontWeight: "bold"} as React.CSSProperties;

      if (currentSubStep == 0) {
        e1 = <StepAction>
          L.H.S = {
            formatEquationLHS([a, b, c],
            <span>(<NumberInput ref={this.xRef} placeholder="x" />)</span>,
            <span>(<NumberInput ref={this.yRef} placeholder="y" />)</span>)
          }
          </StepAction>
      }

      if (currentSubStep > 0) {
        e1 = <StepContent> <Bold> L.H.S = {formatEquationLHS([a, b, c], <span>({p.x})</span>, <span>({p.y})</span>)} </Bold> </StepContent>
        e2 = <StepContent> <Bold> = {formatAddition([a*p.x, b*p.y, c])} </Bold> </StepContent>
      }

      if (currentSubStep > 1) {
        e3 = <StepContent> <Bold> = {formatAddition([a*p.x + b*p.y, c])} </Bold> </StepContent>
      }

      if (currentSubStep > 2) {
        if(index == 0) {
          const text3 = this.text3(p, contents.equation);

          e4 = <StepContent>
            <div style={finaleSubStepStyle}> = {a*p.x + b*p.y + c}  = R.H.S</div>

            <Block>{text3}</Block>
          </StepContent>
        } else {
          e4 = <div style={finaleSubStepStyle}> = {a*p.x + b*p.y + c} = R.H.S </div>
        }
      }

      const ref = this.simplificationRefs[index];

      var textElement = null;

      if(index < 2 && currentSubStep == 0) {
        textElement = <StepAction highlight={highlightContent}> {text} </StepAction>
      } else if (index > 1) {
        textElement = <StepContent>{text}</StepContent>
      } else {
        textElement = <StepAction greyOut={currentSubStep > 0}>{text}</StepAction>
      }

      return <div key={`simplification-${index}`} ref={ref}>
        <Block>{textElement}</Block>
        <Block>
          {e1}
          {e2}
          {e3}
          {e4}
        </Block>
      </div>
  }

  render() {
    const p1 = this.props.tutorialState.points[0];

    const contents = this.props.contents;
    const text1 = this.text1(p1);
    const currentPointIndex = this.state.currentPointIndex;
    const points = this.props.tutorialState.points;

    var text2Element = null;

    const simplificationElements = []

    if(this.state.showSimplifications) {
      points.forEach((p, i) => {
        if(i > currentPointIndex) {
          return;
        }

        var text = i == 0 ? this.text2 : this.text4(p, i);

        const highlightContent = this.state.highlightContent;

        var subStep = currentPointIndex == i ? this.state.currentSubStep : 3;

        if(i > 0) {
          simplificationElements.push(<SidebarDivider key={`divider-${i}`} />)
        }

        simplificationElements.push(this.renderSimplificationForPoint(p, i, text, subStep, highlightContent))
      })
    }

    return (
      <TutorialContainer>
        <StepContent>{text1}</StepContent>
        {simplificationElements}

        <EnterButton onClick={this.onNextButton.bind(this)}/>
      </TutorialContainer>
    )
  }
}

