import * as React from 'react';

import * as d3 from "d3";
import 'd3-selection-multi'
import { Point, colorPalette } from './Common'

import cursorIcon from './Images/Cursor.png'

interface GraphAxesDef {
  xl: number,
  xh: number,
  yl: number,
  yh: number,
  subTickSize: number,
  numSubticksPerTick: number,
}

interface GraphProps {
  onLoad: () => void
}

export default class Graph extends React.Component<GraphProps, {}> {
  graphRef: React.RefObject<HTMLDivElement>
  width: number;
  height: number;
  svg: any;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  gridLines: any;
  onClickHandler: any;
  element: HTMLDivElement;
  axesDef: GraphAxesDef;
  xAxisTranslate: number;
  yAxisTranslate: number;

  constructor(props) {
    super(props);

    this.graphRef = React.createRef();
  }

  reset(axesDef?: GraphAxesDef) {
    if(axesDef) {
      this.axesDef = axesDef
    }

    d3.select(this.element).html("")

    this.svg = d3.select(this.element)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.initScales();

    this.drawGridlines();

    this.drawAxis();

    this.setupEventHandlers()
  }

/*For level 7 where the grid is not to be shown. */
  invisibleReset(axesDef?: GraphAxesDef) {
    if(axesDef) {
      this.axesDef = axesDef
    }

    d3.select(this.element).html("")

    this.svg = d3.select(this.element)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.initScales();

    this.setupEventHandlers()
  }

  initScales() {
    this.xScale = d3.scaleLinear()
      .domain([this.axesDef.xl, this.axesDef.xh])
      .range([0, this.width]);

    this.yScale = d3.scaleLinear()
      .domain([this.axesDef.yl, this.axesDef.yh])
      .range([this.height, 0]);

    this.xAxisTranslate = this.yScale(0)
    this.yAxisTranslate = this.xScale(0)
  }

  drawAxis() {
    const xAxis = d3.axisBottom()
      .scale(this.xScale)
      .tickSizeOuter(0)
      .ticks(0);

    const yAxis = d3.axisLeft()
      .scale(this.yScale)
      .tickSizeOuter(0)
      .ticks(0);

    this.xAxis = this.svg.append("g")
      .attr("transform", `translate(0, ${this.xAxisTranslate})`);

    this.yAxis = this.svg.append("g")
      .attr("transform", `translate(${this.yAxisTranslate}, 0)`)

    this.xAxis.call(xAxis);
    this.yAxis.call(yAxis);

    this.xAxis.selectAll("path")
      .attr('stroke-width', '2px')
      .attr('stroke', colorPalette[4])

    this.yAxis.selectAll("path")
      .attr('stroke-width', '2px')
      .attr('stroke', colorPalette[4])

    this.addText("x-axis", {x: this.width - 25, y: -10}, colorPalette[4], this.xAxis)
    this.addText("y-axis", {x: 45, y: 20}, colorPalette[4], this.yAxis)
  }

  drawGridlines() {
    this.gridLines = this.svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")

    this.drawHorizontalGridLines()
    this.drawVerticalGridLines()

    this.gridLines.append("text")
      .attr("x", this.yAxisTranslate - 5)
      .attr("y", this.xAxisTranslate + 5)
      .attr("dominant-baseline", "hanging")
      .attr("text-anchor", "end")
      .text(0)
  }

  generateTicks(start, end, tickSize) {
    var ticks = [];

    for(var i = 1; i*tickSize < end; i++) {
      ticks.push(Math.round(i*tickSize*100)/100)
    }

    ticks.push(Math.round(i*tickSize*100)/100)

    for(var i = -1; i*tickSize > start; i--) {
      ticks.push(Math.round(i*tickSize*100)/100)
    }

    ticks.push(Math.round(i*tickSize*100)/100)

    ticks.push(0)

    return ticks.sort((x, y) => x - y)
  }

