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
    showText4: boolean;
    showText5: boolean;
    showText6: boolean;
    selectedP1: any;
    selectedPoints: any;
    isP1Selected: boolean;
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

    text1 = 'Slope between two points is defined as ΔY/ΔX.';
    text2 = 'This is independent of which point is P1 and which one is P2.';
    text3 = <span>For example,  <Highlight>in the given two points choose one as P1 and click on it.​</Highlight></span>
    text4 = (p1, p2) => <span>Thus <StepAction>P₁(x₁,y₁) is ({p1.x}, {p1.y})</StepAction> and <StepAction>P₂(x₂,y₂) is ({p2.x}, {p2.y})</StepAction></span>

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
            showText6: false,
            selectedP1: {},
            selectedPoints: {},
            isP1Selected: false,
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
        const graph = this.props.graph;

        this.input1.current && this.input1.current.focus();

        graph.reset(simpleAxesDef);
        this.generatePoints(graph)
    }

    componentDidUpdate() {
        const graph = this.props.graph;

        if (this.state.showText3) {
            graph.setOnClickHandler((x, y) => {
                this.onGraphClicked({ x: x, y: y }, graph);
            })
        }

        if (this.state.isP1Selected) {
            this.annotateGraphPoints(graph);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    calculateSlope() {
        const delY = this.state.selectedPoints.p2.y - this.state.selectedPoints.p1.y;
        const delX = this.state.selectedPoints.p2.x - this.state.selectedPoints.p1.x;

        const slope = parseFloat((delY/delX).toFixed(3))

        this.setState({ slope: slope})
    }

    annotateGraphPoints(graph) {
        const p1 = { x: this.state.selectedPoints.p1.x, y: this.state.selectedPoints.p1.y}
        const p2 = { x: this.state.selectedPoints.p2.x, y: this.state.selectedPoints.p2.y}
        graph.annotatePoint(`P1(${p1.x}, ${p1.y})`, p1, colorPalette[1])
        graph.annotatePoint(`P2(${p2.x}, ${p2.y})`, p2, colorPalette[1])
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

        this.graphPoints =  { p1: {x: x1, y: y1}, p2: {x: x2, y: y2} }

        if (this.point1Position) {
            graph.removePoint(this.point1Position);
        }

        this.point1Position = graph.addPoint({ x: x1, y: y1 }, 5, {
            fill: colorPalette[1],
        })

        if (this.point2Position) {
            graph.removePoint(this.point2Position);
        }

        this.point2Position = graph.addPoint({ x: x2, y: y2 }, 5, {
            fill: colorPalette[1],
        })
    }

    onGraphClicked(point, graph) {
        const p = graph.snapToGrid(point);
        this.setState({
            selectedP1: p,
        })

        if (this.state.selectedP1.x == this.graphPoints.p1.x && this.state.selectedP1.y == this.graphPoints.p1.y) {
            this._isMounted && this.setState({ 
                selectedPoints:{ p1: this.graphPoints.p1, p2: this.graphPoints.p2 },
                isP1Selected: true
            })
        } else if ((this.state.selectedP1.x == this.graphPoints.p2.x && this.state.selectedP1.y == this.graphPoints.p2.y)) {
            this._isMounted && this.setState({
                selectedPoints: { p1: this.graphPoints.p2, p2: this.graphPoints.p1 },
                isP1Selected: true
            })
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
                this.calculateSlope();
                this._isMounted && this.setState({ showText4: true })
                break
            case 4:
                if(this.checkInputs()) {
                    this._isMounted && this.setState({ 
                        showText5: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({ showErrorMessage: true })
                }
                break
            case 5:
                this.props.onStepComplete({points: this.state.selectedPoints});
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
        return (this.input1.current.value == this.state.selectedPoints.p2.y - this.state.selectedPoints.p1.y)
    }

    check2ndInput() {
        return (this.input2.current.value == this.state.selectedPoints.p2.x - this.state.selectedPoints.p1.x)
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
        let text2Element = <div></div>;
        let text3Element = <div></div>;
        let text4Element = <div></div>;
        let text5Element = <div></div>;
        let text6Element = <div></div>;
        let enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />;

        if(this.state.showText2) {
            text2Element = <div>
                <Block>
                    <StepContent>{this.text2}</StepContent>
                </Block>
            </div>
        }

        if(this.state.showText3) {
            text3Element = <div>
                <Block>
                    <StepContent>{this.text3}</StepContent>
                </Block>
            </div>

            enterButton = <div></div>
        }

        if(this.state.isP1Selected) {
            const text4 = this.text4(this.state.selectedPoints.p1, this.state.selectedPoints.p2)
            text4Element = <div>
                <Block>
                    <StepContent>{text4}</StepContent>
                </Block>
            </div>

            enterButton = <EnterButton ref={this.nextRef} onClick={this.onNextButton.bind(this)} />
        }

        if(this.state.showText4) {
            text5Element = <div>
                <Block>
                    <StepContent>So, {this.subActionStep1()}</StepContent>
                </Block>
            </div>
        }

        if(this.state.showText5) {
            text6Element = <div>
                <Block>
                    <StepContent>=> <StepAction>Slope = {this.state.slope}</StepAction></StepContent>
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