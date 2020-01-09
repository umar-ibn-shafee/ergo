import * as React from "react"

import { TutorialStepProps, StepAction, TutorialContainer, StepContent, EnterButton, Block, Bold, Highlight } from '../Common'
import { NumberInput } from "../../Input";
import { getRandomSample, colorPalette } from "../../Common";

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
    showText5: boolean;
    errorNum: number;
    isP1Selected: boolean
}

export default class Tutorial4Step1 extends React.Component<TutorialStepProps, Tutorial4Step1State>{
    coordinate1: React.RefObject<NumberInput>;
    coordinate2: React.RefObject<NumberInput>;
    delValue: any;
    points: any;
    currentPoint1: any;
    currentPoint2: any;
    selectedP1: any;

    _isMounted: boolean;

    text1 = 'Before we go to other line equations, we learn about ΔX and ΔY.';
    text2 = 'For two given points P​₁(x₁​, y₁) and P₂​(x₂​, y₂),';
    delXFormula = 'ΔX = x​₂ - x​₁'
    delYFormula = 'ΔY = y₂ - y​₁'
    egText = <span>For example, consider the points shown. <Highlight>Choose either of them to be P₁ and click on it.​</Highlight></span>
    egP1Text = (x, y) => <span>Thus, P₁(x₁, y₁) is ({x}, {y}).</span>
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
            showText5: false,
            errorNum: 1,
            isP1Selected: false
        }
        this.coordinate1 = React.createRef();
        this.coordinate2 = React.createRef();
        this.points = {};
        this.delValue = {}
        this.selectedP1 = {};

        this.currentPoint1 = null;
        this.currentPoint2 = null;
    }

    componentDidMount() {
        this._isMounted = true;
        const graph = this.props.graph;

        graph.reset(simpleAxesDef);
        this.generatePoints(graph)
    }

    componentDidUpdate() {
        const graph = this.props.graph;

        if (this.coordinate2.current) {
            this.coordinate2.current.focus();
        }
        if (this.state.showText3) {
            graph.setOnClickHandler((x, y) => {
                this.onGraphClicked({ x: x, y: y }, graph);
            })
        }

        if (this.state.isP1Selected) {
            const p1 = { x: this.points.p1.x, y: this.points.p1.y}
            const p2 = { x: this.points.p2.x, y: this.points.p2.y}
            graph.annotatePoint(`P1(${p1.x}, ${p1.y})`, p1, colorPalette[1])
            graph.annotatePoint(`P2(${p2.x}, ${p2.y})`, p2, colorPalette[1])
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    swapPoints(data) {
        return {p1: data.points.p2, p2: data.points.p1}
    }

    generatePoints(graph) {

        const xTicks = graph.xTicks();
        const xRange = xTicks.slice(2, xTicks.length - 2);

        const yTicks = graph.yTicks();
        const yRange = yTicks.slice(2, yTicks.length - 2);

        const x1 = getRandomSample(xRange);
        const y1 = getRandomSample(yRange);
        const x2 = getRandomSample(xRange);
        const y2 = getRandomSample(yRange);

        this.points.p1 = { x: x1, y: y1 }
        this.points.p2 = { x: x2, y: y2 }

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

    onGraphClicked(point, graph) {
        const p = graph.snapToGrid(point);
        this.selectedP1 = p;

        if (this.selectedP1.x == this.points.p1.x && this.selectedP1.y == this.points.p1.y) {
            this._isMounted && this.setState({ isP1Selected: true })
        } else if ((this.selectedP1.x == this.points.p2.x && this.selectedP1.y == this.points.p2.y)) {
            let temp = this.points.p1
            this.points.p1 = this.points.p2
            this.points.p2 = temp
            this._isMounted && this.setState({ isP1Selected: true })
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
                this._isMounted && this.setState({ showText3: true })
                break
            case 3:
                this._isMounted && this.setState({ showText4: true })
                break
            case 4:
                if (this.coordinate2.current.value == this.points.p2.x && this.coordinate1.current.value == this.points.p1.x) {
                    this.delValue.x = this.coordinate2.current.value - this.coordinate1.current.value
                    this._isMounted && this.setState({
                        showDelXValue: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({
                        showErrorMessage: true,
                        errorNum: 2
                    })
                }
                break
            case 5:
                this._isMounted && this.setState({ showText5: true })
                break
            case 6:
                if (this.coordinate2.current.value == this.points.p2.y && this.coordinate1.current.value == this.points.p1.y) {
                    this.delValue.y = this.coordinate2.current.value - this.coordinate1.current.value
                    this._isMounted && this.setState({
                        showDelYValue: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({
                        showErrorMessage: true,
                        errorNum: 2
                    })
                }
                break
            case 7:
                this.props.onStepComplete({points: this.points});
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

    errorMessage1() {
        return <Block>
            <StepContent highlight={true}>
                <Bold>Select any one point to consider as P₁.</Bold>
            </StepContent>
        </Block>;
    }

    errorMessage2() {
        return <Block>
            <StepContent highlight={true}>
                <Bold>Wrong, Try Again!</Bold>
            </StepContent>
        </Block>;
    }

    render() {
        var text2Element = <div></div>;
        var text3Element = <div></div>;
        var text4Element = <div></div>;
        var text5Element = <div></div>;
        var text6Element = <div></div>;
        var enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />;

        if (this.state.showText2) {
            text2Element = <div>
                <Block>
                    <StepContent>{this.text2}</StepContent>
                    <Block>
                        <StepContent>{this.delXFormula}</StepContent>
                        <StepContent>{this.delYFormula}</StepContent>
                    </Block>
                </Block>
            </div>
        }

        if (this.state.showText3) {
            text3Element = <div>
                <Block>
                    <StepContent>{this.egText}</StepContent>
                </Block>
            </div>

            enterButton = <div></div>
        }

        if (this.state.isP1Selected) {
            const text4 = this.egP1Text(this.points.p1.x, this.points.p1.y)
            const text5 = this.egP2Text(this.points.p2.x, this.points.p2.y)
            text4Element = <div>
                <Block>
                    <StepContent>{text4}</StepContent>
                    <StepContent>{text5}</StepContent>
                </Block>
            </div>
        
            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />;    
        }

        if (this.state.showText4) {
            text5Element = <div>
                <Block>
                    <StepContent>So,</StepContent>
                    {this.subActionStep1()}
                </Block>
            </div>
        }

        if (this.state.showText5) {
            text6Element = <div>
                <Block>
                    {this.subActionStep2()}
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

                {this.state.showErrorMessage ? (this.state.errorNum == 1 ? this.errorMessage1() : this.errorMessage2()) : null}

                {enterButton}
            </TutorialContainer>
        )
    }
}