import React from 'react';
import {
  Button,
  notification,
  Card,
  Switch,
  Carousel,
  Calendar,
  Badge,
} from 'antd';
import ReactQuill from 'react-quill';
import {connect} from 'dva';
import Datetime from 'react-datetime';
import Draggable from 'react-draggable';
import 'react-quill/dist/quill.snow.css';
import styles from './NewPage1.less';

@connect(({test, loading}) => {
  return ({
    test,
    loading: loading.effects['test/fetch'],
  });
})
export default class NewPage extends React.Component {
  state = {
    value: 'test',
    num: 1,
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

  potClick() {
    this.setState((prevState) => {
      const temp = Number(prevState.num);
      return ({
        num: temp + 10,
      });
    });
  }

  potClicks() {
    this.setState({
      num: Number(this.state.num) + 1,
    });
  }

  prompt = () => {
    notification.open({
      message: 'We got value:',
      description: <span dangerouslySetInnerHTML={{__html: this.state.value}}/>,
    });
  };

  testdis() {
    const {dispatch} = this.props;
    dispatch({
      type: 'test/testpayload',
      id: '123',
    });
  }

  carouselGoPrev() {
    this.refs.carousel.prev();
  }

  carouselGoNext() {
    this.refs.carousel.next();
  }

  render() {
    // const {test} = this.props;
    // console.log(test);
    // console.log(this.props);
    return (
      <div className={styles.new_page}>
        <Badge
          className={styles.pot_cure}
          count={this.state.num}
          onClick={this.potClick.bind(this)}
          showZero={false}
        />
        <Badge className={styles.pot_cure} count={this.state.num} onClick={this.potClicks.bind(this)}/>
        <Card title="这是一个文本编辑器">
          <ReactQuill value={this.state.value} onChange={this.handleChange}/>
          <Button style={{marginTop: 16}} onClick={this.prompt}>Prompt</Button>
        </Card>
        <Button onClick={this.testdis.bind(this)}>点击一下</Button>
        <Switch
          checkedChildren="未完成"
          unCheckedChildren="已完成"
          defaultChecked={false}
          loading={false}
        />
        <div className={styles.carousel_wrap}>
          <Carousel
            autoplay
            className={styles.carousel}
            ref="carousel"
          >
            <div className={styles.item}><h1>1</h1></div>
            <div className={styles.item}><h1>2</h1></div>
            <div className={styles.item}><h1>3</h1></div>
            <div className={styles.item}><h1>4</h1></div>
          </Carousel>
          <div
            className={styles.go_prev}
            onClick={this.carouselGoPrev.bind(this)}
          >往前走
          </div>
          <div
            className={styles.go_next}
            onClick={this.carouselGoNext.bind(this)}
          >往后走
          </div>
        </div>
        <Draggable>
          <div className={styles.calendar_wrap}>
            <Calendar
              fullscreen={false}
            />
          </div>
        </Draggable>
        <div style={{display: 'none'}}>
          <Datetime/>
        </div>
        <div
          className={styles.test_drag}
          draggable
        />
      </div>
    );
  }
}
