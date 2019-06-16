import { Layout, Menu, Badge, Icon, Dropdown } from "antd";
import Link from "umi/link";
import styles from "./index.css";
import { connect } from "dva";
import React, { Component } from "react";

const { Header, Footer, Content } = Layout;

@connect(state => ({
  // 连接购物车状态
  count: state.cart.length,
  cart: state.cart
}))
export default class extends Component {
  render() {
    const selectedKeys = [this.props.location.pathname];
    const menu = (
      <Menu>
        {this.props.cart.map((item, index) => (
          <Menu.Item key={index}>
            {item.name}×{item.count} <span>￥{item.count * item.price}</span>
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      // 上中下布局
      <Layout>
        {/* 页头 */}
        <Header className={styles.header}>
          <img
            className={styles.logo}
            src="https://img.kaikeba.com/logo-new.png"
          />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={selectedKeys}
            style={{ lineHeight: "64px", float: "left" }}
          >
            <Menu.Item key="/">
              <Link to="/">商品</Link>
            </Menu.Item>
            <Menu.Item key="/users">
              <Link to="/users">用户</Link>
            </Menu.Item>
            <Menu.Item key="/about">
              <Link to="/about">关于</Link>
            </Menu.Item>
          </Menu>
          {/* 购物车状态显示 */}

          {/* 购物车信息放在Dropdown以便展示 */}
          <Dropdown overlay={menu} placement="bottomRight">
            <div style={{ float: "right" }}>
              <Icon type="shopping-cart" style={{ fontSize: 18 }} />
              <span>我的购物车</span>
              <Badge count={5} offset={[-4, -18]} />
            </div>
          </Dropdown>
        </Header>
        {/* 内容 */}
        <Content className={styles.content}>
          <div className={styles.box}>{this.props.children}</div>
        </Content>
        {/* 页脚 */}
        <Footer className={styles.footer}>开课吧</Footer>
      </Layout>
    );
  }
}
