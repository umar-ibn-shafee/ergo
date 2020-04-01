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
}

export default class Tutorial5Step1 extends React.Component<TutorialStepProps, Tutorial5Step1State>{
    input1: React.RefObject<TextInput>;
    input2: React.RefObject<TextInput>;
    input3: React.RefObject<TextInput>;
    nextRef: React.RefObject<EnterButton>;

    _isMounted: boolean;

    text1 = 'You must be familiar with Pythagoras Theorem from earlier standards.';
    text2 = 'For the given right angled triangle, apply Pythagoras Theorem.';

    constructor(props) {
        super(props)

        this.state = {
            showErrorMessage: false,
            focusInput: true,
        }
        this.input1 = React.createRef();
        this.input2 = React.createRef();
        this.input3 = React.createRef();
        this.nextRef = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        const graph = this.props.graph;

        this.input1.current.focus();

        graph.reset(simpleAxesDef);
        this.generateTriangle(graph)
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
            stroke: colorPalette[8],
            'stroke-width': '4px',
        })

        graph.drawLineSegment(coordinates.r, coordinates.h2, null, {
            stroke: colorPalette[8],
            'stroke-width': '4px',
        })

        graph.addPoint(coordinates.h1, 5, { fill: colorPalette[1] })
        graph.addPoint(coordinates.h2, 5, { fill: colorPalette[1] })
        graph.addPoint(coordinates.r, 5, { fill: colorPalette[1] })   
    
        graph.annotatePoint(`A`, coordinates.h1, colorPalette[1])
        graph.annotatePoint(`B`, coordinates.h2, colorPalette[1])
        graph.annotatePoint(`C`, coordinates.r, colorPalette[1])
    }


    async onNextButton() {

        if (this.checkInputs()) {
            await this._isMounted && this.props.onStepComplete(this.props.tutorialState);
        } else {
            this.setState({
                showErrorMessage: true
            })
        }

    }

    checkInputs() {
        return (this.check1stInput() && this.check2ndInput() && this.check3rdInput())
    }

    check1stInput() {
        return (this.input1.current.value == 'AB' || this.input1.current.value == 'BA')
    }

    check2ndInput() {
        const input2 = this.input2.current.value;
        const input3 = this.input3.current.value;

        return (input2 == 'BC' || input2 == 'CB' || input2 == 'AC' || input2 == 'CA') ? 
            (input2 !== input3) : false

    }

    check3rdInput() {
        const input2 = this.input2.current.value;
        const input3 = this.input3.current.value;

        return (input3 == 'BC' || input3 == 'CB' || input3 == 'AC' || input3 == 'CA') ?
            (input3 !== input2 && input3 !== this.reverseString(input2)) : false

    }

    reverseString(str) {
        return str.split("").reverse().join("");
    }

    // use this "²" if don't want <sup>
    subActionStep1() {
        return <div>
            <StepAction> 
                (<TextInput ref={this.input1} />)<sup>2</sup> = (<TextInput ref={this.input2} />)<sup>2</sup> + (<TextInput ref={this.input3} />)​<sup>2</sup> 
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
        var text2Element = <div></div>;
        var enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />;

        text2Element = <div>
            <Block>
                {this.subActionStep1()}
           </Block>
        </div>
                    
        return (
            <TutorialContainer>
                <StepContent>{this.text1}</StepContent>
                <Block>
                    <StepContent>{this.text2}</StepContent>
                </Block>

                {text2Element}

                {this.state.showErrorMessage ? this.errorMessage() : null}

                {enterButton}
            </TutorialContainer>
        )
    }
}