import { useState } from 'react'
import Header from './components/Header'
import List, { Item } from './components/List'

function App() {
  const [counter, setCounter] = useState(0)
  const [list, setList] = useState<Item[]>([])

  const handleCounterChange = () => {
    setCounter(counter + 1)
  }

  const handleAdd = (e: string) => {
    if (!e) {
      return
    }
    setList((pre) => {
      const temp = pre.slice(0)
      temp.push({
        key: Date.now(),
        value: e,
      })

      return temp
    })
  }

  const handleRemove = (e: string) => {
    const index = list.findIndex((i) => i.key === e)
    const temp = list.slice(0)

    temp.splice(index, 1)
    setList(temp)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        placeItems: 'center',
      }}
    >
      <button
        style={{ width: 'fill-content', marginBottom: 20 }}
        onClick={handleCounterChange}
      >
        {counter}
      </button>
      <div>
        <Header onAdd={handleAdd} />
        <List list={list} onRemove={handleRemove} />
      </div>
    </div>
  )
}

export default App
