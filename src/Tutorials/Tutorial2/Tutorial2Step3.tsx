import * as React from "react"

import { SidebarDivider } from '../../Common';

import { NumberInput }from '../../Input';

import {
  colorPalette,
} from '../../Common';

import {
  StepContent,
  StepAction,
  Bold,
  Block,
  TutorialStepProps,
  TutorialContainer,
  EnterButton,
} from '../Common';

interface Tutorial2Step1State {
  showErrorMessage: boolean
}

export default class Tutorial3Step1 extends React.Component<TutorialStepProps, Tutorial2Step1State> {
  xRef: React.RefObject<NumberInput>
  yRef: React.RefObject<NumberInput>

  constructor(props) {
    super(props)

    this.state = {
      showErrorMessage: false
    }

    this.xRef = React.createRef();
    this.yRef = React.createRef();
  }

  componentDidUpdate() {
    if(this.xRef.current) {
      this.xRef.current.focus();
    }
  }

  onNextButton() {
    const x = this.xRef.current.value;
    const y = this.yRef.current.value;
    const p = {x: 7, y: 9};

    if(x == p.x && y === p.y) {
      this.props.onStepComplete({})
    } else {
      this.setState({
        showErrorMessage: true
      })
    }
  }

  subStep1() {
    return <div>
      <StepAction>Input the coordinates of the point P below.</StepAction>
      <Block>
        <StepAction>
          (<NumberInput ref={this.xRef} />, <NumberInput ref={this.yRef} />)
        </StepAction>
      </Block>
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
    return (
      <TutorialContainer>
        {this.subStep1()}

        {this.state.showErrorMessage ? this.errorMessage() : null}

        <EnterButton onClick={this.onNextButton.bind(this)} />
      </TutorialContainer>
    )
  }
}

