import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import Snacker from './SnackBar';

class View extends Component {
  timer = null;

  muteTimer = null;

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(nextProps.config, this.props)) return;
    this.onMuteStart(nextProps);
  }

  onMsgClose(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'messageCenter/read',
      payload: {
        id
      }
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      dispatch({
        type: 'messageCenter/clear'
      });
    }, 5000);
  }

  onMuteStart(props) {
    const { dispatch, messageCenter } = props;
    const { muteDuration } = messageCenter.config;
    clearTimeout(this.muteTimer);
    this.muteTimer = setTimeout(() => {
      dispatch({
        type: 'messageCenter/mute',
        payload: {
          duration: false
        }
      });
    }, muteDuration);
  }

  applyMuteMsg = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'messageCenter/mute',
      payload: {
        mute: e
      }
    });
  };

  render() {
    const { messageCenter } = this.props;
    const { messages, config } = messageCenter;
    const { autoHideDuration, mute } = config;
    return (
      <div>
        {messages &&
          messages.map(msg => {
            const { type, message, source, id, unread, zIndex } = msg;
            return (
              <div className="isc-message" key={id}>
                <Snacker
                  message={message}
                  source={source}
                  type={type}
                  onClose={this.onMsgClose.bind(this)}
                  open={unread}
                  id={id}
                  mute={mute}
                  onMute={this.applyMuteMsg}
                  zIndex={zIndex}
                  autoHideDuration={autoHideDuration}
                />
              </div>
            );
          })}
      </div>
    );
  }
}

export default connect(({ messageCenter }) => {
  return {
    messageCenter
  };
})(View);
