import { TutorialContents } from '../Common';
import Tutorial6Step1 from './Tutorial6Step1';
import Tutorial6Step2 from './Tutorial6Step2';
import Tutorial6Step3 from './Tutorial6Step3';

export default class Tutorial6Contents implements TutorialContents {
    heading =  "Tutorial 06";
    subHeading = "Slope";
    steps = [
      {
        card: Tutorial6Step1,
        contents: {
          title: "Slope",
        },
      },
      {
        card: Tutorial6Step2,
        contents: {
          title: "Alternate Order",
        },
      },
      {
        card: Tutorial6Step3,
        contents: {
          title: "Infinite Slope",
        },
      },
    ];
  }