import { memo } from 'react'

const B = () => {
  console.log('B rerender')

  return <div>b</div>
}

export default memo(B)
