import { memo } from 'react'
// import { isEqual } from 'radash'
import C from './c'

const B = () => {
  console.log('B')

  return <div>b</div>
}

export default memo(B)
