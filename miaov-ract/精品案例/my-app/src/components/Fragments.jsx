import React, {Component} from 'react'

class Table extends Component {
  render() {
    return (
      <table>
        <tr>
          <Columns/>
        </tr>
      </table>
    )
  }
}

class Columns extends Component {
  render() {
    return (
      <>
      <td>Hello</td>
      <td>World</td>
      </>
    )
  }
}

class Columnss extends Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    )
  }
}

function Glossary(props) {
  return (
    <dl>
      {
        props.items.map(item => (
          <React.Fragment>
            <td>{item.term}</td>
            <td>{item.description}</td>
          </React.Fragment>
        ))
      }
    </dl>
  )
}










































