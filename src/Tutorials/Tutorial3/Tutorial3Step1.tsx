import * as React from "react"

import { SidebarDivider, colorPalette } from '../../Common';

import {
  StepContent,
  StepAction,
  Bold,
  Block,
  Highlight,
  TutorialStepProps,
  TutorialContainer,
  EnterButton,
  formatEquation,
  lineAttr,
} from '../Common';

interface Tutorial3Step1State {
  showText2: boolean
  showText3: boolean
}

export default class Tutorial3Step1 extends React.Component<TutorialStepProps, Tutorial3Step1State> {
  points: Array<{x: number, y: number}>;

  text1 =  "A line is made up of infinite number of points";

  text2 =  <span>
    Any equation that is satisfied by the coordinates of every point on the line is called the 
    <Highlight>equation of the line</Highlight>
  </span>;

  text3 = (equation) => {
    const formattedEquation = formatEquation(equation, "x", "y");
    return <span>For example, the equation of the shown line is <Bold>L: {formattedEquation}</Bold></span>
  }

  actionText = "Click on any four points shown on the line";

  constructor(props) {
    super(props)

    this.state = {
      showText2: false,
      showText3: false
    }

    this.points = [];
  }

  projection(point, line) {
    const {x, y} = point;
    const [a, b, c] = line;

    const m1 = -a/b
    const c1 = -c/b
    const m2 = b/a;
    const c2 = y - m2*x

    const rx = -1 * (c2 - c1)/(m2 - m1);
    const ry = m1*rx + c1;

    return {x: rx, y: ry};
  }

  componentDidMount() {
    const graph = this.props.graph;
    const [a, b, c] = this.props.contents.equation;
    graph.reset({
      xl: -280,
      xh: 280,
      yl: -230,
      yh: 230,
      subTickSize: 10,
      numSubticksPerTick: 5,
    });

    this.points = [];
    var points = this.points;
    
    graph.setOnClickHandler((x, y) => {
      const d = Math.abs(a*x + b*y + c)/Math.sqrt(a*a + b*b);

      if(Math.abs(d) < graph.axesDef.subTickSize/2) {
        const p = this.projection({x, y}, [a, b, c]);

        const x1 = Math.round(p.x);
        const y1 = (-a*x1 - c)/b;

        const q = {x: x1, y: y1};

        const point = graph.addPoint(q, 5, {
          "fill": colorPalette[1],
        })

        const i = points.length;
        graph.annotatePoint(`P${i + 1}(${q.x}, ${q.y})`, q, colorPalette[1])

        points.push(q);

        if(points.length == 4) {
          graph.setOnClickHandler(null);
          this.setState({showText2: true})
        }
      } else {
        graph.addPoint({x, y}, 5, {
          "fill": colorPalette[9],
        })
      }
    })

    graph.drawLine([a, b, c], null, lineAttr)
  }

  onNextButton() {
    if(!this.state.showText3) {
      this.setState({showText3: true})
    } else {
      this.props.graph.setOnClickHandler(null);
      this.props.onStepComplete({points: this.points})
    }
  }

  render() {
    const contents = this.props.contents;
    var enterButton = <div></div>;
    var text2Element = <div></div>;
    var text3Element = <div></div>;

    if(this.state.showText2) {
      text2Element = <div>
         <SidebarDivider />
         <StepContent>{this.text2}</StepContent>
       </div>

      enterButton = <EnterButton onClick={this.onNextButton.bind(this)}/>
    }

    if(this.state.showText3) {
      text3Element = <div>
         <SidebarDivider />
         <StepContent>{this.text3(contents.equation)}</StepContent>
       </div>
    }

    return (
      <TutorialContainer>
        <StepContent>{this.text1}</StepContent>
        <Block>
          <StepAction greyOut={this.state.showText2}>{this.actionText}</StepAction>
        </Block>

        {text2Element}
        {text3Element}
        {enterButton}
      </TutorialContainer>
    )
  }
}

