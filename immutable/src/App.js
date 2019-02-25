import React, {Component} from 'react';
import Hooks from "./Components/Hooks/Hooks";
import './App.css';

class App extends Component {
  state = {
    content: "hello immutable"
  };
  test = () => {
    this.setState({
      content: "hello word"
    })
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.test}>test</button>
        <Hooks/>
        <Hooks/>
        <Hooks/>
        <Hooks/>
        <Hooks/>
        <Hooks/>
      </div>
    );
  }
}

export default App;
