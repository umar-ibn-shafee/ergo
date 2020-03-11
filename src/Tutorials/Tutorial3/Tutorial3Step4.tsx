import * as React from "react"

import { NumberInput, TextInput } from '../../Input'

import { SidebarDivider, colorPalette } from '../../Common';

import {
    StepContent,
    StepAction,
    Bold,
    Block,
    TutorialStepProps,
    TutorialContainer,
    EnterButton,
    lineAttr,
    Highlight,
} from '../Common';

interface Tutorial3Step3State {
    xCordinate: number;
    currentSubStep: number;
    highlightContent: boolean;
    showErrorMessage: boolean;
    showText2: boolean;
    showText3: boolean;
    showText4: boolean;
    showText5: boolean;
    showText6: boolean;
    errorNum: number;
}

export default class Tutorial3Step4 extends React.Component<TutorialStepProps, Tutorial3Step3State> {
    xRef: React.RefObject<NumberInput>;
    yRef: React.RefObject<NumberInput>;
    p: { x: number, y: number };
    equationLHS: React.RefObject<TextInput>;
    equationRHS: React.RefObject<NumberInput>;
    points: Array<{ x: number, y: number }>;
    _isMounted: boolean;

    text1 = "The simplest line equations are of vertical and horizontal lines.";
    text2 = "For example, consider the vertical line Lᵥ shown.";
    text3 = "We observe that the X coordinate is the same for every point on Lᵥ.";
    text4 = (value) => <span>That means,every point on Lᵥ satisfies the equation ​<Highlight>x = {value}​</Highlight></span>;

    actionText = "Click on any four points on Lᵥ";

    constructor(props) {
        super(props)

        this.state = {
            xCordinate: 0,
            currentSubStep: 0,
            highlightContent: false,
            showErrorMessage: false,
            showText2: false,
            showText3: false,
            showText4: false,
            showText5: false,
            showText6: false,
            errorNum: 1
        }

        this._isMounted = false;

        this.xRef = React.createRef()
        this.yRef = React.createRef()

        this.equationLHS = React.createRef()
        this.equationRHS = React.createRef()
        this.points = [];
    }

    componentDidMount() {
        this._isMounted = true;
        const graph = this.props.graph;
        const [a, b, c] = this.props.contents.equation;
        const verticalX = -c / a
        this._isMounted && this.setState({ xCordinate: verticalX })


        graph.reset({
            xl: -280,
            xh: 280,
            yl: -230,
            yh: 230,
            subTickSize: 10,
            numSubticksPerTick: 5,
        });

        graph.drawLine([a, b, c], null, lineAttr)
    }

    componentDidUpdate() {
        const graph = this.props.graph;
        this.points = [];
        var points = this.points;

        if (this.xRef.current) {
            this.xRef.current.focus();
        }
        if (this.state.showText2) {
            graph.setOnClickHandler((x, y) => {

                if (Math.round(x) == this.state.xCordinate) {
                    const x1 = Math.round(x);
                    const y1 = Math.round(y);

                    const q = { x: x1, y: y1 };

                    const point = graph.addPoint(q, 5, {
                        "fill": colorPalette[1],
                    })

                    const i = points.length;
                    graph.annotatePoint(`P${i + 1}(${q.x}, ${q.y})`, q, colorPalette[1])

                    points.push(q);

                    if (points.length == 4) {
                        graph.setOnClickHandler(null);
                        this._isMounted && this.setState({ showText3: true })
                    }
                } else {
                    graph.addPoint({ x, y }, 5, {
                        "fill": colorPalette[9],
                    })
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
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
                this._isMounted && this.setState({ showText4: true })
                break
            case 3:
                const x = this.xRef.current.value;
                if (x == this.state.xCordinate) {
                    this._isMounted && this.setState({
                        showText5: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({
                        showErrorMessage: true,
                        errorNum: 1
                    })
                }
                break
            case 4:
                this._isMounted && this.setState({ showText6: true })
                break
            case 5:
                if (this.equationLHS.current.value == 'x' && this.equationRHS.current.value == this.state.xCordinate) {
                    this.props.onStepComplete(this.props.tutorialState);
                } else {
                    this._isMounted && this.setState({
                        showErrorMessage: true,
                        errorNum: 2
                    })
                }
                break
            default:
                console.log('handleContent executed & in here currentSubStep = ', currentSubStep)
                break
        }
    }

    subActionStep1() {
        return <div>
            <StepAction greyOut={this.state.showText5}>So,for any point (x,y) on Lᵥ​ , x = (<NumberInput ref={this.xRef} />)</StepAction>
        </div>
    }

    subActionStep2() {
        return <div>
            <StepAction>Therefore,the equation of Lᵥ​ is (<TextInput ref={this.equationLHS} />) = (<NumberInput ref={this.equationRHS} />)</StepAction>
        </div>
    }

    errorMessage1() {
        return <Block>
            <StepContent highlight={true}>
                <Bold>Wrong, Try Again!</Bold>
            </StepContent>
        </Block>;
    }

    errorMessage2() {
        return <Block>
            <StepContent highlight={true}>
                <Bold>Wrong! Observe that the equation is written as x={this.state.xCordinate}.</Bold>
                <Bold> Try Again.</Bold>
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
        const text4 = this.text4(this.state.xCordinate)

        if (this.state.showText2) {
            text2Element = <div>
                <Block>
                    <StepContent>{this.text2}</StepContent>
                    <Block>
                        <StepAction greyOut={this.state.showText3}>{this.actionText}</StepAction>
                    </Block>
                </Block>
            </div>

            enterButton = <div></div>
        }

        if (this.state.showText3) {
            text3Element = <div>
                <SidebarDivider />
                <StepContent>{this.text3}</StepContent>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
        }

        if (this.state.showText4) {
            text4Element = <div>
                <Block>
                    {this.subActionStep1()}
                </Block>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
        }

        if (this.state.showText5) {
            text5Element = <div>
                <SidebarDivider />
                <StepContent>{text4}</StepContent>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
        }

        if (this.state.showText6) {
            text6Element = <div>
                <Block>
                    {this.subActionStep2()}
                </Block>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
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

