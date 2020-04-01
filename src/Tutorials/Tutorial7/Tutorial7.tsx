import * as React from "react"

import { TutorialStepProps, StepAction, TutorialContainer, StepContent, EnterButton, Block, Bold, Highlight, formatEquation } from '../Common'
import { TextInput, NumberInput } from "../../Input";
import { getRandomSample, getRandomInt, gcd, colorPalette } from "../../Common";

const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
};

interface Tutorial7State {
    currentSubStep: number;
    showErrorMessage: boolean;
    focusInput: boolean;
    showText2: boolean;
    showText3: boolean;
    showText4: boolean;
    showText5: boolean;
    graphPoints: any;
    yIntercept: number;
    slope: number;
}

export default class Tutorial7 extends React.Component<TutorialStepProps, Tutorial7State>{
    slope1DelX: React.RefObject<NumberInput>;
    slope1DelY: React.RefObject<NumberInput>;
    slope2DelX: React.RefObject<NumberInput>;
    slope2DelY: React.RefObject<NumberInput>;
    slope3DelX: React.RefObject<NumberInput>;
    slope3DelY: React.RefObject<NumberInput>;
    nextRef: React.RefObject<EnterButton>;

    point1Position: any;
    point2Position: any;
    point3Position: any;

    _isMounted: boolean;

    text1 = 'Any two points on a given line will have the same slope as any other pair of points on that line.';
    text2 = (points, equation) => {
        const formattedEquation = formatEquation(equation, "x", "y");
        return <span>For example, <Highlight>consider Points P1({points.p1.x}, {points.p1.y}), P2({points.p2.x}, {points.p2.y}), and P3({points.p3.x}, {points.p3.y})</Highlight> on line <Highlight>L : {formattedEquation}</Highlight></span>
    }
    text3 = 'This slope is same for any pair of points on the line L.'
    text4 = 'So we can say that line L has a slope 2.'
    text5 = 'So the slope of a line is the slope between any pair of points on it.'

    constructor(props) {
        super(props)

        this.state = {
            currentSubStep: 0,
            showErrorMessage: false,
            focusInput: false,
            showText2: false,
            showText3: false,
            showText4: false,
            showText5: false,
            graphPoints: null,
            yIntercept: null,
            slope: null
        }
        this.slope1DelX = React.createRef();
        this.slope1DelY = React.createRef();
        this.slope2DelX = React.createRef();
        this.slope2DelY = React.createRef();
        this.slope3DelX = React.createRef();
        this.slope3DelY = React.createRef();
        this.nextRef = React.createRef();
        this.point1Position = null;
        this.point2Position = null;
        this.point3Position = null;
    }

