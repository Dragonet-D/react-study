import * as React from 'react';
import Button from '@material-ui/core/Button';

interface IPorps {
  index: string;
  getData?: any;
}

interface IState {
  count: number;
}

class Test extends React.Component<IPorps, IState> {
  public readonly state: Readonly<IState> = {
    count: 0
  };

  public handleChange = () => {
    this.setState(prev => {
      const { count } = prev;
      let tempCount = count;
      tempCount++;
      return {
        count: tempCount
      };
    });
  };

  public handleClick1 = () => {
    const { getData } = this.props;
    getData('hello react');
  };

  public render() {
    const { index } = this.props;
    const { count } = this.state;

    return (
      <React.Fragment>
        <div>{index}</div>
        <div>{count}</div>
        <Button color='primary' variant='contained' onClick={this.handleChange}>
          test
        </Button>
        <Button onClick={this.handleClick1}>test1</Button>
      </React.Fragment>
    );
  }
}

export default Test;