  drawVerticalGridLines() {
    this.xTicks().filter(v => v != 0).forEach((v) => {
      const x = this.xScale(v)
      const tickNumber = Math.round(v/this.axesDef.subTickSize)

      var strokeColor = colorPalette[5]

      const lineGroup = this.gridLines.append('g')

      if(tickNumber % this.axesDef.numSubticksPerTick == 0) {
        strokeColor = colorPalette[3]

        lineGroup.append("text")
          .attr("x", x)
          .attr("y", this.xAxisTranslate + 5)
          .attr("dominant-baseline", "hanging")
          .attr("text-anchor", "middle")
          .text(v)
      }

      this.drawVerticalLine(v, lineGroup, {
        stroke: strokeColor,
        "stroke-width": "1px",
        "stroke-opacity": "0.5",
      })
    })
  }


  drawHorizontalGridLines() {
    this.yTicks().filter(v => v != 0).forEach((v) => {
      const y = this.yScale(v);
      const tickNumber = Math.round(v/this.axesDef.subTickSize)

      var strokeColor = colorPalette[5]

      const lineGroup = this.gridLines.append('g')

      if(tickNumber % this.axesDef.numSubticksPerTick == 0) {
        strokeColor = colorPalette[3]

        lineGroup.append("text")
          .attr("x", this.yAxisTranslate - 5)
          .attr("y", y)
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "end")
          .text(v)
      }

      this.drawHorizontalLine(v, lineGroup, {
        stroke: strokeColor,
        "stroke-width": "1px",
        "stroke-opacity": "0.5",
      })
    })
  }

  drawVerticalLine(x, parentNode, otherAttr) {
    return this.drawLineSegment({x: x, y: this.axesDef.yh}, {x: x, y: this.axesDef.yl}, parentNode, otherAttr)
  }

  drawHorizontalLine(y, parentNode, otherAttr) {
    return this.drawLineSegment({x: this.axesDef.xl, y: y}, {x: this.axesDef.xh, y: y}, parentNode, otherAttr)
  }

  drawLine(equation: [number, number, number], parentNode, otherAttr) {
    const [a, b, c] = equation;

    if(!parentNode) {
      parentNode = this.svg
    }

    if (b == 0) {
      return this.drawVerticalLine(-c/a, parentNode, otherAttr)
    }

    const func = (x) => ((-a*x - c)/b)

    const line = d3.line()
        .x(d => this.xScale(d))
        .y(d => this.yScale(func(d)));
    
    return parentNode.append("path")
      .datum(this.xTicks())
      .attr("d", line)
      .attr('stroke', 'black')
      .attr('stroke-width', '1px')
      .attrs(otherAttr)
  }

  drawLineSegment(p1, p2, parentNode, otherAttr) {
    if(!parentNode) {
      parentNode = this.svg
    }

    const x1 = this.xScale(p1.x)
    const y1 = this.yScale(p1.y)
    const x2 = this.xScale(p2.x)
    const y2 = this.yScale(p2.y)

    return parentNode.append("line")
      .attr("x1", x1)
      .attr("x2", x2)
      .attr("y1", y1)
      .attr("y2", y2)
      .attrs(otherAttr)
  }

  removeLine(line) {
    line.remove()
  }

  setupEventHandlers() {
    const that = this;

    this.svg.on("click", function() {
      const coords = d3.mouse(this);
      const x = that.xScale.invert(coords[0])
      const y = that.yScale.invert(coords[1])

      if(that.onClickHandler) {
        that.onClickHandler(x, y)
      }
    })
  }

  snapToGrid(point: Point) {
    const {x, y} = point;
    const roundedX = this.axesDef.subTickSize*Math.round(x/this.axesDef.subTickSize)
    const roundedY = this.axesDef.subTickSize*Math.round(y/this.axesDef.subTickSize)

    return {x: roundedX, y: roundedY}
  }

  setOnClickHandler(f: any) {
    this.onClickHandler = f
  }

  setXAxisColor(color) {
    this.xAxis.selectAll("path").attr('stroke', color)
    this.xAxis.selectAll("text").attr('fill', color)
  }

  setYAxisColor(color) {
    this.yAxis.selectAll("path").attr('stroke', color)
    this.yAxis.selectAll("text").attr('fill', color)
  }

  xTicks() {
    return this.generateTicks(this.axesDef.xl, this.axesDef.xh, this.axesDef.subTickSize)
  }

  yTicks() {
    return this.generateTicks(this.axesDef.yl, this.axesDef.yh, this.axesDef.subTickSize)
  }

  showSubtickValues() {
    const xTicks = this.xTicks().filter(v => v > 0 && v < this.axesDef.numSubticksPerTick*this.axesDef.subTickSize)
    const yTicks = this.yTicks().filter(v => v > 0 && v < this.axesDef.numSubticksPerTick*this.axesDef.subTickSize)

    yTicks.forEach((v) => {
      var y = this.yScale(v);

      this.svg.append("text")
        .attr("x", this.yAxisTranslate - 5)
        .attr("y", y)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("fill", colorPalette[9])
        .text(v)
    })

    xTicks.forEach((v) => {
      const x = this.xScale(v)

      this.svg.append("text")
        .attr("x", x)
        .attr("y", this.xAxisTranslate + 5)
        .attr("dominant-baseline", "hanging")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("fill", colorPalette[9])
        .text(v)
    })
  }

  addText(text, position, color, parentNode?) {
    if(!parentNode) {
      parentNode = this.svg
    }

    return parentNode.append("text")
      .attr("x", position.x)
      .attr("y", position.y)
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("font-size", "10")
      .attr("fill", color)
      .text(text)
  }


  annotatePoint(text, position, color) {
    const x = this.xScale(position.x)
    const y = this.yScale(position.y)

    return this.addText(text, {x: x + 10, y: y + 10}, color)
  }

  //Annotate above instead of below to avoid clash with negative slope line.
  upAnnotatePoint(text, position, color) {
    const x = this.xScale(position.x)
    const y = this.yScale(position.y)

    return this.addText(text, {x: x + 10, y: y - 10}, color)
  }

  removeAnnotation(annotation) {
    return this.removeText(annotation)
  }

  removeText(text) {
    text.remove();
  }

  addPoint(position, radius, otherAttr) {
    const cx = this.xScale(position.x)
    const cy = this.yScale(position.y)
    
    return this.svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", radius)
      .attrs(otherAttr)
  }

  blinkPoint(point, blinkDuration) {
    const blink = () => {
      point.transition()
        .duration(blinkDuration)
        .attr("fill", "none")
        .transition()
        .duration(blinkDuration)
        .attr("fill", point.attr('fill'))
        .on('end', blink)
    }

    blink()
  }

  blinkLine(line, blinkDuration) {
    const blink = () => {
      line.transition()
        .duration(blinkDuration)
        .attr("stroke-width", "0px")
        .transition()
        .duration(blinkDuration)
        .attr("stroke-width", line.attr('stroke-width'))
        .on('end', blink)
    }

    blink()
  }

  removePoint(point) {
    point.remove();
  }

  componentDidMount() {
    const axesDef = {
      xl: -28,
      xh: 28,
      yl: -23,
      yh: 23,
      subTickSize: 1,
      numSubticksPerTick: 5,
    }

    this.width = this.graphRef.current.clientWidth;
    this.height = this.graphRef.current.clientHeight;
    this.element = this.graphRef.current;
    this.reset(axesDef);

    this.props.onLoad();
  }

  render() {
    const graphStyle = {
      cursor: `url(${cursorIcon}) 7 7, auto`,
      width: "100%",
      height: "calc(100vh - 50px)",
      minHeight: "550px",
    } as React.CSSProperties;

    return (<div id="ergo-graph" style={graphStyle} ref={this.graphRef}>
    </div>)
  }
}
