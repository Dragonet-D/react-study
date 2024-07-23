import { useCallback, useMemo, useState } from 'react'
import { Button } from 'antd'
import B from './components/b'

const A = () => {
  const [state, setState] = useState(0)

  const memoState = useMemo(() => state, [state])

  // const onClick = useCallback(() => {}, [])
  const onClick = () => {}

  const value = [1, 2, 3]

  return (
    <div>
      <Button onClick={() => setState(state + 1)}>Click {state}</Button>
      <B onClick={onClick} value={value} />
    </div>
  )
}

export default A
