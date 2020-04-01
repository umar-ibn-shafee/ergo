import { TutorialContents } from '../Common';
import Tutorial5Step1 from './Tutorial5Step1';
import Tutorial5Step2 from './Tutorial5Step2';

export default class Tutorial5Contents implements TutorialContents {
    heading =  "Tutorial 05";
    subHeading = "Distance Between Two Points";
    steps = [
      {
        card: Tutorial5Step1,
        contents: {
          title: "Pythagoras Theorem",
        },
      },
      {
        card: Tutorial5Step2,
        contents: {
          title: "Distance Between Two Points",
        },
      },
    ];
  }