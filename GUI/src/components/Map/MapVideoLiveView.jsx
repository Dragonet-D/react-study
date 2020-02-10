/* eslint-disable jsx-a11y/media-has-caption */
/*
 * @Description: Map Live View Window
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @LastEditors: Kevin
 * @Date: 2019-03-05 11:31:20
 * @LastEditTime: 2019-09-27 11:36:18
 */
/* jshint esversion: 6 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'dva';
import Context from 'utils/createContext';
import store from '@/index';
import { DialogWindow } from 'components/common';
import { withStyles, Grid } from '@material-ui/core';
import { AddBox, IndeterminateCheckBox, ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

import Player from 'pages/VMS/player/PlayerComponent';
import WSPlayer, { WebsocketTransport, RTSPClient } from 'libs/streamedian';
import * as ItemTypes from './constants';

const ChannelLiveView = ({ channel, handleCloseWindowClickEvent }) => {
  const {
    contextMenu: { liveViewWindowSet }
  } = React.useContext(Context);
  const { liveViewWindows } = liveViewWindowSet;
  return (
    <DialogWindow
      height="50%"
      width="40%"
      top="15px"
      left="25%"
      title={channel.channelName}
      hideIconClose
      handleCloseWindowClick={() => handleCloseWindowClickEvent(channel.channelId)}
    >
      <div type="tool-bar" />

      <div type="window-body">
        <ChannelPlayer
          channelId={channel.channelId}
          deviceId={channel.deviceId}
          ptzInd={channel.ptzInd}
          itemData={channel}
          liveViewWindows={liveViewWindows}
        />
      </div>
    </DialogWindow>
  );
};

ChannelLiveView.propTypes = {
  channel: PropTypes.object.isRequired,
  handleCloseWindowClickEvent: PropTypes.func.isRequired
};

/**
 *Channel Player
 *
 * @class ChannelPlayerUI
 * @extends {React.Component}
 */

