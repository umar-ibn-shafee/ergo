import * as React from "react"
import { SidebarDivider, colorPalette } from '../Common';
import Divider from '@material-ui/core/Divider';

import Graph from '../Graph'

import {
  StepContent,
  StepAction,
  Block,
  BlankSpace,
  TutorialContents,
  TutorialStepProps,
  TutorialContainer,
} from './Common';

class Tutorial1Step1 extends React.Component<TutorialStepProps, {highlightContent: boolean}> {
  text = "Origin is the point where the x-axis and the y-axis intersect.";
  action =  "Click on the Origin.";

  constructor(props) {
    super(props)

    this.state = {highlightContent: false}
  }

  componentDidMount() {
    const graph = this.props.graph;

    graph.reset();

    graph.setXAxisColor(colorPalette[10]);
    graph.setYAxisColor(colorPalette[11]);

    var point = null;

    graph.setOnClickHandler((x1, y1) => {
      const {x, y} = graph.snapToGrid({x: x1, y: y1});

      if(x == 0 && y == 0) {
        this.props.notifyResult(true)

        if(point) {
          graph.removePoint(point)
          point = null;
        }

        this.setState({highlightContent: false})

        this.props.onStepComplete({});
      } else {
        this.props.notifyResult(false)

        if(!point) {
          point = graph.addPoint({x: 0, y: 0}, 10, {
            "fill": colorPalette[12],
            "opacity": 0.5
          })

          graph.blinkPoint(point, 500)
          this.setState({highlightContent: true})
        }
      }
    })
  }

  render() {
    const contents = this.props.contents;

    return (
      <TutorialContainer>
        <StepContent highlight={this.state.highlightContent}>{this.text}</StepContent>
        <Block>
          <StepAction>{this.action}</StepAction>
        </Block>
      </TutorialContainer>
    )
  }
}

class Tutorial1Step2 extends React.Component<TutorialStepProps, {completedUpto: number, highlightContent: boolean}> {
  hintLine: any;

  text = "The part of the x-axis with positive values is the positive x-axis. Similarly, the part of x-axis with negative values is the negative x-axis.";
  actions = [
    "Click on the positive x-axis.",
    "Click on the negative y-axis.",
  ];

  constructor(props) {
    super(props)
    this.state = {completedUpto: 0, highlightContent: false}
    this.hintLine = null
  }

  componentDidMount() {
    const graph = this.props.graph;

    graph.reset()

    graph.setXAxisColor(colorPalette[10])
    graph.setYAxisColor(colorPalette[11])

    graph.setOnClickHandler((x1, y1) => {
      const {x, y} = graph.snapToGrid({x: x1, y: y1});

      if(this.state.completedUpto == 0) {
        this.validateAction1(x, y)
      } else if(this.state.completedUpto == 1) {
        this.validateAction2(x, y)
      }
    })
  }

  validateAction1(x: number, y: number) {
    const graph = this.props.graph;

    if(y == 0 && x > 0) {
      this.props.notifyResult(true)

      if(this.hintLine) {
        graph.removeLine(this.hintLine);
        this.hintLine = null;
      }

      this.setState({completedUpto: 1, highlightContent: false})
    } else {
      this.props.notifyResult(false)

      if(!this.hintLine) {
        const start = {x: 0, y: 0};
        const end = {x: 28, y: 0};

        this.hintLine = graph.drawLineSegment(start, end, null, {
          stroke: colorPalette[10],
          'stroke-width': '10px',
          opacity: 0.5
        })

        graph.blinkLine(this.hintLine, 500)
        this.setState({highlightContent: true})
      }
    }
  }

  validateAction2(x: number, y: number) {
    const graph = this.props.graph;

    if(x == 0 && y < 0) {
      this.props.notifyResult(true)

      if(this.hintLine) {
        graph.removeLine(this.hintLine);
        this.hintLine = null;
      }

      this.setState({completedUpto: 2, highlightContent: false})
      this.props.onStepComplete({});
    } else {
      this.props.notifyResult(false)

      if(!this.hintLine) {
        const start = {x: 0, y: 0}
        const end = {x: 0, y: -23}

        this.hintLine = graph.drawLineSegment(start, end, null, {
          stroke: colorPalette[11],
          'stroke-width': '10px',
          opacity: 0.5
        })

        graph.blinkLine(this.hintLine, 500)
        this.setState({highlightContent: true})
      }
    }
  }

  render() {
    const contents = this.props.contents;
    const completedUpto = this.state.completedUpto

    return (
      <TutorialContainer>
        <StepContent highlight={this.state.highlightContent}>{this.text}</StepContent>
        
        <Block>
          <StepAction>
            {
              this.actions.map((action, index) => {
                var actionElement = <span>{action}</span>;

                if(completedUpto > index) {
                  actionElement = <span style={{textDecoration: "line-through"}}>{action}</span>
                } else if (completedUpto < index) {
                  actionElement = <BlankSpace />
                }

                return <div key={`action-${index}`}>{`${index + 1}.`} {actionElement}</div>
              })
            }
          </StepAction>
        </Block>
      </TutorialContainer>
    )
  }
}

class Tutorial1Step3 extends React.Component<TutorialStepProps, {completedUpto: number, highlightContent: boolean}> {
  hintPointX: any;
  hintPointY: any;
  hintPointXY: any;

  text1 = "A Point is uniquely defined by its x-coordinate and y-coordinate value written in the form (x,y).";
  text2 = "For example,";
  text3 = "The point of intersection of the dashed lines has an x- coordinate value of -10 and y-coordinate value of 7.";
  actions = [
    "Click on -10 on x-axis.",
    "Click on 7 on y-axis.",
    "Click on the point (-10,7).",
  ];

