import React, {Component} from 'react';
import Header from './Header';
import Progress from './Progress';

class Root extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Progress progress={1}>
        </Progress>
      </div>
    )
  }
}

export default Root