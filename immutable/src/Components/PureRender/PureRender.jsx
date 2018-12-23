import React, { Component } from "react";
import pureRender from "pure-render-decorator";

class PureRender extends Component{
  render() {
    return(
      <div>123</div>
    )
  }
}

export default pureRender()(PureRender);