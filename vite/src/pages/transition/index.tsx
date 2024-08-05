import { useState, useEffect, useTransition } from 'react'

const App = () => {
  const [list1, setList1] = useState<null[]>([])
  const [list2, setList2] = useState<null[]>([])
  const [isPending, startTransition] = useTransition()
  useEffect(() => {
    startTransition(() => {
      //将状态更新标记为 transition
      setList1(new Array(10000).fill(null))
    })
  }, [])
  useEffect(() => {
    setList2(new Array(10000).fill(null))
  }, [])
  return (
    <>
      {isPending ? 'pending' : 'nopending'}
      {list1.map((_, i) => (
        <div key={i}>{i}</div>
      ))}
      -----------------list2
      {list2.map((_, i) => (
        <div key={i}>6666</div>
      ))}
    </>
  )
}

export default App
