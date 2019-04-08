import React, {Fragment, useState, useEffect} from 'react';
import {Input, Checkbox} from 'antd';
import './style.scss';

function ToDo() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([{
    checked: true,
    value: 'hello'
  }])

  function handlePressEnter() {
    if (!todo) return;
    todoList.push({
      checked: false,
      value: todo
    })
    setTodoList(todoList)
    setTodo('')
  }

  function handleCheckStatus(index, checked) {
    todoList[index].checked = checked;
    console.log(todoList);
    setTodoList([...todoList])
  }

  return (
    <Fragment>
      <div className="todo_wrapper">
        <Input
          placeholder='input todo'
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          onPressEnter={handlePressEnter}
        />
      </div>
      <ToDoList
        todoList={todoList}
        checkChange={handleCheckStatus}
      />
    </Fragment>
  )
}

function ToDoList({todoList, checkChange}) {
  function handleCheck(index, e) {
    checkChange(index, e.target.checked)
  }

  return (
    <ul className='list_wrapper'>
      {
        todoList.map((item, index) => {
          return (
            <li
              className='list_item'
              key={index}
            >
              <Checkbox
                checked={item.checked}
                onChange={handleCheck.bind(this, index)}
              />
              <span>{item.value}</span>
            </li>
          )
        })
      }
    </ul>
  )
}

export default ToDo;
