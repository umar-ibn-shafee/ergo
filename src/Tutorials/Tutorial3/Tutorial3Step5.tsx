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
    yCordinate: number;
    currentSubStep: number;
    highlightContent: boolean;
    showErrorMessage: boolean;
    isActiveText1: boolean;
    showText2: boolean;
    showText3: boolean;
    showText4: boolean;
    showText5: boolean;
    errorNum: number;
}

export default class Tutorial3Step5 extends React.Component<TutorialStepProps, Tutorial3Step3State> {
    xRef: React.RefObject<NumberInput>;
    yRef: React.RefObject<NumberInput>;
    p: { x: number, y: number };
    equationLHS: React.RefObject<TextInput>;
    equationRHS: React.RefObject<NumberInput>;
    points: Array<{ x: number, y: number }>;
    _isMounted: boolean;

    text1 = <span>Similarly, consider L<sub>H</sub>, the horizontal line shown.</span>;
    text2 = <span>We observe that the Y coordinate is the same for every point on L<sub>​H</sub>.​</span>;
    text3 = (value) => <span>That means, every point on L​ satisfies the equation ​<Highlight>y = {value}​</Highlight></span>;

    actionText = <span>Click on any four points on L<sub>​H</sub></span>;

    constructor(props) {
        super(props)

        this.state = {
            yCordinate: 0,
            currentSubStep: 0,
            highlightContent: false,
            showErrorMessage: false,
            isActiveText1: true,
            showText2: false,
            showText3: false,
            showText4: false,
            showText5: false,
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
        const horizantalY = -c / b
        this.points = [];
        var points = this.points;

        this._isMounted && this.setState({ yCordinate: horizantalY })

        graph.reset({
            xl: -280,
            xh: 280,
            yl: -230,
            yh: 230,
            subTickSize: 10,
            numSubticksPerTick: 5,
        });

        graph.drawLine([a, b, c], null, lineAttr)

        graph.setOnClickHandler((x, y) => {

            if (Math.round(y) == this.state.yCordinate) {
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
                    this._isMounted && this.setState({
                        showText2: true,
                    })
                }
            } else {
                graph.addPoint({ x, y }, 5, {
                    "fill": colorPalette[9],
                })
            }
        })
    }

    componentDidUpdate() {
        if (this.xRef.current) {
            this.xRef.current.focus();
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
                this._isMounted && this.setState({ showText3: true })
                break
            case 2:
                const y = this.yRef.current.value;
                if (y == this.state.yCordinate) {
                    this._isMounted && this.setState({
                        showText4: true,
                        showErrorMessage: false
                    })
                } else {
                    this._isMounted && this.setState({
                        showErrorMessage: true,
                        errorNum: 1
                    })
                }
                break
            case 3:
                this._isMounted && this.setState({ showText5: true })
                break
            case 4:
                if (this.equationLHS.current.value == 'y' && this.equationRHS.current.value == this.state.yCordinate) {
                    this.props.onStepComplete(this.props.tutorialState);
                    this._isMounted && this.setState({ showErrorMessage: false })
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
            <StepAction greyOut={this.state.showText4}>So,for any point (x,y) on L<sub>H</sub>​ , y = (<NumberInput ref={this.yRef} />)</StepAction>
        </div>
    }

    subActionStep2() {
        return <div>
            <StepAction>Therefore,the equation of L<sub>H</sub> is (<TextInput ref={this.equationLHS} />) = (<NumberInput ref={this.equationRHS} />)</StepAction>
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
                <Bold>Wrong! Observe that the equation is written as y={this.state.yCordinate}.</Bold>
                <Bold> Try Again.</Bold>
            </StepContent>
        </Block>;
    }

    render() {
        var text2Element = <div></div>;
        var text3Element = <div></div>;
        var text4Element = <div></div>;
        var text5Element = <div></div>;
        var enterButton = <div></div>;
        const text3 = this.text3(this.state.yCordinate)

        if (this.state.showText2) {
            text2Element = <div>
                <SidebarDivider />
                <StepContent>{this.text2}</StepContent>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
        }

        if (this.state.showText3) {
            text3Element = <div>
                <Block>
                    {this.subActionStep1()}
                </Block>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
        }

        if (this.state.showText4) {
            text4Element = <div>
                <SidebarDivider />
                <StepContent>{text3}</StepContent>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
        }

        if (this.state.showText5) {
            text5Element = <div>
                <Block>
                    {this.subActionStep2()}
                </Block>
            </div>

            enterButton = <EnterButton onClick={this.onNextButton.bind(this)} />
        }

        return (
            <TutorialContainer>
                <StepContent>{this.text1}</StepContent>
                <Block>
                    <StepAction greyOut={this.state.showText2}>{this.actionText}</StepAction>
                </Block>

                {text2Element}
                {text3Element}
                {text4Element}
                {text5Element}

                {this.state.showErrorMessage ? (this.state.errorNum == 1 ? this.errorMessage1() : this.errorMessage2()) : null}

                {enterButton}
            </TutorialContainer>
        )
    }
}

