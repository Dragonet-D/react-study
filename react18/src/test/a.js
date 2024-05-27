import { useEffect, useState } from 'react'

function A() {
  const [state] = useState(0)

  // render 方法调用时被触发
  console.log(1)

  // effect 中打印
  useEffect(() => {
    console.log(2)
  }, [state])

  // micro task 中 log
  Promise.resolve().then(() => console.log(3))

  // macro task 中 log
  setTimeout(() => console.log(4), 0)

  return <div>useEffect 执行时机</div>
}

export default A
