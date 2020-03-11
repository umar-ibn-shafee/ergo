import { TutorialContents } from '../Common';

import Tutorial2Step1 from './Tutorial2Step1';
import Tutorial2Step2 from './Tutorial2Step2';
import Tutorial2Step3 from './Tutorial2Step3';

export default class Tutorial2Contents implements TutorialContents {
  heading =  "Tutorial 02";
  subHeading = "Identifying Coordinates";
  steps = [
    {
      card: Tutorial2Step1,
      contents: {
        title: "X-Coordinate",
      },
    },
    {
      card: Tutorial2Step2,
      contents: {
        title: "Y-Coordinate",
      },
    },
    {
      card: Tutorial2Step3,
      contents: {
        title: "Input the Coordinates",
      },
    },
  ];
}

