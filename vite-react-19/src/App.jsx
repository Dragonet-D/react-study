import { useState } from 'react'
import B from './b'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>

      <B />
    </>
  )
}

export default App
