import * as React from "react";

import Graph from '../Graph';

import { LevelDefinition, generateRandomAxesDef } from './Common';

import { NumberInput }from '../Input';

import MathDisplay from '../MathDisplay';

import {equationToText} from '../Tutorials/Common';

import {
  Point,
  colorPalette,
  getRandomInt,
  getRandomSample,
} from '../Common'

export const lineAttr = {
  stroke: colorPalette[15],
  "stroke-width": "2"
}

const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
};

interface Level3Question {
  equation: Array<number>;
  }

const axesDefs = {
  3: [5, 10, 20],
  5: [0.2, 1, 5, 10, 20],
  4: [0.25, 2.5, 5, 10, 25],
};
  
export default class Level3Definition implements LevelDefinition<Level3Question> {
  heading = "Game Level 03";
  subHeading = "Points On A Line";

  lhsRef: React.RefObject<HTMLSelectElement>;
  rhsRef: React.RefObject<NumberInput>;

  axesDef: any;

  constructor() {
    this.lhsRef = React.createRef();
    this.rhsRef = React.createRef();
    
    const numSubticksPerTick = getRandomSample([3, 4])
    const subTickSize = getRandomSample(axesDefs[numSubticksPerTick])

    this.axesDef = generateRandomAxesDef(subTickSize, numSubticksPerTick);

  }

  generateQuestionText(question) {
    return `A vertical line L is shown here. 
    Enter the values in this equation to make it the equation of L.`
  }

  renderAnswerField(question) {
    return (
      <div>
        <select ref={this.lhsRef}>
          <option selected disabled hidden style={{display: 'none'}} value=''></option>
          <option value="x">x</option>
          <option value="y">y</option>
        </select>  = <NumberInput ref={this.rhsRef}/> 
      </div>
    );
  }

  helpText(questionLevel: number) {
    return "Refer to pages 4 and 5 in the tutorial.";
  }

  firstClue(question, questionLevel) {
    switch(questionLevel) {    
      default:
        return "Observe that the x-coordinate is same for every point on the line."
    }
  }

  secondClue(question, questionLevel) {
    return "The equation of a vertical line will be of the form x = constant.";
  }

  prepareGraphForQuestion(questionLevel, graph) {
    graph.reset(this.axesDef);
  }

  generateQuestion(questionLevel, graph) {
    const xTicks = graph.xTicks();
    const xRange = xTicks.slice(2, xTicks.length - 2);

    const x = getRandomSample(xRange);
    console.log(x);
    switch(questionLevel) {
      default:
        graph.drawLine([1, 0, x], null, lineAttr)
        return {equation: [1, 0, x]};
    }
  }

  onGraphClicked(rawPoint, graph) {
  
  }

  validateAnswer(question, graph) {
    console.log (this.lhsRef.current.value);
    return this.lhsRef.current.value == "x" && this.rhsRef.current.value == -question.equation[2]
  }

  showHint1(question, graph) {
    const yTicks = graph.yTicks();
    const yRange = yTicks.slice(2, yTicks.length - 2);

    const y1 = getRandomSample(yRange);
    const y2 = getRandomSample(yRange);
    
    const x = -question.equation[2]

    graph.addPoint({x: x, y: y1 }, 5, {
      fill: colorPalette[1],
    })
    graph.addPoint({x: x, y: y2}, 5, {
      fill: colorPalette[1],
    })  
    graph.annotatePoint(`(${x}, ${y1})`, {x: x, y: y1}, colorPalette[1])
    graph.annotatePoint(`(${x}, ${y2})`, {x: x, y: y2}, colorPalette[1])
  }


  showHint2(question, graph){
  }

  onLevelFailed(question, graph){
  }

  onAnswer(isCorrect, graph) {
    if (isCorrect) {
      this.lhsRef.current.value = '';
      this.rhsRef.current.clear()
    }
  }

  shouldEnableConfirmButton() {
    if (this.lhsRef.current){
      return this.lhsRef.current.value != '' && this.rhsRef.current.text != '';
    }
  }
}
