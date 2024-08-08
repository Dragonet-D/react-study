import React, { useState, FC } from 'react'

interface Props {
  onAdd(value: string): void
}

const Header: FC<Props> = ({ onAdd }) => {
  const [value, setValue] = useState('')
  console.log('header-render')

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleAdd = () => {
    onAdd(value)
    setValue('')
  }

  return (
    <>
      <input type="text" value={value} onChange={handleChange} />
      <button onClick={handleAdd}>确定</button>
    </>
  )
}

export default Header
