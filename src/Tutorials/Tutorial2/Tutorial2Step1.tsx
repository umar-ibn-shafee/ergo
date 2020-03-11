import * as React from "react"

import { SidebarDivider } from '../../Common';

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
} from '../Common';

function SubStep1(props) {
  return <div>
    <StepContent>Consider the point <Bold>P(x,y)</Bold>.</StepContent>

    <SidebarDivider />
    <StepContent>To identify the x-coordinate of the shown point P, we draw a vertical line through it.</StepContent>

    <Block>
      <StepAction>Click on the intersection of this vertical line and the x-axis.</StepAction>
    </Block>
  </div>
}

function SubStep2(props) {
  return <div>
    <SidebarDivider />
    <StepContent>This gives the x-coordinate of the point P as 7.</StepContent>
  </div>
}

interface Tutorial2Step1State {
  subStep: number 
}

export default class Tutorial3Step1 extends React.Component<TutorialStepProps, Tutorial2Step1State> {
  annotation: any;

  constructor(props) {
    super(props)

    this.state = {
      subStep: 0
    }
  }
  componentDidMount() {
    const graph = this.props.graph;
    const p = {x: 7, y: 9};

    graph.reset();

    graph.drawVerticalLine(p.x, null, {
      stroke: colorPalette[10],
      'stroke-dasharray': '4,4'
    })

    const point = graph.addPoint(p, 5, {
      "fill": colorPalette[1],
    })

    this.annotation = graph.annotatePoint(`P(x, y)`, p, colorPalette[1])

    var hintPoint = null;

    graph.setOnClickHandler((x1, y1) => {
      const {x, y} = graph.snapToGrid({x: x1, y: y1});

      if(x == p.x && y == 0) {
        this.props.notifyResult(true)

        if(hintPoint) {
          graph.removePoint(hintPoint);
          hintPoint = null;
        }

        graph.drawLineSegment({x: 0, y: 0}, {x: p.x, y: 0}, null, {
          stroke: colorPalette[10],
          'stroke-width': '2px',
        })

        graph.removeAnnotation(this.annotation)
        this.annotation = graph.annotatePoint(`P(${p.x}, y)`, p, colorPalette[1])

        graph.setOnClickHandler(null);
        this.setState({subStep: 1})
      } else {
        this.props.notifyResult(false)

        hintPoint = graph.addPoint({x: p.x, y: 0}, 10, {
          "fill": colorPalette[12],
          "opacity": 0.5
        })

        graph.blinkPoint(hintPoint, 500)
      }
    })
  }

  onNextButton() {
    this.props.onStepComplete({annotation: this.annotation})
  }

  shouldShowEnterButton(subStep) {
    return subStep == 1
  }

  render() {
    const subStep = this.state.subStep;
    var enterButton = null;

    const subSteps = [SubStep1, SubStep2].filter((s, i) => i <= subStep)

    const subStepElements = subSteps.map((SubStep, i) => <SubStep key={i}/>)
    
    if (this.shouldShowEnterButton(subStep)) {
      enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />;
    }

    return (
      <TutorialContainer>
        {subStepElements}

        {enterButton}
      </TutorialContainer>
    )
  }
}

