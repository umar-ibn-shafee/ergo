import * as React from "react"
import Grid from '@material-ui/core/Grid';
import {  GridSpacing } from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import correctIcon from '../Images/CorrectIcon.svg'

import ErgoTooltip from '../Tooltip'

import Graph from '../Graph'

import { LevelDefinition } from '../Levels'

import {
  SidebarDivider,
  colorPalette
} from '../Common'

import {
  SidebarGrid,
  FooterGridItem
} from './Common'

interface LevelSidebarState {
  currentQuestion: any;
  questionNumber: number;
  questionLevel: number;
  result: boolean;
  showCorrectIcon: boolean;
}

interface LevelSidebarProps<QuestionType> {
  graph: Graph;
  onLevelComplete: (result: boolean) => void;
  backToMenu: () => void;
  levelDef: LevelDefinition<QuestionType>;
}

function LevelFooter(props: any) {
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
  } as React.CSSProperties;

  const baseStyle = {
    width: "60px",
    height: "45px",
    backgroundColor: colorPalette[5],
  }

  const firstBlockStyle = {
    marginRight: "3px",
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px",
  } as React.CSSProperties;

  const middleBlockStyle = {
    marginRight: "3px",
  } as React.CSSProperties;

  const lastBlockStyle = {
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
  } as React.CSSProperties;

  var blocks = []

  for(var i = 0; i < 5; i++) {
    var style = Object.assign({}, baseStyle);

    if(i == 0) {
      style = Object.assign(style, firstBlockStyle)
    } else if(i == 4) {
      style = Object.assign(style, lastBlockStyle)
    } else {
      style = Object.assign(style, middleBlockStyle)
    }

    if(!props.result && i <= props.questionNumber) {
      style.backgroundColor = colorPalette[9]
    } else {
      if(i == props.questionNumber) {
        style.backgroundColor = colorPalette[12]
      } else if (i < props.questionNumber) {
        style.backgroundColor = colorPalette[8]
      }
    }

    blocks.push(<div key={`block-${i}`} style={style}></div>)
  }

  const footerHelpText = "Marked in yellow here is the current question. You need to correctly answer 5 consecutive questions to clear this level."

  return <ErgoTooltip placement="top" open={true} text={footerHelpText}>
    <div style={containerStyle}>
      {blocks}
    </div>
  </ErgoTooltip>
}

interface QuestionProps<QuestionType> {
  graph: Graph;
  notifyResult: (numAttempt: number, result: boolean) => void
  questionNumber: number;
  questionLevel: number;
  question: QuestionType;
  levelDef: LevelDefinition<QuestionType>
}

interface QuestionState {
  numAttempts: number;
}

class Question<QuestionType> extends React.Component<QuestionProps<QuestionType>, QuestionState> {
  timer: any;

  constructor(props) {
    super(props)

    this.state = {
      numAttempts: 0,
    }
    this.timer = null;
  }

  componentDidMount() {
    const graph = this.props.graph;
    const levelDef = this.props.levelDef;

    graph.setOnClickHandler((x, y) => {
      levelDef.onGraphClicked({x: x, y: y}, graph);
    })

    this.timer = setInterval(() => {
      this.setState({}) // Temporary hack to revaluate sidebar whenever something changes on the graph
    }, 1000)
  }

  componentWillUnmount() {
    this.props.graph.setOnClickHandler(null);
    clearInterval(this.timer);
    this.timer = null;
  }

  handleConfirmAnswer() {
    const question = this.props.question;
    const graph = this.props.graph;
    const levelDef = this.props.levelDef;
    const isCorrect = levelDef.validateAnswer(question, graph);

    levelDef.onAnswer(isCorrect, graph);

    if(isCorrect) {
      this.props.notifyResult(0, true)

      this.setState({
        numAttempts: 0,
      })
    } else {
      const numAttempts = this.state.numAttempts

      this.props.notifyResult(numAttempts + 1, false)
      
      if(numAttempts < 2) {
        if(numAttempts == 0) {
          levelDef.showHint1(question, graph);
        } else if (numAttempts == 1) {
          levelDef.showHint2(question, graph);
        } 

        this.setState({
          numAttempts: numAttempts + 1,
        })
      } else {
        levelDef.onLevelFailed(question, graph);
      }
    }
  }

