import React, {Component} from 'react'

class HelloReact extends Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
        <Timer/>
        <TodoApp/>
      </div>
    )
  }
}

// 定时器
class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {seconds: 0};
  }

  tick() {
    this.setState((prevState) => ({
      seconds: prevState.seconds + 1
    }))
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Seconds:{this.state.seconds}
      </div>
    )
  }
}

// todoApp
class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {items: [], text: ''};
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({test: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.test.trim().length) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState((prevState) => ({
      items: prevState.items.concat(newItem),
      text: ''
    }))
  }

  render() {
    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items}/>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>
            Add # {this.state.items.length + 1}
          </button>
        </form>
      </div>
    )
  }
}

class TodoList extends Component {
  render() {
    return (
      <ul>
        {
          this.props.items.map(item => (
            <li key={item.id}>{item.text}</li>
          ))
        }
      </ul>
    )
  }
}

export default HelloReact