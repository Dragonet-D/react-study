import React from 'react'

const MyComponent = {
  DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>
  }
}

function BlueDatePicker() {
  return <MyComponent.DatePicker color="blue"/>
}

function Item(props) {
  return <li>{props.message}</li>
}

function TodoList() {
  const todos = ['finish doc', 'submit pr']
  return (
    <ul>
      {
        todos.map((message) => <Item key={message} message={message}/>)
      }
    </ul>
  )
}

function Hello(props) {
  return <div>Hello {props.address}</div>
}
