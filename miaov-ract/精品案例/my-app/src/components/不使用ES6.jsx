var createReactClass = require('create-react-class')
var Greeting = createReactClass({
  render: function () {
    return <h1>Hello, {this.props.name}</h1>
  }
});