import React, { FC } from 'react'

export interface Item {
  key: number | string
  value: string
}

interface Props {
  list: Item[]
  onRemove(key: Item['key']): void
}

const List: FC<Props> = ({ list = [], onRemove }) => {
  console.log('list-render')
  return (
    <>
      {list.map((item) => (
        <div key={item.key}>
          <span>{item.value}</span>
          <button
            onClick={() => {
              onRemove(item.key)
            }}
          >
            删除
          </button>
        </div>
      ))}
    </>
  )
}

export default List
