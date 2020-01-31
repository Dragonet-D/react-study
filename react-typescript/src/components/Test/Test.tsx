import * as React from "react";

interface IProps {
  index: number
}

function Test(props: IProps) {
  return (
      <div>{props.index}</div>
  )
}

export default Test