import * as React from "react"

import { TutorialStepProps, StepAction, TutorialContainer, StepContent, EnterButton, Block, Bold } from '../Common'
import { TextInput } from "../../Input";
import { getRandomSample, colorPalette } from "../../Common";

const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
};

interface Tutorial5Step1State {
    showErrorMessage: boolean;
    focusInput: boolean;
    currentSubStep: number;
    showText2: boolean;
    showText3: boolean;
}

export default class Tutorial5Step1 extends React.Component<TutorialStepProps, Tutorial5Step1State>{
    input: React.RefObject<TextInput>;
    nextRef: React.RefObject<EnterButton>;

    _isMounted: boolean;

    text1 = 'For the two points shown, ΔX and ΔY are at right angles with each other.';
    text2 = 'Then the distance between the points r is the hypotenuse of this right angled triangle.';

    constructor(props) {
        super(props)

        this.state = {
            showErrorMessage: false,
            focusInput: false,
            currentSubStep: 0,
            showText2: false,
            showText3: false,
        }
        this.input = React.createRef();
        this.nextRef = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const graph = this.props.graph;

        this.nextRef.current && this.nextRef.current.focus();

        graph.reset(simpleAxesDef);
        this.generateTriangle(graph)
    }

    componentDidUpdate() {
        this.input.current && this.input.current.focus()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    generateRightTriangleCoordinates(graph) {
        const xTicks = graph.xTicks();
        const xRange = xTicks.slice(2, xTicks.length - 2);
    
        const yTicks = graph.yTicks();
        const yRange = yTicks.slice(2, yTicks.length - 2);
    
        const x1 = getRandomSample(xRange);
        const y1 = getRandomSample(yRange);
        const x2 = getRandomSample(xRange);
        const y2 = getRandomSample(yRange);
        
        return {
            h1: {x: x1, y: y1},
            h2: {x: x2, y: y2},
            r: {x: x2, y: y1}
        }
      }

      generateTriangle(graph) {

        const coordinates = this.generateRightTriangleCoordinates(graph)

        graph.drawLineSegment(coordinates.h1, coordinates.h2, null, {
            stroke: colorPalette[8],
            'stroke-width': '3px',
        })

        graph.drawLineSegment(coordinates.h1, coordinates.r, null, {
            stroke: colorPalette[10],
            'stroke-width': '4px',
        })

        graph.drawLineSegment(coordinates.r, coordinates.h2, null, {
            stroke: colorPalette[10],
            'stroke-width': '4px',
        })

        graph.addPoint(coordinates.h1, 5, { fill: colorPalette[1] })
        graph.addPoint(coordinates.h2, 5, { fill: colorPalette[1] })
    
        graph.annotatePoint(`A(${coordinates.h1.x}, ${coordinates.h1.y})`, coordinates.h1, colorPalette[1])
        graph.annotatePoint(`B(${coordinates.h2.x}, ${coordinates.h2.y})`, coordinates.h2, colorPalette[1])
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
                this._isMounted && this.setState({ 
                    showText2: true,
                    focusInput: true
                })
                break
            case 2:
                if(this.checkInput()) {
                    this._isMounted && this.setState({ 
                        showText3: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({ showErrorMessage: true })
                }
                break
            case 3:
                this.props.onStepComplete(this.props.tutorialState);
                break
            default:
                console.error('ERROR in this currentSubStep: ', currentSubStep)
                break
        }
    }

    checkInput() {
        return (this.input.current.value == 'AB' || this.input.current.value == 'BA')
    }

    reverseString(str) {
        return str.split("").reverse().join("");
    }

    // use this "²" if don't want <sup>
    subActionStep1() {
        return <div>
            <StepAction>
                (<TextInput ref={this.input} />)<sup>2</sup> = (ΔX)<sup>2</sup> + (ΔY)​<sup>2</sup> 
            </StepAction>
        </div>
    }

    subActionStep2() {
        return <div>
            <StepAction> 
                Thus r = √(ΔX)2 + (ΔY)2
            </StepAction>
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
        let text2Element = <div></div>;
        let text3Element = <div></div>;
        let enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />;

        if(this.state.showText2) {
            text2Element = <div>
                <Block>
                    <StepContent>{this.text2}</StepContent>
                    <Block>
                        <StepContent>Therefore, </StepContent>{this.subActionStep1()}
                    </Block>
                </Block>
            </div>
        }

        if(this.state.showText3) {
            text3Element = <div>
                <Block>
                    <StepContent>Thus </StepContent>{this.subActionStep2()}
                </Block>
            </div>
        }
                    
        return (
            <TutorialContainer>
                <StepContent>{this.text1}</StepContent>

                {text2Element}
                {text3Element}

                {this.state.showErrorMessage ? this.errorMessage() : null}

                {enterButton}
            </TutorialContainer>
        )
    }
}