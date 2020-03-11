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


interface TwoPoint {
    x1: number;
    y1: number;
    x2: number;
    y2: number;  
  }
  

const axesDefs = {
  3: [5, 10, 20],
  5: [0.2, 1, 5, 10, 20],
  4: [0.25, 2.5, 5, 10, 25],
};

export default class Level4Definition implements LevelDefinition<TwoPoint> {
  delxRef: React.RefObject<NumberInput>;
  delyRef: React.RefObject<NumberInput>;
  
  wrongPoint: any;
  currentPoint1: any;
  currentPoint2: any;
  PointAnnotation1: any;
  PointAnnotation2: any;

  heading = "Game Level 04";
  subHeading = "\u0394X and \u0394Y";

  constructor() {
    this.delxRef = React.createRef();
    this.delyRef = React.createRef();
    
    this.wrongPoint = null;
    this.PointAnnotation1 = null;
    this.PointAnnotation2 = null;
    this.currentPoint1 = null;
    this.currentPoint2 = null;
  }

  generateQuestionText(question) {
    return `Enter the values of \u0394X and \u0394Y for the given pair of points.`;
  }

  renderAnswerField(question) {
    return (
      <div>
        <p style={{color: colorPalette[10], fontWeight: 600, margin: 10}}>{
        '\u0394X = '
        }
        <span style={{color: colorPalette[10], fontWeight: 600}}>  
          (<NumberInput ref={this.delxRef} />) 
        </span> <br/>
        {
        '\u0394Y = '
        }
        <span style={{color: colorPalette[10], fontWeight: 600}}>  
          (<NumberInput ref={this.delyRef} />)
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
        return "";

      case 3:
        return "Read the graph carefully. The markings along each axis have changed.";

      case 4:
        return "Read the graph carefully. The divisions along each axis have changed.";
    }
  }

  firstClue(question, questionLevel) {
    return "Wrong! Observe the arrows and the readings. Try again.";
  }

  secondClue(question, questionLevel) {
    return "Last Attempt. Note the point coordinates. Try again.";
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

  caseQuestion(questionLevel, graph) {
    const xTicks = graph.xTicks();
    const xRange = xTicks.slice(2, xTicks.length - 2);

    const yTicks = graph.yTicks();
    const yRange = yTicks.slice(2, yTicks.length - 2);

    const x1 = getRandomSample(xRange);
    const y1 = getRandomSample(yRange);
    const x2 = getRandomSample(xRange);
    const y2 = getRandomSample(yRange);
    
    switch(questionLevel) {
      case 0:
        return {
          x1: x1,
          y1: y1,
          x2: x1,
          y2: y2,
        }        
      case 1:
        return {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y1,
        }
      case 2:
        return {
          x1: 0,
          y1: y1,
          x2: x2,
          y2: 0,
        }
      default:
        return {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
        }
    }
  }

  generateQuestion(questionLevel: number, graph) {

    const q = this.caseQuestion(questionLevel, graph)

    if(this.currentPoint1) {
      graph.removePoint(this.currentPoint1);
    }

    this.currentPoint1 = graph.addPoint({x: q.x1, y: q.y1}, 5, {
      fill: colorPalette[1],
    }
    )

    if(this.currentPoint2) {
        graph.removePoint(this.currentPoint2);
      }
  
    this.currentPoint2 = graph.addPoint({x: q.x2, y: q.y2}, 5, {
        fill: colorPalette[1],
      }
    )
    return q;
  }

  onGraphClicked(point, graph) {
  }

  validateAnswer(question, graph) {
    const a = {x: this.delxRef.current.value, y: this.delyRef.current.value};
    const q = question;
    const delx = q.x1 - q.x2
    const dely = q.y1 - q.y2

    return (Math.abs(a.x - delx) < 0.0001 && Math.abs(a.y - dely) < 0.0001)||
           (Math.abs(a.x + delx) < 0.0001 && Math.abs(a.y + dely) < 0.0001);
  }

  showHint1(question, graph){
    const q = question;

    graph.showSubtickValues()

    graph.drawLineSegment({x: q.x1, y: q.y1}, {x: q.x2, y: q.y1}, null, {
      stroke: colorPalette[10],
      'stroke-width': '4px',
    })

    graph.drawLineSegment({x: q.x1, y: q.y1}, {x: q.x1, y: q.y2}, null, {
      stroke: colorPalette[11],
      'stroke-width': '4px',
    })
  }

  showHint2(question, graph) {
    const q = question

    const x1 = q.x1
    const y1 = q.y1
    const x2 = q.x2
    const y2 = q.y2


    this.PointAnnotation1 = graph.annotatePoint(`(${x1}, ${y1})`, {x: x1, y: y1}, colorPalette[9])
    this.PointAnnotation1 = graph.annotatePoint(`(${x2}, ${y2})`, {x: x2, y: y2}, colorPalette[9])

  }

  onLevelFailed(question, graph){
  }

  onAnswer(isCorrect, graph) {
    const x = this.delxRef.current.value;
    const y = this.delyRef.current.value;

    this.delxRef.current.clear();
    this.delyRef.current.clear();

    if(this.delxRef.current) {
      this.delxRef.current.focus();
    }

  }

  shouldEnableConfirmButton() {
    return this.delxRef.current && this.delxRef.current.text != "" && this.delyRef.current.text != ""
  }
}
