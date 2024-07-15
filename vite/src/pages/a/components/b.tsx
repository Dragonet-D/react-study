import { memo } from 'react'
import C from './c'

const B = () => {
  console.log('B')

  return (
    <div>
      <C />
    </div>
  )
}

export default memo(B)
