import { TutorialContents } from '../Common';

import { getRandomSample } from '../../Common';

import Tutorial3Step1 from './Tutorial3Step1';
import Tutorial3Step2 from './Tutorial3Step2';
import Tutorial3Step3 from './Tutorial3Step3';
import Tutorial3Step4 from './Tutorial3Step4';
import Tutorial3Step5 from './Tutorial3Step5';

const  equations = [
  {
    coefficients: [2, -1, -10*10],
    simplification1: "\\frac{2x}{-100} - \\frac{y}{-100} - \\frac{100}{-100} = 0",
    simplification2: "-\\frac{x}{50} + \\frac{y}{100} + 1 = 0",
    simplifiedXCoeff: "-\\frac{1}{50}",
    simplifiedYCoeff: "\\frac{1}{100}",
  },
  {
    coefficients: [5, -4, 20*10],
    simplification1: "\\frac{5x}{200} + \\frac{-4y}{200} + \\frac{200}{200} = 0",
    simplification2: "\\frac{x}{40} - \\frac{y}{50} + 1 = 0",
    simplifiedXCoeff: "\\frac{1}{40}",
    simplifiedYCoeff: "-\\frac{1}{50}",
  },
  {
    coefficients: [-5, -2, 20*10],
    simplification1: "\\frac{-5x}{200} - \\frac{2y}{200} + \\frac{200}{200} = 0",
    simplification2: "-\\frac{x}{40} - \\frac{y}{100} + 1 = 0",
    simplifiedXCoeff: "-\\frac{1}{40}",
    simplifiedYCoeff: "-\\frac{1}{100}",
  },
  {
    coefficients: [1, -2, 18*10],
    simplification1: "\\frac{x}{180} + \\frac{-2y}{180} + \\frac{180}{180} = 0",
    simplification2: "\\frac{x}{180} - \\frac{y}{90} + 1 = 0",
    simplifiedXCoeff: "\\frac{1}{180}",
    simplifiedYCoeff: "-\\frac{1}{90}",
  },
  {
    coefficients: [-2, -4, 8*20],
    simplification1: "\\frac{-2x}{160} + \\frac{-4y}{160} + \\frac{160}{160} = 0",
    simplification2: "-\\frac{x}{80} - \\frac{y}{40} + 1 = 0",
    simplifiedXCoeff: "-\\frac{1}{80}",
    simplifiedYCoeff: "-\\frac{1}{40}",
  },
  {
    coefficients: [-1, 4, -8*20],
    simplification1: "\\frac{-x}{-160} + \\frac{4y}{-160} + \\frac{-160}{-160} = 0",
    simplification2: "\\frac{x}{160} - \\frac{y}{40} + 1 = 0",
    simplifiedXCoeff: "\\frac{1}{160}",
    simplifiedYCoeff: "-\\frac{1}{40}",
  }
]

const step4Questions = [
  [
    {
      equation: [1/4, -2.25, -40],
      katex: "\\frac{x}{4} - 2.25y - 40 = 0",
    },
    {
      equation: [-2.5, -7.5, -300],
      katex: "-2.5x - 7.5y - 300 = 0",      
    }
  ],
  [
    {
      equation: [3/4, -1.5, -60],
      katex: "\\frac{3x}{4} - 1.5y - 60 = 0",
    },
    {
      equation: [-1.25, -2.5, -75],
      katex: "-1.25x - 2.5y - 75 = 0",
    }
  ],
  [
    {
      equation: [0.25, -2/5, 7.5],
      katex: "0.25x - \\frac{2y}{5} + 7.5 = 0",
    },
    {
      equation: [1/3, 1/7, 20],
      katex: "\\frac{x}{3} + \\frac{y}{7} + 20 = 0",
    }
  ],
  [
    {
      equation: [-4, 9/2, -500],
      katex: "-4x + \\frac{9y}{2} -500 = 0",
    },
    {
      equation: [0.35, 0.42, -38.5],
      katex: "0.35x + 0.42y - 38.5 = 0",
    }
  ],

  [
    {
      equation: [2/3, -1/6, -100],
      katex: "\\frac{2x}{3} - \\frac{y}{6} - 100 = 0",
    },
    {
      equation: [-2.3, -6.9, 276],
      katex: "-2.3x - 6.9y + 276 = 0",
    }
  ],
]

const step5Questions = [
  {
    equation: [2, -3, -300],
    katex: "2x - 3y - 300 = 0",
    questions: [
      {
        simplification1: "2(0) - 3y - 300 = 0",
        simplification2: "0 - 3y - 300 = 0",
        simplification3: "-3y = 300"
      },
      {
        simplification1: "2x -3(0) - 300 = 0",
        simplification2: "2x - 0 - 300 = 0",
        simplification3: "2x = 300",
      }
    ]
  },
  {
    equation: [-4, -2, 320],
    katex: "-4x - 2y + 320 = 0",
    questions: [
      {
        simplification1: "-4(0) - 2y + 320 = 0",
        simplification2: "0 - 2y + 320 = 0",
        simplification3: "-2y = -320"
      },
      {
        simplification1: "-4x - 2(0) + 320 = 0",
        simplification2: "-4x - 0 + 320 = 0",
        simplification3: "-4x = -320"
      }
    ]
  },
  {
    equation: [1, 3, -240],
    katex: "x + 3y -240 = 0",

    questions: [
      {
        simplification1: "(0) + 3y - 240 = 0",
        simplification2: "0 + 3y - 240 = 0",
        simplification3: "3y = 240",
      },
      {
        simplification1: "x + 3(0) - 240 = 0",
        simplification2: "x + 0 - 240 = 0",
        simplification3: "x = 240",
      }
    ]
  },
  {
    equation: [-2, -5, -450],
    katex: "-2x - 5y - 450 = 0",
    questions: [
      {
        simplification1: "-2(0) - 5y - 450 = 0",
        simplification2: "0 - 5y - 450 = 0",
        simplification3: "-5y = 450",
      },
      {
        simplification1: "-2x - 5(0) - 450 = 0",
        simplification2: "-2x + 0 - 450 = 0",
        simplification3: "-2x = 450",
      }
    ]
  }
]

export default class Tutorial3Contents implements TutorialContents {
  heading = "Tutorial 03";
  subHeading =  "Points on a Line";
  steps = this.generateSteps();

  generateSteps() {
    const equation = getRandomSample(equations);
    const step4Question = getRandomSample(step4Questions);
    const step5Question = getRandomSample(step5Questions);

    const [a, b, c] = equation.coefficients;

    return [
      {
        card: Tutorial3Step1,
        contents: {
          title: "Line Equation",
          equation: [a, b, c],
        },
      },
      {
        card: Tutorial3Step2,
        contents: {
          title: "Points on Line",
          equation: [a, b, c],
        },
      },
      {
        card: Tutorial3Step3,
        contents: {
          title: "Point not on Line",
          equation: [a, b, c],
        },
      },
      {
        card: Tutorial3Step4,
        contents: {
          title: "Vertical Line Equations",
          equation: [a, 0, c],
        }
      },
      {
        card: Tutorial3Step5,
        contents: {
          title: "Horizontal Line Equations",
          equation: [0, b, c],
        }
      },
    ];
  }
}
