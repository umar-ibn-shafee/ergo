import * as React from "react"
import * as d3 from "d3";
import 'd3-selection-multi'

import mainMenuSvg from './Images/MainMenu.svg'
import { colorPalette, GameMode } from './Common'

interface MainMenuProps {
  completedUpto: number;
  showTutorial: boolean;
  selectLevel: (mode: GameMode, levelNumber: number) => void;
}

export default class MainMenu extends React.Component<MainMenuProps, {}> {
  menuRef: React.RefObject<HTMLDivElement>
  svg: any;

  constructor(props) {
    super(props);

    this.menuRef = React.createRef();
  }

  componentDidMount() {
    var element = this.menuRef.current

    d3.svg(mainMenuSvg).then((xml) => {
      var importedNode = document.importNode(xml.documentElement, true);

      d3.select(element)
        .each(function() {
          this.appendChild(importedNode);
        })

      this.svg = d3.select(element)
        .select("svg")
        .attr("width", "100%")

      this.setupSvg();
    })
  }

  convertToButton(button, onClickHandler) {
    button.styles({"cursor": "pointer"})
          .on("click", onClickHandler)
  }

  setupPreviousLevel(levelNo) {
    const svg = this.svg;

    svg.select(`#Lock${levelNo}`).remove()
    svg.select(`#Number${levelNo}`).remove()

    svg.select(`#Begin${levelNo}`).remove()

    this.convertToButton(svg.select(`#Game${levelNo}`), () => {
      this.props.selectLevel(GameMode.Game, levelNo - 1);
    })

    this.convertToButton(svg.select(`#Tutorial${levelNo}`), () => {
      this.props.selectLevel(GameMode.Tutorial, levelNo - 1);
    })
  }

  setupCurrentLevel(levelNo, showTutorial) {
    const svg = this.svg;

    svg.select(`#Lock${levelNo}`).remove()
    svg.select(`#Tick${levelNo}`).remove()

    if(showTutorial) {
      svg.select(`#Game${levelNo}`).remove()
      svg.select(`#Tutorial${levelNo}`).remove()

      this.convertToButton(svg.select(`#Begin${levelNo}`), () => {
        this.props.selectLevel(GameMode.Tutorial, levelNo - 1);
      })
    } else {
      svg.select(`#Begin${levelNo}`).remove()

      this.convertToButton(svg.select(`#Tutorial${levelNo}`), () => {
        this.props.selectLevel(GameMode.Tutorial, levelNo - 1);
      })

      this.convertToButton(svg.select(`#Game${levelNo}`), () => {
        this.props.selectLevel(GameMode.Game, levelNo - 1);
      })

      svg.select(`#Game${levelNo}`).select("path").styles({"stroke": colorPalette[1]})
      svg.select(`#Game${levelNo}`).select("text").styles({"fill": colorPalette[1]})
    }

    svg.select(`#Text${levelNo}`)
      .select("text")
      .styles({
        "fill": colorPalette[1],
        "font-weight": 500,
      })
  }

  setupLockedLevel(levelNo) {
    const svg = this.svg;

    svg.select(`#Number${levelNo}`).remove()
    svg.select(`#Tick${levelNo}`).remove()

    svg.select(`#Begin${levelNo}`).remove()
    svg.select(`#Game${levelNo}`).remove()
    svg.select(`#Tutorial${levelNo}`).remove()
  }

  setupLastLevel(completedUpto) {
    const svg = this.svg;

    if(completedUpto > 0) {
      svg.select("#Number18").select("circle").styles({"fill": colorPalette[1]})
      svg.select("#Game18").select("path").styles({"stroke": colorPalette[1]})
      svg.select("#Game18").select("text").styles({"fill": colorPalette[1]})

      svg.select("#Text18")
         .select("text")
         .styles({
           "fill": colorPalette[1],
           "font-weight": 500,
           })

      this.convertToButton(svg.select("#Game18"), () => {
        this.props.selectLevel(GameMode.Game, 18);
      })
    } else {
      svg.select(`#Number18`).select("circle").styles({"fill": colorPalette[5]})
      svg.select(`#Game18`).remove()
    }
  }

  setupSvg() {
    const svg = this.svg;
    const completedUpto = this.props.completedUpto;
    var showTutorial = this.props.showTutorial;

    for(let i = 0; i < 17; i++) {
      const levelNo = i + 1;

      if(i < completedUpto) {
        this.setupPreviousLevel(levelNo)
      } else if(i == completedUpto) {
        this.setupCurrentLevel(levelNo, showTutorial)
      } else {
        this.setupLockedLevel(levelNo)
      }
    }

    this.setupLastLevel(completedUpto)
  }

  render() {
    const headerStyle = {
      width: "100%",
      height: "50px",
      color: "white",
      alignItems: "center",
      backgroundColor: "black",
      display: "flex",
      flexDirection: 'row',
      fontWeight: 500,
    } as React.CSSProperties;

    return (<div>
      <div style={headerStyle}>
        <div style={{marginLeft: "10px"}}>
          Ergo Games - Straight Lines
        </div>

        <div style={{flexGrow: 5, textAlign: "center"}}>
          MAIN MENU
        </div>

        <div style={{marginRight: "10px"}}>
          Aditya
        </div>
      </div>
      <div ref={this.menuRef}>
      </div>
    </div>)
  }
}
