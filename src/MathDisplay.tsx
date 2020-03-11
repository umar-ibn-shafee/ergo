import * as React from "react"

import 'katex/dist/katex.min.css';
import katex from 'katex'

interface MathDisplayProps {
  text: string;
  bold?: boolean;
}

export default class MathDisplay extends React.Component<MathDisplayProps> {
  ref: React.RefObject<HTMLSpanElement>

  constructor(props) {
    super(props)

    this.ref = React.createRef()
  }

  componentDidMount() {
    this.renderKatex();
  }

  componentDidUpdate() {
    this.renderKatex();
  }

  renderKatex() {
    const text = this.props.bold ? `\\mathbf{${this.props.text}}` : this.props.text
    katex.render(text, this.ref.current)
  }

  render() {
    return <span style={{fontSize: "14px"}} ref={this.ref}></span>
  }
}
