import * as React from "react"

interface InputProps {
  value?: string;
  placeholder?: string;
}

interface InputState {
  value: string
}

export class NumberInput extends React.Component<InputProps, InputState> {
  inputRef: React.RefObject<HTMLInputElement>

  constructor(props) {
    super(props)

    this.inputRef = React.createRef();
    this.state = {
      value: (props.value || "")
    }
  }

  validateNumber(value) {
    const isNumber = !isNaN(value) || (value == ".")  || (value == "-") ;

    const indexOfdot = value.indexOf(".");
    const numDecimalPoints = value.length - indexOfdot - 1;
    const max3decimalPoints = (indexOfdot == -1) || (numDecimalPoints < 4)

    return isNumber && max3decimalPoints
  }

  validateNumberOrFraction(value) {
    if(this.validateNumber(value)) {
      return true
    }

    const chunks = value.split("/");

    return (chunks.length == 2 && this.validateNumber(chunks[0]) && this.validateNumber(chunks[1])) ||
      (chunks.length == 1 && this.validateNumber(chunks[0]) && chunks[1].trim() == "/")
  }

  handleChange(event) {
    const value = event.target.value;

    if(this.validateNumberOrFraction(value)) {
      this.setState({value: value})
    } else {
      this.setState({value: this.state.value})
    }
  }

  get value(): number {
    const value = this.inputRef.current.value;

    if(value.indexOf("/") == -1) {
      return Number.parseFloat(value);
    } else {
      const chunks = value.split("/");
      
      return Number.parseFloat(chunks[0])/Number.parseFloat(chunks[1]);
    }
  }

  get text(): string {
    return this.inputRef.current.value;
  }

  focus() {
    this.inputRef.current.focus();
  }

  clear() {
    this.setState({
      value: ""
    });
  }

  render() {
    const size = Math.max(1, this.state.value.length);
    const width=`${size*0.55}em`;
    const style = {
      backgroundColor: "transparent",
      width: width,
      border: "none",
      outline: "none"
    } as React.CSSProperties;

    return <input onChange={this.handleChange.bind(this)}
                placeholder={this.props.placeholder}
                ref={this.inputRef}
                type="text" name="name"
                value={this.state.value}
                style={style} />
  }
}

export class TextInput extends React.Component<InputProps, InputState> {
  inputRef: React.RefObject<HTMLInputElement> 

  constructor(props) {
    super(props)

    this.inputRef = React.createRef();
    this.state = {
      value: (props.value || "")
    }
  }

  get value() {
    const value = this.inputRef.current.value;
    return value;
  }

  get text(): string {
    return this.inputRef.current.value;
  }

  handleInput(event) {
    const value = event.target.value 
    console.log('Text input: ', value)
    this.setState({value: value})
  }

  render() {
    const size = Math.max(1, this.state.value.length);
    const width=`${size*0.55}em`;
    const style = {
      backgroundColor: "transparent",
      width: width,
      border: "none",
      outline: "none"
    } as React.CSSProperties

    return <input onChange={this.handleInput.bind(this)}
                  placeholder={this.props.placeholder}
                  ref={this.inputRef}
                  type="text" name="name"
                  value={this.state.value}
                  style={style} />
  }
}

