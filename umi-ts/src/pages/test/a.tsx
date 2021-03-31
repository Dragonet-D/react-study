import React, { Component } from 'react';
import { Button } from 'antd';

class A extends Component<any, any> {
  state = {
    a: 0,
  };

  handleTest = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.setState({ a: this.state.a + 1 });
        console.log(this.state.a);
      }, 1000);
    }
  };

  render() {
    return <Button onClick={this.handleTest}>test</Button>;
  }
}

export default A;
