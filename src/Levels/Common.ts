import * as React from "react";

import Graph from '../Graph';

import { Point, getRandomInt } from '../Common';

export interface LevelDefinition<QuestionType> {
  heading: string;
  subHeading: string;

  generateQuestionText(question: QuestionType): string;
  renderAnswerField(question): JSX.Element;

  helpText(questionLevel: number): string;
  firstClue(questionLevel, question): string;
  secondClue(questionLevel, question): string; 

  prepareGraphForQuestion(questionLevel: number, graph: Graph);

  generateQuestion(questionLevel: number, graph: Graph): QuestionType;

  onGraphClicked(point: Point, graph: Graph);

  validateAnswer(question: QuestionType, graph: Graph): boolean;

  showHint1(question: QuestionType, graph: Graph);

  showHint2(question: QuestionType, graph: Graph);

  onLevelFailed(question: QuestionType, graph: Graph);

  onAnswer(isCorrect: boolean, graph: Graph);

  shouldEnableConfirmButton(): boolean;
}


export function generateRandomAxesDef(subTickSize, numSubticksPerTick) {
  const tickSize = subTickSize*numSubticksPerTick;
  const xlHigh = -1.6*tickSize;
  const xlLow = -8.6*tickSize;

  const ylLow = -1.6*tickSize;
  const ylHigh = -5.6*tickSize;

  const xLength = 9.2*tickSize
  const yLength = 7.2*tickSize

  const xl = getRandomInt(xlLow, xlHigh);
  const yl = getRandomInt(xlHigh, ylHigh);

  const xh = xl + xLength;
  const yh = yl + yLength;

  return {
    xl: xl,
    xh: xh,
    yl: yl,
    yh: yh,
    subTickSize: subTickSize,
    numSubticksPerTick: numSubticksPerTick
  }
}
