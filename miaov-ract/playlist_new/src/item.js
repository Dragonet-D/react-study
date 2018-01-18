import React, {Component} from 'react'

export default class Item extends Component {
  render() {
    let data = this.props.data
    return (
      <tr className={(data.selected? 'selected' : '') + (data.like ? 'like' : '')}>
        <td>
          <input
            type="checkbox"
            checked={data.selected}
          />
        </td>
        <td>{data.title}</td>
        <td>{data.singer}</td>
        <td>
          <input
            type="checkbox"
            checked={data.like}
          />
        </td>
        <td>
          <a>X</a>
        </td>
      </tr>
    )
  }
}