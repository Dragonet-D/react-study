import React, { Component } from 'react';
import Button  from 'antd/lib/button';
import styles from './Test.less';

export default class Test extends Component{
  render() {
    return(
      <div className={styles.test}>
        <Button>123</Button>
      </div>
    )
  }
}