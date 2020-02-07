import React, {Component} from 'react';

class Student extends Component {
  render() {
    return (
      <h2>么么么么</h2>
    )
  }
}

export default Student;

class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    )
  }
}
