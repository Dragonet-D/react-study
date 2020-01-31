import * as React from "react";

interface IProps {
  aProps: string;
  bProps: string;
}

interface IState {
  aState: string;
  bState: string;
}

class Test1 extends React.PureComponent<IProps, IState> {
  public readonly state = {
    aState: "",
    bState: ""
  };

  public test1 = () => {
    this.setState({
      aState: "123"
    });
  };

  public test2 = () => {
    this.setState({
      bState: "b123"
    });
  };

  public render() {
    const { aProps, bProps } = this.props;
    const { aState, bState } = this.state;
    return (
      <React.Fragment>
        <div>{aProps}</div>
        <div>{bProps}</div>
        <button onClick={this.test1}>{aState}</button>
        <button onClick={this.test2}>{bState}</button>
      </React.Fragment>
    );
  }
}

export default Test1;
