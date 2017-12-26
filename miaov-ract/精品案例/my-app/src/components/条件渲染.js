import React, {Component} from 'react'
import ReactDOM from 'react-dom'

function UserGreeting(props) {
  return <h1>Welcome Back!</h1>
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn
  if (isLoggedIn) {
    return <UserGreeting/>
  }
  return <GuestGreeting/>
}

const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map((number) => number * 2)
const listItems = numbers.map((number) =>
  <li>{number}</li>
)

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const todoItems = tods.map((todo) =>
  <li key={todo.item}>
    {todo.text}
  </li>
)

const todoItemss = todos.map((todo, index) =>
  <li key={index}>
    {todo.text}
  </li>
)

function Blog(props) {
  const slidebar = (
    <ul>
      {
        props.posts.map((post) =>
          <li key={post.id}>
            {post.title}
          </li>
        )
      }
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {slidebar}
      {content}
    </div>
  )
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
]

class NameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      value: event.target.value.toUpperCase()
    })
  }

  handleSubmit(event) {
    alert('A name was submitted' + this.state.value)
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange}/>
        </label>
        <input type="submit" value='Submit'/>
      </form>
    )
  }
}

class EssayForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    })
  }

  handleSubmit(event) {
    alert('An essay was submitted:' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <textarea value={this.state.value} onChange={this.handleChange}></textarea>
        </label>
        <input type="submit" value='Submit'/>
      </form>
    )
  }
}

let partialState = {
  name: 'Hello React'
};
partialState[name] = value
this.setState(partialState)

this.setState({
  [name]: value
})
ReactDOM.render(
  <Blog posts={posts}/>,
  document.getElementById('root')
)

ReactDOM.render(
  <NumberList numbers={numbers}/>,
  document.getElementById('root')
)

ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
)

ReactDOM.render(
  <Greeting isLoggedIn={false}/>,
  document.getElementById('root')
)