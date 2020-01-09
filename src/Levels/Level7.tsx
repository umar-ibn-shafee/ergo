import * as React from "react"

import Graph from '../Graph'

import { LevelDefinition, generateRandomAxesDef } from './Common'

import { NumberInput }from '../Input'

import {
  Point,
  colorPalette,
  getRandomInt,
  getRandomSample,
  gcd
} from '../Common'
import { any } from "prop-types";


const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
};


interface pAndThreePoints {
    x1: number;
    y1: number;
    x2: number;
    y2: number;  
    x3: number;
    y3: number;
    p: number;    
};
  

const axesDefs = {
  3: [5, 10, 20],
  5: [0.2, 1, 5, 10, 20],
  4: [0.25, 2.5, 5, 10, 25],
};

export default class Level7Definition implements LevelDefinition<pAndThreePoints  > {
  pRef: React.RefObject<NumberInput>;
  
  wrongPoint: any;
  currentPoint1: any;
  currentPoint2: any;
  currentPoint3: any;
  PointAnnotation1: any;
  PointAnnotation2: any;
  PointAnnotation3: any;

  heading = "Game Level 07";
  subHeading = "Collinear Points";

  constructor() {
    this.pRef = React.createRef();
    
    this.wrongPoint = null;
    this.PointAnnotation1 = null;
    this.PointAnnotation2 = null;
    this.currentPoint1 = null;
    this.currentPoint2 = null;
  }

  generateQuestionText(question) {
    return `Given that the three points shown are collinear. Enter the value of p.`;
  }

  renderAnswerField(question) {
    return (
        <span style={{color: colorPalette[10], fontWeight: 600}}>  
          (<NumberInput ref={this.pRef} />) 
        </span> 
    );
  }

