import { TutorialContents } from '../Common';
import Tutorial4Step1 from './Tutorial4Step1';
import Tutorial4Step2 from './Tutorial4Step2'

export default class Tutorial4Contents implements TutorialContents {
    heading =  "Tutorial 04";
    subHeading = "ΔX and ΔY";
    steps = [
      {
        card: Tutorial4Step1,
        contents: {
          title: "ΔX and ΔY",
        },
      },
      {
        card: Tutorial4Step2,
        contents: {
          title: "Alternate Order",
        },
      },
    ];
  }