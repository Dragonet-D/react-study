import React from 'react';
import {Button, notification, Card} from 'antd';
import ReactQuill from 'react-quill';
import {connect} from 'dva';
import 'react-quill/dist/quill.snow.css';
import styles from './NewPage1.less';

@connect(({test, loading}) => {
  // console.log(test);
  return ({
    test,
    loading: loading.effects['test/fetch'],
  });
})
export default class NewPage extends React.Component {
  state = {
    value: 'test',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'test/fetch',
    });
  }

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

  testdis() {
    console.log(this.props);
    const {dispatch} = this.props;
    dispatch({
      type: 'test/testpayload',
      id: '123',
    });
  }

  render() {
    // const {test} = this.props;
    // console.log(test);
    return (
      <div className={styles.new_page}>
        <Card title="这是一个文本编辑器">
          <ReactQuill value={this.state.value} onChange={this.handleChange}/>
          <Button style={{marginTop: 16}} onClick={this.prompt}>Prompt</Button>
        </Card>
        <Button onClick={this.testdis.bind(this)}>点击一下</Button>
      </div>
    );
  }
}
