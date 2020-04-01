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

interface Tutorial6Step1State {
    currentSubStep: number;
    showErrorMessage: boolean;
    focusInput: boolean;
    showText2: boolean;
    showText3: boolean;
    swapedPoints: any;
    slope: number;
}

export default class Tutorial6Step1 extends React.Component<TutorialStepProps, Tutorial6Step1State>{
    input1: React.RefObject<NumberInput>;
    input2: React.RefObject<NumberInput>;
    nextRef: React.RefObject<EnterButton>;

    point1Position: any;
    point2Position: any;
    graphPoints: any;

    _isMounted: boolean;

    text1 = (points) => <span>Alternately, if we choose ({points.p1.x},{points.p1.y}) to be P1,</span>;
    text2 = (points) => <span>we have <Highlight>P₁(x₁,y₁) is ({points.p1.x},{points.p1.y})</Highlight> and <Highlight>P₂(x₂,y₂) is ({points.p2.x},{points.p2.y})</Highlight></span>;
    finalText = 'Observe that the slope is same no matter how we order the two points.';

    constructor(props) {
        super(props)

        this.state = {
            currentSubStep: 0,
            showErrorMessage: false,
            focusInput: false,
            showText2: false,
            showText3: false,
            swapedPoints: null,
            slope: null
        }
        this.input1 = React.createRef();
        this.input2 = React.createRef();
        this.nextRef = React.createRef();
        this.point1Position = null;
        this.point2Position = null;
        this.graphPoints = {};
    }

    componentDidMount() {
        this._isMounted = true;
        const previousPoints = this.props.tutorialState;
        const graph = this.props.graph;

        this.input1.current && this.input1.current.focus();

        graph.reset(simpleAxesDef);

        this.setState({
            swapedPoints: this.swapPoints(previousPoints),
        })
    }

    componentDidUpdate() {
        const graph = this.props.graph;

        if (this.state.swapedPoints) {
            this.addGraphPoints(graph, this.state.swapedPoints)
            this.annotateGraphPoints(graph, this.state.swapedPoints);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

     // keep this method in common
    swapPoints(data) {
        return {p1: data.points.p2, p2: data.points.p1}
    }

    calculateSlope() {
        const delY = this.state.swapedPoints.p2.y - this.state.swapedPoints.p1.y;
        const delX = this.state.swapedPoints.p2.x - this.state.swapedPoints.p1.x;

        const slope = parseFloat((delY/delX).toFixed(3))

        this.setState({ slope: slope})
    }

    annotateGraphPoints(graph, swapedPoints) {
        const p1 = { x: swapedPoints.p1.x, y: swapedPoints.p1.y}
        const p2 = { x: swapedPoints.p2.x, y: swapedPoints.p2.y}
        graph.annotatePoint(`P1(${p1.x}, ${p1.y})`, p1, colorPalette[1])
        graph.annotatePoint(`P2(${p2.x}, ${p2.y})`, p2, colorPalette[1])
    }

    addGraphPoints(graph, swapedPoints) {

        if (this.point1Position) {
            graph.removePoint(this.point1Position);
        }

        this.point1Position = graph.addPoint({ x: swapedPoints.p1.x, y: swapedPoints.p1.y }, 5, {
            fill: colorPalette[1],
        })

        if (this.point2Position) {
            graph.removePoint(this.point2Position);
        }

        this.point2Position = graph.addPoint({ x: swapedPoints.p2.x, y: swapedPoints.p2.y }, 5, {
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
                this.calculateSlope()
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
                this.props.onStepComplete(this.props.tutorialState);
                break
            default:
                console.error('ERROR in this currentSubStep: ', currentSubStep)
                break
        }
    }

    checkInputs() {
        return (this.check1stInput() && this.check2ndInput())
    }

    check1stInput() {
        return (this.input1.current.value == this.state.swapedPoints.p2.y - this.state.swapedPoints.p1.y)
    }

    check2ndInput() {
        return (this.input2.current.value == this.state.swapedPoints.p2.x - this.state.swapedPoints.p1.x)
    }

    subActionStep1() {
        return <div>
            <StepAction> 
                Slope = ΔY/ΔX = (<NumberInput ref={this.input1} />)/(<NumberInput ref={this.input2} />)
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
        let text1Element = <div></div>;
        let text2Element = <div></div>;
        let text3Element = <div></div>;
        let enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />;

        if(this.state.swapedPoints) {
            const text1 = this.text1(this.state.swapedPoints);
            const text2 = this.text2(this.state.swapedPoints);

            text1Element = <div>
                 <Block>
                    <StepContent>{text1}</StepContent>
                    <StepContent>{text2}</StepContent>
                 </Block>
            </div>
        }

        if(this.state.showText2) {
            text2Element = <div>
                <Block>
                    <StepContent>So, {this.subActionStep1()}</StepContent>
                </Block>
            </div>
        }

        if(this.state.showText3) {
            text3Element = <div>
                <Block>
                    <StepContent>=> <StepAction>Slope = {this.state.slope}</StepAction></StepContent>
                </Block>
                <Block>
                    <StepContent>{this.finalText}</StepContent>
                </Block>
            </div>
        }
                    
        return (
            <TutorialContainer>
                
                {text1Element}
                {text2Element}
                {text3Element}

                {this.state.showErrorMessage ? this.errorMessage() : null}

                {enterButton}
            </TutorialContainer>
        ) 
    }
}