import React, {Component} from 'react';
import Header from './Header';
import Progress from './Progress';

class Root extends Component {
  getInitialState() {
    return {
      progress: '-'
    }
  }

  componentDidMount() {
    $('#player').jPlayer({
      ready() {
        $(this).jPlayer('setMedia', {
          mp3: ''
        }).jPlayer('play');
      },
      supplied: 'mp3',
      wmode: 'window'
    });
    $('#player').bind($.jPlayer.event.timeUpdate, (e) => {
      this.setState({
        progress: Math.round(e.jPlayer.status.currentTime)
      })
    })
  }

  componentWillUnMount() {
    $('#jPlyaer').unbind($.jPlayer.event.timeUpdate)
  }

  ProgressChangeHandler() {

  }

  render() {
    return (
      <div>
        <Header/>
        <Progress
          progress={this.state.progress}
          onProgressChange={this.ProgressChangeHandler}
        >
        </Progress>
      </div>
    )
  }
}

export default Root