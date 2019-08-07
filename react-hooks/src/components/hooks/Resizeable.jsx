import React from "react";
import { Resizable } from "re-resizable";
import Sector from './Sector';

function Resizeable() {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0"
  };
  return (
      <>
        <Resizable
          style={style}
          defaultSize={{
            width: 200,
            height: 200
          }}
        >
          Sample with size
        </Resizable>
        <Sector
          radius={200}
          offsetAngle={90}
          angle={150}
        />
      </>
  )
}

export default Resizeable;
