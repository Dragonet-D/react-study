import { useEffect } from 'react'

const C = () => {
  console.log('C rerender')
  useEffect(() => {
    console.log('123')
  }, [])

  return <div>C</div>
}

export default C
