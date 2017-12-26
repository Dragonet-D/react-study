import React, {Component} from 'react'

function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  )
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Doalog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  )
}

function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  )
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts/>
      }
      right={
        <Chat/>
      }
    />
  )
}

function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  )
}

function WelcomeDialog2() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!"
    />
  )
}

class SignUpDialog extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Dialog
        title="Mars Exploration Program"
        message="How should we refer to you ?"
      >
        <input
          type="text"
          value={this.state.login}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    )
  }

  handleChange(e) {
    this.setState({
      login: e.target.value
    })
  }

  handleSinUp(e) {
    alert(`Welcome aboard, ${this.state.login}!`)
  }
}






























