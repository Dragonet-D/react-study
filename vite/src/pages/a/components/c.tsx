import { memo, useEffect } from 'react'

const C = () => {
  console.log('C')
  useEffect(() => {
    console.log('123')
  }, [])

  return <div>C</div>
}

export default C
