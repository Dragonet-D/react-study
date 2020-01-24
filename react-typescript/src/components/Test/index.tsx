import * as React from "react";

interface IPorp {
  index: string
}

interface IState {
  count: number
}

class Test extends React.Component<IPorp, IState>{
  public readonly state: Readonly<IState> = {
    count: 0
  }

  public handleChange = () => {
    this.setState((prev) => {
      const {count} = prev
      let tempCount = count
      tempCount++
      return {
        count: tempCount
      }
    })
  }

  public render() {
    const {index} = this.props
    const {count} = this.state

    return (
        <React.Fragment>
          <div>{index}</div>
          <div>{count}</div>
          <button onClick={this.handleChange}>test</button>
        </React.Fragment>
    )
  }
}

export default Test