import React, { Component } from 'react';
import { List } from 'antd';
import './Index.less';

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',
}];

export default class IndexList extends Component{
  render() {
    return(
      <div className="alarm_list">
        <div className="alarm_list_title">
          {
            columns.map(item =>(
              <div
                key={item.key}
              >
                {item.title}
              </div>
            ))
          }
        </div>
        <List
          dataSource={dataSource}
          size="small"
          renderItem={
            item => (
              <List.Item
                key={item.key}
              >
                {
                  columns.map((items) => {
                    return (
                      <div
                        key={items.key}
                        className={items.className || ''}
                      >{item[items.dataIndex]}</div>
                    )
                  })
                }
              </List.Item>
            )
          }
        >

        </List>
      </div>
    )
  }
}