  constructor(props) {
    super(props)
    this.state = {
      completedUpto: 0,
      highlightContent: false
    }
    this.hintPointX = null
    this.hintPointY = null
    this.hintPointXY = null
  }

  componentDidMount() {
    const graph = this.props.graph;

    graph.reset()

    graph.setXAxisColor('grey')
    graph.setYAxisColor('grey')

    graph.setOnClickHandler((x1, y1) => {
      const {x, y} = graph.snapToGrid({x: x1, y: y1});

      if(this.state.completedUpto == 0) {
        this.validateAction1(x, y)
      } else if(this.state.completedUpto == 1) {
        this.validateAction2(x, y)
      } else if(this.state.completedUpto == 2) {
        this.validateAction3(x, y)
      }
    })
  }

  validateAction1(x: number, y: number) {
    const graph = this.props.graph;

    if(y == 0 && x == -10) {
      this.props.notifyResult(true)

      if(this.hintPointX) {
        graph.removePoint(this.hintPointX);
        this.hintPointX = null;
      }

      this.setState({completedUpto: 1, highlightContent: false})

      graph.drawLineSegment({x: 0, y: 0}, {x: -10, y: 0}, null, {
        stroke: colorPalette[10],
        'stroke-width': '2px',
      })

      const line = graph.drawLineSegment({x: -10, y: -23}, {x: -10, y: 23}, null, {
        stroke: colorPalette[10],
        'stroke-dasharray': '4,4'
      })

      line.style({'stroke-dasharray': '4,4'})
    } else {
      this.props.notifyResult(false)

      if(!this.hintPointX) {
        this.hintPointX = graph.addPoint({x: -10, y: 0}, 10, {
          "fill": colorPalette[12],
          "opacity": 0.5
        })

        graph.blinkPoint(this.hintPointX, 500)
        this.setState({highlightContent: true})
      }
    }
  }

  validateAction2(x: number, y: number) {
    const graph = this.props.graph;

    if(y == 7 && x == 0) {
      this.props.notifyResult(true)

      if(this.hintPointY) {
        graph.removePoint(this.hintPointY);
        this.hintPointY = null;
      }

      this.setState({completedUpto: 2, highlightContent: false})

      graph.drawLineSegment({x: 0, y: 0}, {x: 0, y: 7}, null, {
        stroke: colorPalette[11],
        'stroke-width': '2px',
      })

      const line = graph.drawLineSegment({x: -28, y: 7}, {x: 28, y: 7}, null, {
        stroke: colorPalette[11],
        'stroke-dasharray': '4,4'
      })

    } else {
      this.props.notifyResult(false)

      if(!this.hintPointY) {
        this.hintPointY = graph.addPoint({x: 0, y: 7}, 10, {
          "fill": colorPalette[12],
          "opacity": 0.5
        })

        graph.blinkPoint(this.hintPointY, 500)
        this.setState({highlightContent: true})
      }
    }
  }

  validateAction3(x: number, y: number) {
    const graph = this.props.graph;

    if(y == 7 && x == -10) {
      this.props.notifyResult(true)

      if(this.hintPointXY) {
        graph.removePoint(this.hintPointXY);
        this.hintPointXY = null;
      }

      this.setState({completedUpto: 3, highlightContent: false})

      this.props.onStepComplete({});
    } else {
      this.props.notifyResult(false)

      if(!this.hintPointXY) {
        this.hintPointXY = graph.addPoint({x: -10, y: 7}, 10, {
          "fill": colorPalette[12],
          "opacity": 0.5
        })

        graph.blinkPoint(this.hintPointXY, 500)
        this.setState({highlightContent: true})
      }
    }
  }

  render() {
    const contents = this.props.contents;

    const completedUpto = this.state.completedUpto
    var highlightMainContent = false;
    var highlightSecondaryContent = false;

    if(this.state.highlightContent) {
      if(completedUpto < 2) {
        highlightMainContent = true;
      } else {
        highlightSecondaryContent = true;
      }
    }

    return (
      <TutorialContainer>
        <StepContent highlight={highlightMainContent}>{this.text1}</StepContent>

        <SidebarDivider />

        <StepContent>{this.text2}</StepContent>
        
        <Block>
          <StepAction>
            {
              this.actions.map((action, index) => {
                var actionElement = <span>{action}</span>;

                if(completedUpto > index) {
                  actionElement = <span style={{textDecoration: "line-through"}}>{action}</span>
                } else if (completedUpto < index) {
                  actionElement = <BlankSpace />
                }

                if(index == 2) {
                  return <div key={`action-${index}`}>
                    {
                      completedUpto > 1 ?
                        <StepContent highlight={highlightSecondaryContent}>{this.text3}</StepContent>
                      :
                        <Divider style={{paddingTop: '30px', paddingBottom: '30px', backgroundColor: "white"}} />
                    }
                    <div>{`${index + 1}.`} {actionElement}</div>
                  </div>
                } else {
                  return <div key={`action-${index}`}>{`${index + 1}.`} {actionElement}</div>
                }
              })
            }
          </StepAction>
        </Block>
      </TutorialContainer>
    )
  }
}

export default class Tutorial1Contents implements TutorialContents {
  heading =  "Tutorial 01";
  subHeading = "Basic Graph Terminology";
  steps = [
    {
      card: Tutorial1Step1,
      contents: {
        title: "Origin",
      },
    },
    {
      contents: {
        title: "Axes Orientation",
      },
      card: Tutorial1Step2,
    },
    {
      contents: {
        title: "Coordinates of a Point",
      },
      card: Tutorial1Step3,
    }
  ];
}

