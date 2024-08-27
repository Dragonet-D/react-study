import { memo, useEffect } from 'react'

const B = () => {
  console.log('B rerender')

  useEffect(() => {
    console.log('B effect')
  }, [])

  return <div>b</div>
}

export default memo(B)
