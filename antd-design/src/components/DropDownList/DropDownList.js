import React, { Component } from 'react';
import { Dropdown, Menu, Icon } from 'antd';

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
    </Menu.Item>
  </Menu>
);

export default class DropDownList extends Component {
  render() {
    return (
      <div ref={(node) => {this.container = node}}>
        <Dropdown
          overlay={menu}
          trigger={['click']}
          getPopupContainer={() => this.container}
        >
          <a className="ant-dropdown-link" href="#">
            Hover me <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    )
  }
}
