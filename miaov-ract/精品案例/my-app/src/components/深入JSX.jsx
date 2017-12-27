import React from 'react'
import Recommend from "../../../../../react-dianping/react-dianping-getready-react/app/containers/Hello/subpage/Recommend";

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

function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {
        (index) => <div>this is ite, {index} in the list</div>
      }
    </Repeat>
  )
}




























