import React, {Component} from 'react'

class Button extends Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    )
  }
}

class Message extends Component {
  render() {
    return (
      <div>
        {this.props.text}
        <Button color={this.props.color}>
          Delete
        </Button>
      </div>
    )
  }
}

class MessageList extends Component {
  render() {
    const color = 'blue'
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color}/>
    );
    return <div>{children}</div>
  }
}