  render() {
    const questionLevel = this.props.questionLevel;
    const question = this.props.question;
    const levelDef = this.props.levelDef;
    const helpText = levelDef.helpText(questionLevel);
    const firstClue = levelDef.firstClue(question, questionLevel);
    const secondClue = levelDef.secondClue(question, questionLevel);
    const numAttempts = this.state.numAttempts;

    const WrongAnswerCard = withStyles({
      root: {
        borderRadius: 10,
        boxShadow: "none",
        backgroundColor: colorPalette[9],
        alignSelf: "center",
        color: "white",
        fontSize: "12px",
        fontWeight: 400,
      }
    })(Card)

    const HelpCard = withStyles({
      root: {
        borderRadius: 10,
        boxShadow: "none",
        backgroundColor: colorPalette[12],
        alignSelf: "center",
        fontSize: "12px",
        fontWeight: 400,
      }
    })(Card)

    const Content = withStyles({
      root: {
        marginBottom: "-8px"
      }
    })(CardContent)

    var resultElement = <div></div>;

    if(numAttempts == 0 && helpText) {
      resultElement = <HelpCard>
        <Content> {helpText} </Content>
      </HelpCard>
    } else if(numAttempts == 1) {
      resultElement = <WrongAnswerCard>
        <Content> {firstClue} </Content>
      </WrongAnswerCard>
    }  else if(numAttempts >= 2) {
      resultElement = <WrongAnswerCard>
        <Content> {secondClue} </Content>
      </WrongAnswerCard>
    }

    const confirmButtonHelpText = "To confirm your answer, click here or press return / enter key on the keyboard"
    const questionText = levelDef.generateQuestionText(question)
    const confirmEnabled = levelDef.shouldEnableConfirmButton();

    return (
      <Grid spacing={8} direction="column" container>
        <Grid item>
          <span style={{color: colorPalette[13], fontWeight: 600}}>
             <span style={{fontSize: "40px"}}>{this.props.questionNumber + 1}.</span>
             <span style={{fontSize: "18px", marginLeft: "10px"}}>{questionText}</span>
          </span>
        </Grid>

        <Grid item>
          {levelDef.renderAnswerField(question)}
        </Grid>

        <Grid item>
          <ErgoTooltip placement="right" open={false} text={confirmButtonHelpText}>
            <Button variant="outlined" disabled={!confirmEnabled} onClick={this.handleConfirmAnswer.bind(this)}>
              Confirm Answer
            </Button>
          </ErgoTooltip>
        </Grid>
        
        <Grid item>
          <SidebarDivider />
        </Grid>

        <Grid item>
          {resultElement}
        </Grid>
      </Grid>
    )
  }
};
export default class LevelSidebar<QuestionType> extends React.Component<LevelSidebarProps<QuestionType>, LevelSidebarState> {
  constructor(props) {
    super(props);
    const levelDef = this.props.levelDef;

    levelDef.prepareGraphForQuestion(0, props.graph);

    this.state = {
      currentQuestion: levelDef.generateQuestion(0, props.graph),
      showCorrectIcon: false,
      questionNumber: 0,
      questionLevel: 0,
      result: true
    }
  }

  notifyResult(numAttempts: number, result: boolean) {
    const levelDef = this.props.levelDef;

    if(numAttempts == 3) {
      this.props.onLevelComplete(false)
    } else {
      if(result) {
        if(this.state.questionNumber == 4) {
          this.props.onLevelComplete(true)
        } else {
          const questionNumber = this.state.questionNumber + 1;
          const questionLevel = this.state.questionLevel + 1;

          levelDef.prepareGraphForQuestion(questionLevel, this.props.graph);

          this.setState({
            questionNumber: questionNumber,
            questionLevel: questionLevel,
            result: result,
            showCorrectIcon: true,
            currentQuestion: levelDef.generateQuestion(questionLevel, this.props.graph),
          })

          setTimeout(() => {
            this.setState({ showCorrectIcon: false })
          }, 2000)
        }
      } else {
        this.setState({
          showCorrectIcon: false,
          result: result,
        })

        if(numAttempts > 0) {
          setTimeout(() => {
            this.setState({questionNumber: 0, result: true})
          }, 2000)
        }
      }
    }
  }

  render() {
    const levelDef = this.props.levelDef; 
    const correctIconStyle = {
      width: "100px",
      height: "100px", 
      marginTop: "100px",
      marginLeft: "100px",
    }

    var resultElement = <div></div>;

    if(this.state.showCorrectIcon) {
      resultElement = <img src={correctIcon} style={correctIconStyle}></img>
    }

    return (
      <SidebarGrid direction="column" justify="flex-start" spacing={Number(16) as GridSpacing} container>
        <Grid item>
          <Question graph={this.props.graph}
                    notifyResult={this.notifyResult.bind(this)}
                    levelDef={this.props.levelDef}
                    questionNumber={this.state.questionNumber}
                    questionLevel={this.state.questionLevel}
                    question={this.state.currentQuestion} />
        </Grid>

        <Grid item>
          {resultElement}
        </Grid>

        <FooterGridItem item>
          <LevelFooter questionNumber={this.state.questionNumber} result={this.state.result}/>
        </FooterGridItem>
      </SidebarGrid>
    )
  }
}
