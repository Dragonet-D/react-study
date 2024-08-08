import {useEffect, useState} from 'react'

const B = () => {
  const [$] = useState<number[]>([0])
  const [count, setCount] = useState<number>($[0])

  const handleClick = () => {
    $[0] = count
    setCount($[0] + 1)
  }

  // useEffect(() => {
  //   $[0] = count
  // }, [count]);

  console.log($)

  return <button onClick={handleClick}>{count}</button>
}

export default B
