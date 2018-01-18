import React, {Component} from 'react'
import Item from './item'

export default class Main extends Component {
  render() {
    return (
      <table className="main">
        <thead>
          <tr>
            <th>
              <input type="checkbox" id="checkAll"/>
              <label htmlFor="checkAll">全选</label>
            </th>
            <th>歌曲</th>
            <th>歌手</th>
            <th>收藏</th>
            <th>删除</th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.data.map((value, index) => {
            return <Item
              key={index}
              data={value}
            />
          })
        }
        </tbody>
      </table>
    )
  }
}