    componentDidMount() {
        this._isMounted = true;
        const graph = this.props.graph;

        graph.reset(simpleAxesDef);
        this.generateGraph(graph)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    generateGraph(graph) {
        const raw = this.rawCoordinates(graph)

        const thirdPoint = this.niceCollinearPoint(raw.xa, raw.ya, raw.xb, raw.yb, graph);

        const points = {
            x1 : raw.xa,
            x2 : raw.xb,
            x3 : thirdPoint.xc,
            y1 : raw.ya,
            y2 : raw.yb,
            y3 : thirdPoint.yc,
          }
        this.generateLineAndPoints(points, graph)
    }

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

    generateLineAndPoints(points ,graph){
        const slope = parseFloat(((points.y2 - points.y1)/(points.x2 - points.x1)).toFixed(3))
        const yintercept = points.y1 - points.x1*slope

        

        this.setState({
            yIntercept: yintercept,
            slope: slope
        })
        
        if (points.x1 == points.x2) {
          graph.drawVerticalLine(points.x1, null, {
            stroke: colorPalette[8],
            'stroke-width': '3px',
          })
        } else {
          graph.drawLine([slope, -1, yintercept], null, {
            stroke: colorPalette[8],
            'stroke-width': '3px',
          })
        }
        
        this.addGraphPoints(graph, points);
        this.annotateGraphPoints(graph, points);
    }

    addGraphPoints(graph, points) {
        if(this.point1Position) {
            graph.removePoint(this.point1Position);
        }
        
        this.point1Position = graph.addPoint({x: points.x1, y: points.y1}, 5, {
            fill: colorPalette[1],
        })
        
        if(this.point2Position) {
            graph.removePoint(this.point2Position);
        }
        
        this.point2Position = graph.addPoint({x: points.x2, y: points.y2}, 5, {
            fill: colorPalette[1],
        })
    
        if(this.point3Position) {
            graph.removePoint(this.point3Position);
        }
    
        this.point3Position = graph.addPoint({x: points.x3, y: points.y3}, 5, {
            fill: colorPalette[1],
        })
    }

    annotateGraphPoints(graph, points) {
        const p1 = { x: points.x2, y: points.y2 }
        const p2 = { x: points.x1, y: points.y1 }
        const p3 = { x: points.x3, y: points.y3 }
        graph.upAnnotatePoint(`P1(${p1.x}, ${p1.y})`, p1, colorPalette[1])
        graph.upAnnotatePoint(`P2(${p2.x}, ${p2.y})`, p2, colorPalette[1])
        graph.upAnnotatePoint(`P3(${p3.x}, ${p3.y})`, p3, colorPalette[1])
        this.setState({ graphPoints: {p1: p1, p2: p2, p3: p3} })
    }

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

    async onNextButton() {
        const currentSubStep = this.state.currentSubStep;
        
        if (this.state.showErrorMessage == false) {
            await this._isMounted && this.setState({
                currentSubStep: currentSubStep + 1
            })
        }

        this.handleContent()
 
    }

    handleContent() {
        const currentSubStep = this.state.currentSubStep;

        switch (currentSubStep) {
            case 1:
                this._isMounted && this.setState({ showText2: true })
                break
            case 2:
                if(this.checkInputs()) {
                    this._isMounted && this.setState({ 
                        showText3: true,
                        showErrorMessage: false 
                    })
                } else {
                    this._isMounted && this.setState({ showErrorMessage: true })
                }
                break
            case 3:
                this._isMounted && this.setState({ showText4: true })
                break
            case 4:
                this._isMounted && this.props.onStepComplete(this.props.tutorialState);
                break
            default:
                console.error('ERROR in this currentSubStep: ', currentSubStep)
                break
        }
    }

    checkAllDelY() {
        return (this.slope1DelY.current.value == this.state.graphPoints.p2.y - this.state.graphPoints.p1.y) &&
            (this.slope2DelY.current.value == this.state.graphPoints.p3.y - this.state.graphPoints.p2.y) &&
            (this.slope3DelY.current.value == this.state.graphPoints.p1.y - this.state.graphPoints.p3.y)
    }

    checkAllDelX() {
        return (this.slope1DelX.current.value == this.state.graphPoints.p2.x - this.state.graphPoints.p1.x) &&
            (this.slope2DelX.current.value == this.state.graphPoints.p3.x - this.state.graphPoints.p2.x) &&
            (this.slope3DelX.current.value == this.state.graphPoints.p1.x - this.state.graphPoints.p3.x)
    }

    checkInputs() {
        return (this.checkAllDelX() && this.checkAllDelY())
    }

    actionElements() {
        return <div>
            <StepContent>
                Slope of <StepAction>P₁P₂ = ΔY₁₂/ΔX₁₂ = (<NumberInput ref={this.slope1DelY}/>)/(<NumberInput ref={this.slope1DelX}/>) = {this.state.slope}</StepAction>
            </StepContent>
            <StepContent>
                Slope of <StepAction>P₂P₃ = ΔY₂₃/ΔX₂₃ = (<NumberInput ref={this.slope2DelY}/>)/(<NumberInput ref={this.slope2DelX}/>) = {this.state.slope}</StepAction>
            </StepContent>
            <StepContent>
                Slope of <StepAction>P₃P₁ = ΔY₃₁/ΔX₃₁ = (<NumberInput ref={this.slope3DelY}/>)/(<NumberInput ref={this.slope3DelX}/>) = {this.state.slope}</StepAction>
            </StepContent>
        </div>
    }

    errorMessage() {
        return <Block>
            <StepContent highlight={true}>
                <Bold>Wrong, Try Again!</Bold>
            </StepContent>
        </Block>;
    }

    render() {
        const contents = this.props.contents;
        let text2Element = <div></div>;
        let text3Element = <div></div>;
        let text4Element = <div></div>;
        let text5Element = <div></div>;
        let text6Element = <div></div>;
        let actionText = <div></div>;

        let enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />;

        if(this.state.showText2) {
            const text2 = this.text2(this.state.graphPoints, contents.equation)
            text2Element = <div>
                <Block>
                    <StepContent>{text2}</StepContent>
                </Block>
            </div>
            this.state.slope && (actionText = <div>
                <Block>
                    {this.actionElements()}
                </Block>
            </div>)
        }

        if(this.state.showText3) {
            text3Element = <div>
                <Block>
                    <StepContent>{this.text3}</StepContent>
                    <StepContent>{this.text4}</StepContent>
                </Block>
            </div>
        }

        if(this.state.showText4) {
            text4Element = <div>
                <Block>
                    <StepContent>{this.text5}</StepContent>
                </Block>
            </div>
        }
                    
        return (
            <TutorialContainer>
                <StepContent>{this.text1}</StepContent>
                
                {text2Element}
                {actionText}
                {text3Element}
                {text4Element}
                {text5Element}
                {text6Element}

                {this.state.showErrorMessage ? this.errorMessage() : null}

                {enterButton}
            </TutorialContainer>
        ) 
    }
}