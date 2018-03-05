import React from 'react';
import {Button, notification, Card} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './NewPage1.less';

export default class NewPage extends React.Component {
  state = {
    value: 'test',
  };

  handleChange = (value) => {
    this.setState({
      value,
    });
  };

  prompt = () => {
    notification.open({
      message: 'We got value:',
      description: <span dangerouslySetInnerHTML={{__html: this.state.value}}/>,
    });
  };

  render() {
    return (
      <div className={styles.new_page}>
        <Card title="这是一个文本编辑器">
          <ReactQuill value={this.state.value} onChange={this.handleChange}/>
          <Button style={{marginTop: 16}} onClick={this.prompt}>Prompt</Button>
        </Card>
      </div>
    );
  }
}
