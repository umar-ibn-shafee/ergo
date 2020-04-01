import { TutorialContents, equations } from '../Common';
import { getRandomSample } from '../../Common';
import Tutorial7 from './Tutorial7';

export default class Tutorial7Contents implements TutorialContents {
  
  heading =  "Tutorial 07";
  subHeading = "Collinear Points";
  steps = this.generateSteps()
  
  generateSteps() {
    const equation = getRandomSample(equations);
    const [a, b, c] = equation.coefficients;

    return [
      {
        card: Tutorial7,
        contents: {
          title: "Collinear Points",
          equation: [a, b, c],
        },
      }
    ];
  }
  
}