const styles = theme => ({
  playerWindow: {
    width: '100%',
    height: '100%'
  },
  playerBG: {
    background: theme.palette.background.paper
  },
  transformArrow45: {
    transform: 'rotate(-45deg)'
  },
  transformArrow135: {
    transform: 'rotate(45deg)'
  },
  arrowGroup: { margin: 2, width: 'fit-content' },
  arrowGroupTop: { overflow: 'hidden', display: 'flex' },
  arrowGroupBottom: { overflow: 'hidden', display: 'flex' },
  videoOperation: {
    position: 'absolute',
    left: 0,
    top: '20%',
    right: 'auto',
    padding: 3,
    flexDirection: 'column',
    maxHeight: '80%',
    width: 160,
    overflow: 'hidden'
  }
});
class ChannelPlayerUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speedVal: 5,
      player: null
    };
  }

  componentDidMount() {
    const { deviceId, channelId, userId, ptzInd, liveViewWindows } = this.props;
    store
      .dispatch({
        type: 'map/getLiveViewStream',
        payload: {
          obj: {
            type: 'rtsp/h264',
            deviceId,
            channelId,
            streamId: '0',
            userId,
            ptzInd
          }
        }
      })
      .then(res => {
        if (res.urls) {
          if (liveViewWindows.length > 3) {
            return;
          }
          const domain = res.urls.split('streams://')[1].split(':30011')[0];
          fetch(`https://${domain}:30011`);
          this.setState({
            player: (
              <Player
                url={res.urls}
                scale={1}
                keyId={`player${deviceId}-${Math.ceil(Math.random() * 100000)}`}
              />
            )
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    const { sensorStream } = this.props;
    if (
      nextProps.sensorStream &&
      nextProps.sensorStream.urls &&
      nextProps.sensorStream.urls !== sensorStream
    ) {
      const domain = nextProps.sensorStream.urls.split('streams://')[1].split(':30011')[0];
      fetch(`https://${domain}:30011`);
      // this.setState({
      //   player: (
      //     <Player
      //       url={nextProps.sensorStream.urls}
      //       scale={1}
      //       keyId={`player${deviceId}-${Math.ceil(Math.random() * 100000)}`}
      //     />
      //   )
      // });
    }
  }

  componentDidUpdate() {
    // const { sensorStream } = this.props;
    // if (sensorStream.urls) {
    //   this.initStreamedian(sensorStream.urls, this.videoNode);
    // }

    // Added for PTZ CONTROL , by Kevin on 2019/04/29 23:52:05 - Start
    document.addEventListener('mouseup', this.controlPTZEnd);
    // Added for PTZ CONTROL - End
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.stop();
      this.player = null;
    }

    const { sensorStream, itemData } = this.props;
    if (sensorStream.sessionId)
      store.dispatch({
        type: 'map/endLiveViewStream',
        payload: {
          obj: {
            id: sensorStream.sessionId,
            name: itemData.channelName,
            type: 'live'
          }
        }
      });
    // Added for PTZ CONTROL , by Kevin on 2019/04/29 23:52:05 - Start
    document.removeEventListener('mouseup', this.controlPTZEnd);
    // Added for PTZ CONTROL - End
  }

  initStreamedian(url, videoNode) {
    try {
      const wsTransport = {
        constructor: WebsocketTransport,
        options: {
          socket: url.replace(/^streams:\/\//i, 'wss://')
        }
      };
      this.player = new WSPlayer(videoNode, {
        modules: [
          {
            client: RTSPClient,
            transport: wsTransport
          }
        ]
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('ERR initStreamedian', e);
    }
  }

  controlPTZ = action => {
    const { deviceId, channelId, ptzInd, userId } = this.props;
    if (!deviceId) {
      return;
    }
    store.dispatch({
      type: 'map/controlPTZ',
      payload: {
        obj: {
          deviceId,
          channelId,
          action,
          ptzInd,
          userId
        }
      }
    });
  };

  controlPTZStart = action => {
    const { itemData, userId } = this.props;
    const { speedVal } = this.state;
    this.PTZStartTime = new Date().getTime();
    if (!itemData.deviceId) {
      return;
    }
    store.dispatch({
      type: 'map/controlPTZ',
      payload: {
        obj: {
          deviceId: itemData.deviceId,
          channelId: itemData.channelId,
          action,
          ptzInd: itemData.ptzInd,
          userId,
          value: speedVal
        }
      }
    });
  };

  // Added for PTZ CONTROL , by Kevin on 2019/04/29 23:52:05 - Start
  controlPTZEnd = () => {
    const { itemData, userId } = this.props;
    const { speedVal } = this.state;
    const PTZEndTime = new Date().getTime();
    if (!this.PTZStartTime) return;
    const PTZIntervalTime = PTZEndTime - this.PTZStartTime;
    if (!itemData.deviceId) {
      this.PTZStartTime = null;
      return;
    }

    if (PTZIntervalTime >= ItemTypes.PTZ_CONTROL_MINIMUM_INTERVAL) {
      store.dispatch({
        type: 'map/controlPTZ',
        payload: {
          obj: {
            deviceId: itemData.deviceId,
            channelId: itemData.channelId,
            action: 'stop',
            ptzInd: itemData.ptzInd,
            userId,
            value: speedVal
          }
        }
      });
    } else {
      this.timer = setTimeout(() => {
        store.dispatch({
          type: 'map/controlPTZ',
          payload: {
            obj: {
              deviceId: itemData.deviceId,
              channelId: itemData.channelId,
              action: 'stop',
              ptzInd: itemData.ptzInd,
              userId,
              value: speedVal
            }
          }
        });
        clearTimeout(this.timer);
      }, ItemTypes.PTZ_CONTROL_MINIMUM_INTERVAL - 1000);
    }

    this.PTZStartTime = null;
  };
  // Added for PTZ CONTROL - End

  render() {
    const { sensorStream, ptzInd, classes, deviceId } = this.props;

    const { player } = this.state;
    const url = sensorStream.urls || '';

    return (
      <div key={sensorStream.channelId} className={classes.playerWindow}>
        <Grid item id="111" className={classes.playerWindow}>
          {false && (
            <video
              id={`player${deviceId}-${Math.ceil(Math.random() * 100000)}`}
              className={classNames(classes.playerBG, classes.playerWindow)}
              preload="none"
              data-setup="{}"
              autoPlay
              src={url}
              ref={node => {
                this.videoNode = node;
              }}
            >
              Your browser is too old which does not support HTML5 video.
              <source src="" type="video/mp4" />
            </video>
          )}
          {player}
          <div
            className={classes.videoOperation}
            style={{ display: ptzInd === 'Y' ? 'flex' : 'none' }}
          >
            <div className={classNames(classes.transformArrow45, classes.arrowGroup)}>
              <div className={classes.arrowGroupTop}>
                <ArrowDropUp
                  className={classes.transformArrow45}
                  onMouseDown={() => this.controlPTZStart('cpan-left')}
                />
                <ArrowDropUp
                  className={classes.transformArrow135}
                  onMouseDown={() => this.controlPTZStart('ctilt-up')}
                />
              </div>
              <div className={classes.arrowGroupBottom}>
                <ArrowDropDown
                  className={classes.transformArrow135}
                  onMouseDown={() => this.controlPTZStart('ctilt-down')}
                />
                <ArrowDropDown
                  className={classes.transformArrow45}
                  onMouseDown={() => this.controlPTZStart('cpan-right')}
                />
              </div>
            </div>
            <div>
              <AddBox style={{ margin: 2 }} onMouseDown={() => this.controlPTZStart('czoom-in')} />
              <IndeterminateCheckBox
                style={{ margin: 2 }}
                onMouseDown={() => this.controlPTZStart('czoom-out')}
              />
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ map, global }) => {
  return {
    sensorStream: map.streamData,
    userId: global.userId
  };
};

const ChannelPlayer = connect(mapStateToProps)(withStyles(styles)(ChannelPlayerUI));

export default ChannelLiveView;
