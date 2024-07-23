import { memo } from 'react'
import { isEqual } from 'radash'
import C from './c'

const B = () => {
  console.log('B')

  return (
    <div>
      <C />
    </div>
  )
}

export default memo(B, (pre, next) => {
  console.log(pre, next)
  console.log(isEqual(pre, next))

  return isEqual(pre, next)
})
