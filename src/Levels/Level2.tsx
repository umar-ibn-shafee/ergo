import * as React from "react"

import Graph from '../Graph'

import { LevelDefinition, generateRandomAxesDef } from './Common'

import { NumberInput }from '../Input'

import {
  Point,
  colorPalette,
  getRandomInt,
  getRandomSample
} from '../Common'

const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
};

const axesDefs = {
  3: [5, 10, 20],
  5: [0.2, 1, 5, 10, 20],
  4: [0.25, 2.5, 5, 10, 25],
};

export default class Level2Definition implements LevelDefinition<Point> {
  xRef: React.RefObject<NumberInput>;
  yRef: React.RefObject<NumberInput>;

  wrongPoint: any;
  currentPoint: any;
  wrongAnnotation: any;

  heading = "Game Level 02";
  subHeading = "Identify Coordinates";

  constructor() {
    this.xRef = React.createRef();
    this.yRef = React.createRef();

    this.wrongPoint = null;
    this.wrongAnnotation = null;
    this.currentPoint = null;
  }

  generateQuestionText(question) {
    return `Enter the values of \u0394X and \u0394Y for the given pair of points.`;
  }

  renderAnswerField(question) {
    return (
      <div>
        <p style={{color: colorPalette[10], fontWeight: 600}}>{
        '\u0394X = '
        }
        <span style={{color: colorPalette[10], fontWeight: 600}}>  
          (<NumberInput ref={this.xRef} />) 
        </span>
        {
        '\u0394Y = '
        }
        <span style={{color: colorPalette[10], fontWeight: 600}}>  
          (<NumberInput ref={this.yRef} />)
        </span>
        </p>
      </div>
    );
  }

  helpText(questionLevel: number) {
    switch(questionLevel) {
      case 0:
        return "";

      case 1:
        return "";

      case 2:
        return "Note the shift in Origin.";

      case 3:
        return "Read the graph carefully. The markings along each axis have changed.";

      case 4:
        return "Read the graph carefully. The divisions along each axis have changed.";
    }
  }

  firstClue(question, questionLevel) {
    return "Wrong! Note the readings on the graph.";
  }

  secondClue(question, questionLevel) {
    return "Last Attempt. Let the arrows on the axes guide you to identify the point. Try again.";
  }

  prepareGraphForQuestion(questionLevel, graph) {
    if(questionLevel < 2) {
      graph.reset(simpleAxesDef);
    } else if(questionLevel == 2) {
      const axesDef = generateRandomAxesDef(1, 5);

      graph.reset(axesDef);
    } else if(questionLevel == 3) {
      const subTickSize = getRandomSample(axesDefs[5]);
      const axesDef = generateRandomAxesDef(subTickSize, 5);

      graph.reset(axesDef);
    } else if(questionLevel >= 4) {
      const numSubticksPerTick = getRandomSample([3, 4])
      const subTickSize = getRandomSample(axesDefs[numSubticksPerTick])

      const axesDef = generateRandomAxesDef(subTickSize, numSubticksPerTick);

      graph.reset(axesDef);
    }
  }

  generateQuestion(questionLevel, graph) {
    const xTicks = graph.xTicks();
    const xRange = xTicks.slice(2, xTicks.length - 2);

    const yTicks = graph.yTicks();
    const yRange = yTicks.slice(2, yTicks.length - 2);

    const x1 = getRandomSample(xRange);
    const y1 = getRandomSample(yRange);

    const q = {
      x: x1,
      y: y1,
    }

    if(this.currentPoint) {
      graph.removePoint(this.currentPoint);
    }

    this.currentPoint = graph.addPoint({x: x1, y: y1}, 5, {
      fill: colorPalette[1],
    })

    return q;
  }

  onGraphClicked(point, graph) {
  }

  validateAnswer(question, graph) {
    const a = {x: this.xRef.current.value, y: this.yRef.current.value};
    const q = question;

    return Math.abs(a.x - q.x) < 0.0001 && Math.abs(a.y - q.y) < 0.0001;
  }

  showHint1(question, graph) {
    graph.showSubtickValues()
  }

  showHint2(question, graph){
    const q = question;

    graph.drawLineSegment({x: 0, y: 0}, {x: q.x, y: 0}, null, {
      stroke: colorPalette[10],
      'stroke-width': '4px',
    })

    graph.drawLineSegment({x: 0, y: 0}, {x: 0, y: q.y}, null, {
      stroke: colorPalette[11],
      'stroke-width': '4px',
    })
  }

  onLevelFailed(question, graph){
  }

  onAnswer(isCorrect, graph) {
    const x = this.xRef.current.value;
    const y = this.yRef.current.value;

    this.xRef.current.clear();
    this.yRef.current.clear();

    if(this.xRef.current) {
      this.xRef.current.focus();
    }

    if(this.wrongPoint) {
      graph.removePoint(this.wrongPoint);
      graph.removeAnnotation(this.wrongAnnotation);
    }

    if(!isCorrect) {
      this.wrongPoint = graph.addPoint({x, y}, 5, {
        "fill": colorPalette[9],
      })

      console.log(typeof x, typeof y)
      this.wrongAnnotation = graph.annotatePoint(`(${x}, ${y})`, {x, y}, colorPalette[9])
    }
  }

  shouldEnableConfirmButton() {
    return this.xRef.current && this.xRef.current.text != "" && this.yRef.current.text != ""
  }
}
