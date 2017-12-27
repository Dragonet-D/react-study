import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Greeting extends Component {
  render() {
    const children = this.props.children;
    return (
      <h1>{children}</h1>
    )
  }
}

Greeting.propTypes = {
  name: PropTypes.string
}

class MyComponent extends Component {
  render() {
    return (
      <h1>Hello React!</h1>
    )
  }
}

MyComponent.propTypes = {
  opyionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol
}