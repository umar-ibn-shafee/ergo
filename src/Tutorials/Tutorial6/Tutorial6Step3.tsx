import * as React from "react"

import { TutorialStepProps, StepAction, TutorialContainer, StepContent, EnterButton, Block, Bold, Highlight } from '../Common'
import { TextInput, NumberInput } from "../../Input";
import { getRandomSample, colorPalette } from "../../Common";

const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
};

interface Tutorial6Step3State {
    currentSubStep: number;
    showErrorMessage: boolean;
    focusInput: boolean;
    showText2: boolean;
    showText3: boolean;
    showText4: boolean;
    showText5: boolean;
    graphPoints: any;
}

export default class Tutorial6Step3 extends React.Component<TutorialStepProps, Tutorial6Step3State>{
    input1: React.RefObject<NumberInput>;
    input2: React.RefObject<NumberInput>;
    input3: React.RefObject<TextInput>;
    nextRef: React.RefObject<EnterButton>;

    point1Position: any;
    point2Position: any;

    _isMounted: boolean;

    text1 = 'Consider the points P1 and P2 shown here.';
    text2 = 'In this case, slope will be ΔY divided by 0.'
    text3 = 'Since division by zero is not defined, slope is undefined.'
    text4 = 'Or intuitively speaking, slope is infinity.'
    text5 = 'For infinite slope, press i on the keyboard.'

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
            graphPoints: null
        }
        this.input1 = React.createRef();
        this.input2 = React.createRef();
        this.input3 = React.createRef();
        this.nextRef = React.createRef();
        this.point1Position = null;
        this.point2Position = null;
    }

    componentDidMount() {
        this._isMounted = true;
        const graph = this.props.graph;

        graph.reset(simpleAxesDef);
        this.generatePoints(graph)
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    annotateGraphPoints(graph, graphPoints) {
        const p1 = { x: graphPoints.p1.x, y: graphPoints.p1.y}
        const p2 = { x: graphPoints.p2.x, y: graphPoints.p2.y}
        graph.annotatePoint(`P1(${p1.x}, ${p1.y})`, p1, colorPalette[1])
        graph.annotatePoint(`P2(${p2.x}, ${p2.y})`, p2, colorPalette[1])
    }

    async generatePoints(graph) {

        const xTicks = graph.xTicks();
        const xRange = xTicks.slice(2, xTicks.length - 2);

        const yTicks = graph.yTicks();
        const yRange = yTicks.slice(2, yTicks.length - 2);

        const x1 = getRandomSample(xRange);
        const y1 = getRandomSample(yRange);
        const x2 = getRandomSample(xRange);
        const y2 = getRandomSample(yRange);

        await this.setState({graphPoints: { p1: {x: x1, y: y1}, p2: {x: x1, y: y2} }})

        this.addGraphPoints(graph, this.state.graphPoints)
        this.annotateGraphPoints(graph, this.state.graphPoints)

    }

    addGraphPoints(graph, graphPoints) {
        if (this.point1Position) {
            graph.removePoint(this.point1Position);
        }

        this.point1Position = graph.addPoint({ x: graphPoints.p1.x, y: graphPoints.p1.y }, 5, {
            fill: colorPalette[1],
        })

        if (this.point2Position) {
            graph.removePoint(this.point2Position);
        }

        this.point2Position = graph.addPoint({ x: graphPoints.p2.x, y: graphPoints.p2.y }, 5, {
            fill: colorPalette[1],
        })
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
                if(this.checkInput1()) {
                    this._isMounted && this.setState({ 
                        showText2: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({ showErrorMessage: true })
                }
                break
            case 2:
                if(this.checkInput2()) {
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
                this._isMounted && this.setState({ showText5: true })
                break
            case 5:
                if (this.checkInput3()) {
                    this.props.onStepComplete(this.props.tutorialState);
                    this._isMounted && this.setState({ showErrorMessage: false })
                } else {
                    this._isMounted && this.setState({ showErrorMessage: true })
                }
                break
            default:
                console.error('ERROR in this currentSubStep: ', currentSubStep)
                break
        }
    }

    checkInput1() {
        return (this.input1.current.value === this.state.graphPoints.p1.x)
    }

    checkInput2() {
        return (this.input2.current.value === 0)
    }

    checkInput3() {
        return (this.input3.current.value === 'i')
    }

    subActionStep1() {
        return <div>
            <StepContent>
                They have the same x coordinate which is <StepAction>(<NumberInput ref={this.input1} />)</StepAction>.
            </StepContent>
        </div>
    }

    subActionStep2() {
        return <div>
            <StepAction> 
                ΔX = (<NumberInput ref={this.input2} />)
            </StepAction>
        </div>
    }

    subActionStep3() {
        return <div>
            <StepAction> 
                Slope = (<TextInput ref={this.input3} />)
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
        let text4Element = <div></div>;
        let text5Element = <div></div>;
        let text6Element = <div></div>;
        let enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />;

        text2Element = <div>
            <Block>
                {this.subActionStep1()}
            </Block>
        </div>

        if(this.state.showText2) {
            text3Element = <div>
                <Block>
                    <StepContent>Then, {this.subActionStep2()}</StepContent>
                </Block>
            </div>
        }

        if(this.state.showText3) {
            text4Element = <div>
                <Block>
                    <StepContent>{this.text2}</StepContent>
                </Block>
            </div>
        }

        if(this.state.showText4) {
            text5Element = <div>
                <Block>
                    <StepContent>{this.text3}</StepContent>
                    <StepContent>{this.text4}</StepContent>
                </Block>
            </div>
        }

        if(this.state.showText5) {
            text6Element = <div>
                <Block>
                    <StepContent>{this.text5}</StepContent>
                    <Block>
                        {this.subActionStep3()}
                    </Block>
                </Block>
            </div>
        }
                    
        return (
            <TutorialContainer>
                <StepContent>{this.text1}</StepContent>
                
                {text2Element}
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