import { useCallback, useMemo, useState } from 'react'
import B from './components/b'
import C from './components/c'

const A = () => {
  const [state, setState] = useState(0)

  const memoState = useMemo(() => state, [state])

  const onClick = useCallback(() => {}, [])
  // const onClick = () => {}

  // const value = [1, 2, 3]
  const value = useMemo(() => [1, 2], [])

  const c = useCallback(() => <C />, [])

  return (
    <div>
      <button onClick={() => setState(state + 1)}>Click {state}</button>
      <B onClick={onClick} value={value} />
    </div>
  )
}

export default A
