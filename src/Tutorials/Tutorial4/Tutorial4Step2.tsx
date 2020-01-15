import * as React from "react"

import { TutorialStepProps, StepAction, TutorialContainer, StepContent, EnterButton, Block, Bold } from '../Common'
import { NumberInput } from "../../Input";
import { colorPalette } from "../../Common";

const simpleAxesDef = {
    xl: -28,
    xh: 28,
    yl: -23,
    yh: 23,
    subTickSize: 1,
    numSubticksPerTick: 5,
};

interface Tutorial4Step1State {
    showDelXValue: boolean;
    showDelYValue: boolean;
    showErrorMessage: boolean;
    currentSubStep: number;
    showText2: boolean;
    showText3: boolean;
    showText4: boolean;
    isContentAvailable: boolean;
    focusInput: boolean;
}

export default class Tutorial4Step1 extends React.Component<TutorialStepProps, Tutorial4Step1State>{
    coordinate1: React.RefObject<NumberInput>;
    coordinate2: React.RefObject<NumberInput>;
    nextRef: React.RefObject<EnterButton>;
    currentPoint1: any;
    currentPoint2: any;
    delValue: any;
    points: any;

    _isMounted: boolean;

    text1 = (x, y) => <span>Alternately, if we chose ({x},{y}) to be P₁, we would have</span>
    finalText = 'Observe that the sign changes for both ΔX and ΔY.';
    egP1Text = (x, y) => <span>P₁(x₁, y₁) is ({x}, {y}).</span>
    egP2Text = (x, y) => <span>And P₂(x₂, y₂) is ({x}, {y}).</span>

    constructor(props) {
        super(props)

        this.state = {
            showDelXValue: false,
            showDelYValue: false,
            showErrorMessage: false,
            currentSubStep: 0,
            showText2: false,
            showText3: false,
            showText4: false,
            isContentAvailable: false,
            focusInput: false,
        }

        this.coordinate1 = React.createRef();
        this.coordinate2 = React.createRef();
        this.nextRef = React.createRef();
        this.delValue = {}
        this.points = {p1: {}, p2: {}}
        this.currentPoint1 = null;
        this.currentPoint2 = null;
    }

    componentDidMount() {
        this._isMounted = true;
        const previousPoints = this.props.tutorialState;
        this.points = this.swapPoints(previousPoints);
        this.setState({isContentAvailable: true})
        const graph = this.props.graph;

        graph.reset(simpleAxesDef);
        this.addPoints(graph)
        this.annotatePoints(this.points, graph);
    }

    componentDidUpdate() {
        if(this.coordinate2.current) {
            if(this.state.focusInput) {
                this.coordinate2.current.focus();
            } else {
                this.coordinate2.current.blur();
                this.nextRef.current && this.nextRef.current.focus();
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    swapPoints(data) {
        return {p1: data.points.p2, p2: data.points.p1}
    }

    annotatePoints(points, graph) {
        const p1 = { x: points.p1.x, y: points.p1.y}
        const p2 = { x: points.p2.x, y: points.p2.y}
        graph.annotatePoint(`P1(${p1.x}, ${p1.y})`, p1, colorPalette[1])
        graph.annotatePoint(`P2(${p2.x}, ${p2.y})`, p2, colorPalette[1])
    }

    addPoints(graph) {

        const x1 = this.points.p1.x;
        const y1 = this.points.p1.y;
        const x2 = this.points.p2.x;
        const y2 = this.points.p2.y;

        if (this.currentPoint1) {
            graph.removePoint(this.currentPoint1);
        }

        this.currentPoint1 = graph.addPoint({ x: x1, y: y1 }, 5, {
            fill: colorPalette[1],
        })

        if (this.currentPoint2) {
            graph.removePoint(this.currentPoint2);
        }

        this.currentPoint2 = graph.addPoint({ x: x2, y: y2 }, 5, {
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
                this._isMounted && this.setState({ 
                    focusInput: true,
                    showText2: true
                })
                break
            case 2:
                if (this.coordinate2.current.value == this.points.p2.x && this.coordinate1.current.value == this.points.p1.x) {
                    this.delValue.x = this.coordinate2.current.value - this.coordinate1.current.value
                    this._isMounted && this.setState({
                        focusInput: false,
                        showDelXValue: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({
                        showErrorMessage: true,
                    })
                }
                break
            case 3:
                this._isMounted && this.setState({ 
                    focusInput: true,
                    showText3: true
                })
                break
            case 4:
                if (this.coordinate2.current.value == this.points.p2.y && this.coordinate1.current.value == this.points.p1.y) {
                    this.delValue.y = this.coordinate2.current.value - this.coordinate1.current.value
                    this._isMounted && this.setState({
                        focusInput: false,
                        showDelYValue: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({
                        showErrorMessage: true,
                    })
                }
                break
            case 5:
                this._isMounted && this.setState({ showText4: true })
                break
            case 6:
                this.props.onStepComplete(this.props.tutorialState);
                break
            default:
                console.log('handleContent executed & in here currentSubStep = ', currentSubStep)
                break
        }
    }

    subActionStep1() {
        return <div>
            <StepAction> 
                ΔX= x₂ - x₁ = (<NumberInput ref={this.coordinate2} />) - (<NumberInput ref={this.coordinate1} />)​ 
                {this.state.showDelXValue ? (<span> = {this.delValue.x} </span>) : null}
            </StepAction>
        </div>
    }

    subActionStep2() {
        return <div>
            <StepAction> ΔY= y₂ - y₁ = (<NumberInput ref={this.coordinate2} />) - (<NumberInput ref={this.coordinate1} />)​ {this.state.showDelYValue ? (<span> = {this.delValue.y} </span>) : null}</StepAction>
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
        var text1Element = <div></div>;
        var text2Element = <div></div>;
        var text3Element = <div></div>;
        var text4Element = <div></div>;
        var enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />;
        const text1 = this.text1(this.points.p1.x, this.points.p1.y)
        const text2 = this.egP1Text(this.points.p1.x, this.points.p1.y)
        const text3 = this.egP2Text(this.points.p2.x, this.points.p2.y)

        if (this.state.isContentAvailable) {
            text1Element = <div>
            <StepContent>{text1}</StepContent>
                <Block>
                    <StepContent>{text2}</StepContent>
                    <StepContent>{text3}</StepContent>
                </Block>
            </div>
        }

        if (this.state.showText2) {
            text2Element = <div>
                <Block>
                    <StepContent>So,</StepContent>
                    {this.subActionStep1()}
                </Block>
            </div>
        }

        if (this.state.showText3) {
            text3Element = <div>
                <Block>
                    {this.subActionStep2()}
                </Block>
            </div>
        }

        if (this.state.showText4) {
            text4Element = <div>
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
                {text4Element}

                {this.state.showErrorMessage ? this.errorMessage() : null}

                {enterButton}
            </TutorialContainer>
        )
    }
}