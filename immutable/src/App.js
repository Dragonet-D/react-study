import React, {Component} from 'react';
import ImmutableCom from "./Components/Immutable/Immutable";
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
    const {content} = this.state;
    return (
      <div className="App">
        <button onClick={this.test}>test</button>
        <ImmutableCom content={content}/>
      </div>
    );
  }
}

export default App;
