import { useCallback, useMemo, useState, useEffect } from 'react'
import B from './components/b'
import C from './components/c'

const A = () => {
  const [state, setState] = useState(0)

  const onClick = useCallback(() => {}, [])

  const value = useMemo(() => [1, 2], [])

  const c = useCallback(() => <C />, [])

  useEffect(() => {
    console.log('a')
  }, [])

  return (
    <div>
      <button onClick={() => setState(state + 1)}>Click {state}</button>
      <B onClick={onClick} value={value} />
      {c()}
    </div>
  )
}

export default A
