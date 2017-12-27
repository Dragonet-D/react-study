import React, {Component} from 'react'

class CustomTextInput extends Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
  }

  focus() {
    this.textInput.focus();
  }

  render() {
    return (
      <div>
        <input
          type="text"
          ref={(input) => {
            this.textInput = input
          }}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focus}
        />
      </div>
    )
  }
}

class AutoFocusTextInput extends Component {
  compontentDidMount() {
    this.textInput.focusTextInput()
  }

  render() {
    return (
      <CustomTextInput
        ref={(input) => {
          this.textInput = input
        }}
      />
    )
  }
}

function MyFunctionalComponent() {
  return <input/>
}

class Parent extends Component {
  render() {
    return (
      <MyFunctionalComponent
        ref={(input) => {
          this.textInput = input
        }}
      />
    )
  }
}

function CustomTextInputs(props) {
  let textInput = null;

  function handleClick() {
    textInput.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={(input) => {
          textInput = input;
        }}
      />
      <input
        type="text"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  )
}

function CustomTextInputt(props) {
  return (
    <div>
      <input ref={props.inputRef}/>
    </div>
  )
}

class Parents extends Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    )
  }
}

class Grandparent extends Component {
  render() {
    return (
      <Parent
        inputRef={el => this.inputElement = el}
      />
    )
  }
}


























