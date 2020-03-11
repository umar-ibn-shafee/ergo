import * as React from "react"

import Graph from '../Graph'

import { LevelDefinition, generateRandomAxesDef } from './Common'

import {
  Point,
  getRandomInt,
  getRandomSample,
  colorPalette
} from '../Common'


const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
}

const axesDefs = {
  3: [5, 10, 20],
  5: [0.2, 1, 5, 10, 20],
  4: [0.25, 2.5, 5, 10, 25],
}

export default class Level1Definition implements LevelDefinition<Point> {
  answer: Point;
  point: any;

  heading = "Game Level 01";
  subHeading = "Locate Point on Graph";

  constructor() {
    this.answer = null;
    this.point = null;
  }

  generateQuestionText(question) {
    return `Locate the point (${question.x}, ${question.y})`;
  }

  renderAnswerField(question) {
    return null;
  }

  helpText(questionLevel: number) {
    switch(questionLevel) {
      case 0:
        return "Click to select the point on the graph.";

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

    const q = {
      x: getRandomSample(xRange),
      y: getRandomSample(yRange),
    }

    return q;
  }

  onGraphClicked(point, graph) {
    const p1 = graph.snapToGrid(point);
    const x1 = p1.x;
    const y1 = p1.y

    if(this.point) {
      graph.removePoint(this.point)
    }

    this.point = graph.addPoint({x: x1, y: y1}, 5, {
      fill: colorPalette[1],
    })

    this.answer = p1;
  }

  validateAnswer(question, graph) {
    const a = this.answer;
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
    const q = question;

    graph.addPoint({x: q.x, y: q.y}, 5, {
      fill: colorPalette[8],
    })

    graph.annotatePoint(`(${q.x}, ${q.y})`, {x: q.x, y: q.y}, colorPalette[8])
  }

  onAnswer(isCorrect, graph) {
  }

  shouldEnableConfirmButton() {
    return !!this.answer;
  }
};
