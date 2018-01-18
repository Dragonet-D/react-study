import React, {Component} from 'react'

export  default class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="info">
          <span className="align-right">当前选中1首歌曲</span>
          <span>共3首歌曲</span>
        </div>
        <input type="button" value="删除选中歌曲"/>
        <input type="button" value="收藏选中歌曲"/>
        <input type="button" value="取消收藏选中歌曲"/>
        <input type="button" value="查看收藏清单"/>
        <input type="button" value="查看所有清单"/>
      </footer>
    )
  }
}