import React, {Component} from 'react'

export default class Header extends Component {
  render() {
    return (
      <header>
        <h2 className="title">播放列表</h2>
        <input type="text" placeholder="输入歌曲名字"/>
        <input type="text" placeholder="输入歌手名字"/>
        <input type="button" value="添加音乐"/>
      </header>
    )
  }
}