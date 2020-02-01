import * as React from 'react';
import {Button} from 'antd'
import {IColor} from './model'

function ColorPicker() {
  const {useState} = React

  const [color, setColor] = useState<IColor>({
    red: 20,
    green: 2,
    blue: 20
  })

  const changeColor = () => {
    setColor({
      red: 12,
      green: 22,
      blue: 11
    })
  }

  return (
      <>
        <div>{color}</div>
        <Button onClick={changeColor}>Test</Button>
      </>
  )
}

export default ColorPicker