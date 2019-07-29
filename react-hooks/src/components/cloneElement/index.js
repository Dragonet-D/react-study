import React, { cloneElment } from "react";

function Com({color}) {
  return <div style={{color}}>123</div>
}

function A() {
  return <B render={<Com color="red" />}>123</B>
}

const style = {
  width: '100%'
}

function B({children, render}) {
  return cloneElment(render, {
    style,
    children
  })
}