  helpText(questionLevel: number) {
    switch(questionLevel) {
      case 0:
        return "Enter the answer as a decimal (correct to two places) or as a fraction.";

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
    switch(questionLevel) {
      case 0:
        return "Wrong! Recollect that every point on a horizontal line has the same y-coordinate."
      case 1:
        return "Wrong! Recollect that every point on a vertical line has the same x-coordinate."
      default:
        return "Wrong! The two triangles shown here are similar to each other. Thus these pairs of collinear points have the same slope. Try again.";
    }
  }

  secondClue(question, questionLevel) {
    return "Last Attempt. Try again.";
  }

  prepareGraphForQuestion(questionLevel, graph) {
    if(questionLevel < 2) {
      graph.invisibleReset(simpleAxesDef);
    } else if(questionLevel == 2) {
      const axesDef = generateRandomAxesDef(1, 5);

      graph.invisibleReset(axesDef);
    } else if(questionLevel == 3) {
      const subTickSize = getRandomSample(axesDefs[5]);
      const axesDef = generateRandomAxesDef(subTickSize, 5);

      graph.invisibleReset(axesDef);
    } else if(questionLevel >= 4) {
      const numSubticksPerTick = getRandomSample([3, 4]);
      const subTickSize = getRandomSample(axesDefs[numSubticksPerTick]);

      const axesDef = generateRandomAxesDef(subTickSize, numSubticksPerTick);

      graph.invisibleReset(axesDef);
    }
  }

  /*Randomly generate raw coordinates to make a line with. */
  rawCoordinates(graph){
    const xTicks = graph.xTicks();
    const xaRange = xTicks.slice(Math.floor(0.4*xTicks.length), Math.floor(0.6*xTicks.length));

    const yTicks = graph.yTicks();
    const yaRange = yTicks.slice(Math.floor(0.4*yTicks.length), Math.floor(0.6*yTicks.length));

    const xa = getRandomSample(xaRange);
    const ya = getRandomSample(yaRange);

    const xl = getRandomSample(xTicks.slice(Math.floor(0.2*xTicks.length), Math.floor(0.4*xTicks.length) - 4));
    const xh = getRandomSample(xTicks.slice(Math.floor(0.6*xTicks.length) + 4, Math.floor(0.8*xTicks.length)));
    const yl = getRandomSample(yTicks.slice(Math.floor(0.2*yTicks.length), Math.floor(0.4*yTicks.length) - 1));
    const yh = getRandomSample(yTicks.slice(Math.floor(0.6*yTicks.length) + 1, Math.floor(0.8*yTicks.length)));

    const xcoords = [xl,xh].sort(() => 0.5 - Math.random()).slice(0,2);
    const xb = xcoords[0];
    const xc = xcoords[1];

    const ycoords = [yl,yh].sort(() => 0.5 - Math.random()).slice(0,2);
    const yb = ycoords[0];
    const yc = ycoords[1];

    return {
      xa : xa,
      xb : xb,
      xc : xc,
      ya : ya,
      yb : yb,
      yc : yc
    }
  }

  showPointsAndLine(q,graph){
    const slope = (q.y2 - q.y1)/(q.x2 - q.x1)
    const yintercept = q.y1 - q.x1*slope
    
    if (q.x1 == q.x2) {
      graph.drawVerticalLine(q.x1, null, {
        stroke: colorPalette[8],
        'stroke-width': '3px',
      })
    } else {
      graph.drawLine([slope, -1, yintercept], null, {
        stroke: colorPalette[8],
        'stroke-width': '3px',
      })
    }
    
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

    if(this.currentPoint3) {
      graph.removePoint(this.currentPoint3);
    }

    this.currentPoint3 = graph.addPoint({x: q.x3, y: q.y3}, 5, {
      fill: colorPalette[1],
    }
    )
  }

  showAnnotations(q,annots,graph){
    const slope = (q.y2 - q.y1)/(q.x2 - q.x1)
    
    if (slope < 0) {
      //Annotations at top right is slope is negative.
      this.PointAnnotation1 = graph.upAnnotatePoint(`(${annots[0]}, ${annots[3]})`, {x: q.x1, y: q.y1}, colorPalette[1]);
      this.PointAnnotation1 = graph.upAnnotatePoint(`(${annots[1]}, ${annots[4]})`, {x: q.x2, y: q.y2}, colorPalette[1]); 
      this.PointAnnotation1 = graph.upAnnotatePoint(`(${annots[2]}, ${annots[5]})`, {x: q.x3, y: q.y3}, colorPalette[1]);
    } else {
      //Annotations at bottom right otherwise.
      this.PointAnnotation1 = graph.annotatePoint(`(${annots[0]}, ${annots[3]})`, {x: q.x1, y: q.y1}, colorPalette[1]);
      this.PointAnnotation1 = graph.annotatePoint(`(${annots[1]}, ${annots[4]})`, {x: q.x2, y: q.y2}, colorPalette[1]); 
      this.PointAnnotation1 = graph.annotatePoint(`(${annots[2]}, ${annots[5]})`, {x: q.x3, y: q.y3}, colorPalette[1]);
    }
    

  }

  /*Checks for cases of annotatee coord being equal to p or -p or zero 
  and return appropriate annotation text. 
  Returns concatenated string coefficient with p in other cases. */
  pCoefficientAnnotate(annotatee,p) {
    if (annotatee/p == 1) {
      return 'p';
    } else if (annotatee/p == -1) {
      return '-p';
    } else if (annotatee == 0){
       return '0';
    }  else {
      return (annotatee/p).toString().concat('p');
    }

  }

  /*Take two points and find a third point on that line which has niceish coordinates */
  niceCollinearPoint(xa,ya,xb,yb,graph){
    const xTicks = graph.xTicks();
    const yTicks = graph.yTicks();

    const dely = ya - yb;
    const delx = xa - xb;

    var factor = (gcd(dely*100,delx*100) < 100) ? 100 : gcd(dely*100,delx*100);

    const xInterval = Math.abs(delx*100)/factor;
    const yInterval = Math.abs(dely*100)/factor;

    var xLengths
    var yLengths

    if (delx > 0) {
      xLengths = Math.floor((xTicks[xTicks.length - 6] - xa)/xInterval)
    } else {
      xLengths = Math.floor((xa - xTicks[2])/xInterval)
    }
    
    if (dely > 0) {
      yLengths = Math.floor((yTicks[yTicks.length - 3] - ya)/yInterval)
    } else {
      yLengths = Math.floor((ya - yTicks[2])/yInterval)
    }
    
    const maxAllowedLength = Math.min(xLengths,yLengths); 
    var nInterval

    if (maxAllowedLength < 2){
      nInterval = 0.5
    } else if (maxAllowedLength < 60){
      nInterval = getRandomInt(2,maxAllowedLength); 
    } else {
      nInterval = getRandomInt(20,maxAllowedLength);
    }

    const xc = xa + ((delx < 0) ? -1 : 1)*nInterval*xInterval;
    const yc = ya + ((dely < 0) ? -1 : 1)*nInterval*yInterval;

    console.log('factor',factor)
    console.log('Intervals',xInterval,yInterval)
    console.log('lengths',xLengths,yLengths)  
    console.log('Max Allowed Lengths', maxAllowedLength, 'number of intervals', nInterval)
  
    return {
      xc:xc,
      yc:yc
    }
  }

  generateQuestion(questionLevel: number, graph) {
    const raw = this.rawCoordinates(graph);
    
    const yTicks = graph.yTicks();

    //annots is the array of annotations to be shown.
    var annots = [];
    var coord;

    const xa = raw.xa;
    const xb = raw.xb; 
    const xc = raw.xc; 
    const ya = raw.ya; 
    const yb = raw.yb; 
    const yc = raw.yc;

    var q
    switch(questionLevel) {
      case 0:
        q = {
          x1 : xa,
          x2 : xb,
          x3 : xc,
          y1 : ya,
          y2 : ya,
          y3 : ya,
          p : ya,
        }

        //p has to be a y coordinate
        var intp = getRandomInt(3,5);
        
        var i = 0;
        
        //Get appropriate annotations for each coordinate.
        for (coord in q){
          if (i == intp){
            annots[i] = 'p';
          } else {
            annots[i] = q[coord];
          }
          i++;
        }    
        break;
      case 1:
        q = {
          x1 : xa,
          x2 : xa,
          x3 : xa,
          y1 : ya,
          y2 : yb,
          y3 : yc,
          p : xa,
        }     

        //p has to be an x coordinate
        var intp = getRandomInt(0,2)
        
        var i = 0;

        //Get appropriate annotations for each coordinate.
        for (coord in q){
          if (i == intp){
            annots[i] = 'p';
          } else {
            annots[i] = q[coord];
          }
          i++;
        }    
        break; 
      default:
      //Show a single p annotation.
        var thirdPoint = this.niceCollinearPoint(xa,ya,xb,yb,graph);

        q = {
          x1 : xa,
          x2 : xb,
          x3 : thirdPoint.xc,
          y1 : ya,
          y2 : yb,
          y3 : thirdPoint.yc,
        }     

        var intp = getRandomInt(0,5)
        
        var i = 0;

        //Get appropriate annotations for each coordinate.
        for (coord in q){
          if (i == intp){
            annots[i] = 'p';
            q.p = q[coord]
          } else {
            annots[i] = q[coord];
          }
          i++;
        }    
        break;
        case 4:
        //Show two coordinates with p annotation. 
        var thirdPoint = this.niceCollinearPoint(xa,ya,xb,yb,graph);

        q = {
          x1 : xa,
          x2 : xb,
          x3 : thirdPoint.xc,
          y1 : ya,
          y2 : yb,
          y3 : thirdPoint.yc,
        }     

        //Chooose to show p annotations to x coordinates or y coordinates.
        var xory;
        if (Math.abs(q.x3*q.y3) > 0.01){
          xory = [3,0][(Math.random() * 2) | 0];
        } else if (Math.abs(q.x3) > 0.01){
          xory = 0;
        } else if (Math.abs(q.y3) > 0.01){
          xory = 3;
        } else {
          xory = 5;
        }

        //p is gcd of coordinates multiplied by hundred (to make them integers)
        var p = (xory == 0) ? gcd(100*q.x1, 100*q.x2)/100 : gcd(100*q.y1, 100*q.y2)/100;
        q.p = p;

        var i = 0;

        //Get appropriate annotations for each coordinate.
        for (coord in q){
          if (i == xory || i == xory + 1){
            annots[i] = this.pCoefficientAnnotate(q[coord],p);
          } else {
              annots[i] = q[coord];
          }
          i++;
        }    
        break;
    }

    this.showPointsAndLine(q, graph);
    this.showAnnotations(q,annots,graph)
 
    console.log(q)
    return q;
  }

  onGraphClicked(point, graph) {
  }

  validateAnswer(question, graph) {
    const a = {p: this.pRef.current.value};
    const q = question;
    
    console.log(a, q)
    return (Math.abs(a.p - q.p) < 0.01);
  }

  showHint1(question, graph){
    const q = question;

    graph.drawLineSegment({x: q.x1, y: q.y1}, {x: q.x2, y: q.y1}, null, {
      stroke: colorPalette[10],
      'stroke-width': '4px',
    })

    graph.drawLineSegment({x: q.x2, y: q.y1}, {x: q.x2, y: q.y2}, null, {
      stroke: colorPalette[11],
      'stroke-width': '4px',
    })

    graph.drawLineSegment({x: q.x1, y: q.y1}, {x: q.x1, y: q.y3}, null, {
      stroke: colorPalette[11],
      'stroke-width': '4px',
    })

    graph.drawLineSegment({x: q.x1, y: q.y3}, {x: q.x3, y: q.y3}, null, {
      stroke: colorPalette[10],
      'stroke-width': '4px',
    })

    this.showPointsAndLine(q, graph);
  }

  showHint2(question, graph) {
    const q = question

  }

  onLevelFailed(question, graph){
  }

  onAnswer(isCorrect, graph) {
    const d = this.pRef.current.value;

    this.pRef.current.clear();
    
    if(this.pRef.current) {
      this.pRef.current.focus();
    }

  }

  shouldEnableConfirmButton() {
    return this.pRef.current && this.pRef.current.text != ""
  }
}
