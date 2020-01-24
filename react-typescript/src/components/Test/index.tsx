import * as React from "react";

interface IPorp {
  index: string
}

class Test extends React.Component<IPorp, any>{
  public render() {
    return (
        <div>{this.props.index}</div>
    )
  }
}

export default Test