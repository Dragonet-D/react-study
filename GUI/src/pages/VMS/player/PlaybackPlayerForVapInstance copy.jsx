import React from 'react';
import { withStyles } from '@material-ui/styles';
import { DropTarget } from 'react-dnd';

import HighlightOff from '@material-ui/icons/HighlightOff';
// import BookmarkBorder from '@material-ui/icons/BookmarkBorder';
// import Bookmark from '@material-ui/icons/Bookmark';
// import FiberPin from '@material-ui/icons/FiberPin';
// import AddAPhoto from '@material-ui/icons/AddAPhoto';
// import VolumeOff from '@material-ui/icons/VolumeOff';
// import VolumeUp from '@material-ui/icons/VolumeUp';
// import Fullscreen from '@material-ui/icons/Fullscreen';
// import Movie from '@material-ui/icons/Movie';
import Fade from '@material-ui/core/Fade';
import _ from 'lodash';
import Slider from '@material-ui/core/Slider';
import { saveFile } from 'utils/fileTool';
// import { Input, ToolTip } from 'components/common';

import WSPlayer, { WebsocketTransport, RTSPClient } from 'libs/streamedian';
import { VAP_COMMON } from 'commons/constants/commonConstant';

const boxTarget = {
  canDrop() {
    return true;
  },
  drop(_, monitor, component) {
    const item = monitor.getItem();
    const { itemData } = item;
    if (itemData.provider === VAP_COMMON.provider.file) {
      component.itemDataSource = item.itemData;
      component.initFilePlayer();
    } else if (itemData.provider === VAP_COMMON.provider.url) {
      component.itemDataSource = item.itemData;
      component.initFilePlayer();
    } else {
      const { channelId, channelName, deviceId } = item.itemData;
      component.transtion('blackout');
      component.itemDataSource = item.itemData;
      component.receivedConfig({
        channelId,
        channelName,
        deviceId,
        streamId: '0',
        type: 'rtsp/h264'
      });
    }
  }
};

const Types = {
  playback: 'playback'
};

const styles = theme => {
  return {
    videoTagContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: '4px',
      margin: '3px',
      float: 'left',
      zIndex: '2',
      overflow: 'hidden',
      position: 'relative',
      height: '100%',
      width: '100%'
    },
    toolBar: {
      height: '32px',
      width: '100%',
      backgroundColor: `${theme.palette.grey.A200}20`,
      position: 'relative',
      top: 'calc(100% - 64px)',
      // opacity: '0.25 !important',
      zIndex: '5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    infoBar: {
      height: '32px',
      width: '100%',
      backgroundColor: `${theme.palette.grey.A200}20`,
      position: 'relative',
      top: '0px',
      // opacity: '0.25 !important',
      zIndex: '5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    endButton: {
      height: '78%',
      marginRight: '3px',
      zIndex: '5',
      color: theme.palette.text.primary
    },
    clickBorder: {
      border: `2px solid ${theme.palette.primary.light}`
    },
    bookmarkInput: {
      color: `${theme.palette.text.primary} !important`,
      width: '18%',
      backgroundColor: theme.palette.background.default,
      height: '70%',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    inpin: {
      color: `${theme.palette.primary.main} !important`
    },
    depin: {
      color: `${theme.palette.text.primary} !important`
    },
    videoT: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.palette.background.default,
      padding: '2px',
      color: theme.palette.text.primary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: '0px',
      overflow: 'hidden'
    },
    videoTag: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.palette.primary.light
    },
    wrapVideo: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    volumn: {
      width: '24px',
      height: '70px'
    },
    volumnWrap: {
      width: '34px',
      height: '120px',
      padding: '5px',
      backgroundColor: `${theme.palette.grey.A200}99`,
      borderRadius: '4px',
      position: 'absolute',
      bottom: '2px',
      right: '21px',
      zIndex: '9999'
    },
    clickBut: {
      cursor: 'pointer'
    }
  };
};

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: props.info,
      playerState: 'default',
      layoutIndex: props.layoutIndex,
      hover: false,
      selected: false,
      camInfo: {},

      beginClipping: false,
      volumeRange: false
    };

    const { info } = this.state;
    const { handleMessage, classes, global, dispatch } = this.props;
    const { userId } = global;

    this.handleMessage = handleMessage;
    this.dispatch = dispatch;
    this.info = info;
    this.classes = classes;
    this.ts = 0;
    this.userId = userId;
    this.sf = 1;

    this.videoWrapRef = React.createRef();
    this.myCanvas = React.createRef();
    this.wrapVideoId = `wrapVideo${info.id}`;
    this.clipping = {};

    this.init = this.init.bind(this);
    this.initPlayer = this.initPlayer.bind(this);
    this.initFilePlayer = this.initFilePlayer.bind(this);
    this.transtion = this.transtion.bind(this);
    this.refresh = this.refresh.bind(this);
    this.destroy = this.destroy.bind(this);
    this.startPlay = this.startPlay.bind(this);
    this.pause = this.pause.bind(this);
    this.setScaleFactor = this.setScaleFactor.bind(this);
    this.receivedConfig = this.receivedConfig.bind(this);
    this.saveBookMark = this.saveBookMark.bind(this);
    this.endStream = this.endStream.bind(this);
    this.skip = this.skip.bind(this);
    this.seek = this.seek.bind(this);
    this.maskText = 'Please Select The Source Provider';
    // this.dragTip = 'Please Drag The Source Provider Into Player'
  }

  init() {
    this.setState({ playerState: 'blackout' }, () => {
      // this.createVideoEnv();
    });
  }

  setVolumn = value => {
    if (this.videoNode) {
      this.videoNode.volumn = value / 100;
      this.videoNode.muted = false;
    }
  };

  receivedConfig(config) {
    this.newconfig = true;
    const camInfo = config || {};
    if (camInfo) {
      this.setState({ camInfo });
      this.handleMessage({
        type: 'receivedConfig',
        id: this.info.id,
        data: { ...camInfo }
      });
    }
  }

  $layoutCalc = layoutIndex => {
    if (layoutIndex === 6) {
      return {
        height: 'calc(50% - 6px)',
        width: 'calc(33.3% - 6px)'
      };
    } else {
      return {
        width: `calc(${100 / Math.sqrt(layoutIndex)}% - 6px)`,
        height: `calc(${100 / Math.sqrt(layoutIndex)}% - 6px)`
      };
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      this.setState({ layoutIndex: nextProps.layoutIndex });
    }
  }

  componentWillUnmount() {
    this.handleMessage({ type: 'playerUnmonutRef', id: this.info.id });
  }

  componentDidMount() {
    this.init();
    this.handleMessage({ type: 'playerMonutRef', id: this.info.id, data: this });
  }

  $screenShot = () => {
    const { streamInfo } = this.state;
    if (streamInfo.sessionId) {
      const video = document.getElementById(`player${this.info.id}`);
      const canvas = this.myCanvas.current;
      // canvas.width = video.clientWidth;
      // canvas.height = video.clientHeight;
      canvas.width = 869;
      canvas.height = 486;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, 869, 486);

      const image = new Image();
      image.src = canvas.toDataURL('image/png');
      saveFile(image.src, 'playBack.png');
    }
  };

  $clipping = () => {
    const { beginClipping, streamInfo } = this.state;
    if (streamInfo) {
      const { channelId, deviceId } = this.itemDataSource;
      if (beginClipping === false) {
        this.clipping.start = this.ts;
      } else if (beginClipping === true) {
        this.clipping.end = this.ts;
        this.handleMessage({
          type: 'clipping',
          id: this.info.id,
          data: { ...this.clipping, channelId, deviceId, streamId: '0', userId: this.userId }
        });
        this.clipping = {};
      } else {
        return 0;
      }
      this.setState({ beginClipping: !beginClipping });
    }
  };

  $reset = () => {
    // this.player.stop();
    if (this.player) {
      this.player.stop();
      this.player = null;
      this.videoWrap.innerHTML = null;
    }
    const time = _.cloneDeep(this.ts);
    this.handleMessage({ type: 'allSetResumeSeek', data: time, id: this.info.id });

    // const time = (this.ts - st) / 1000;
    // this.resumeTime = Math.floor(time) + 3;
    // // setTimeout(() => {
    // console.error(Math.floor(time) + 3);
    // if (this.resumeTime) {
    //   this.initPlayer(this.resumeTime);
    // } else {
    //   this.initPlayer(Math.floor(time) + 3);
    // }

    // }, 5000);
  };

  $onClick = () => {
    const { selected } = this.state;
    this.setState({ selected: !selected });
  };

  $onHover = () => {
    this.setState({ hover: true });
  };

  $onMouseLeave = () => {
    const { selected } = this.state;
    if (!selected) {
      this.setState({ hover: false });
    }
  };

  initFilePlayer() {
    const { url } = this.itemDataSource;
    const self = this;
    self.handleMessage({ type: 'timestampUpdate', id: self.info.id, data: 1 });
    this.ts = 0;
    this.videoWrap = document.getElementById(this.wrapVideoId);

    this.videoWrap.innerHTML =
      // eslint-disable-next-line
      "<video id='player" + this.info.id + "' class='centeredVideo' src='" + url + "'></video>";

    this.videoNode = document.getElementById(`player${this.info.id}`);
    // this.videoNode.src = url;
    // this.videoNode.addEventListener('leavepictureinpicture', self.onPlay);
    this.videoNode.style.height = '100%';
    this.videoNode.style.width = '100%';
    this.videoNode.play();
  }

  initPlayer(_playTime, type) {
    const { streamInfo, layoutIndex } = this.state; //  , camInfo
    const { urls } = streamInfo;
    const fetchUrl = urls.replace(/^streams:\/\//i, 'https://');
    fetch(fetchUrl);
    const self = this;

    const playtime = _playTime || 0;

    this.videoWrap = document.getElementById(this.wrapVideoId);
    if (this.player) {
      this.player.stop();
      this.player = null;
      this.videoWrap.innerHTML = null;
    }
    this.videoWrap.innerHTML =
      // eslint-disable-next-line
      "<video id='player" +
      this.info.id +
      "' class='centeredVideo' src='" +
      urls +
      " autoPlay'></video>";
    // videoWrap.innerHTML = `<video id='player-${camInfo.channelName}' class='${this.classes.videoTag} src='${urls}' autoPlay muted></video>`;
    this.videoNode = document.getElementById(`player${this.info.id}`);
    this.videoNode.src = urls;
    this.videoNode.addEventListener('leavepictureinpicture', self.onPlay);
    this.videoNode.style.height = '100%';
    this.videoNode.style.width = '100%';
    const wsTransport = {
      constructor: WebsocketTransport,
      options: {
        socket: urls.replace(/^streams:\/\//i, 'wss://')
      }
    };

    this.player = new WSPlayer(
      this.videoNode,
      {
        modules: [
          {
            client: RTSPClient,
            transport: wsTransport,
            url: urls.replace(/^streams:\/\//i, 'wss://')
          }
        ],
        offsetTime: playtime,
        url: urls.replace(/^streams:\/\//i, 'wss://')
      },
      addTime => {
        if (addTime - self.ts > 1000) {
          self.ts = addTime;
          self.handleMessage({ type: 'timestampUpdate', id: self.info.id, data: addTime });
        }
      },
      this.$reset
    );
    this.player.on('gapdetected', e => {
      self.playedTime = e.detail.elapsedTS;
      self.initPlayer();
    });
    if (type === 'start') {
      const stoponce = layoutIndex === 6;
      const pauseIm = () => {
        setTimeout(() => {
          this.transtion('pause');
        }, 200);
      };
      this.player.player.onplaying = stoponce ? pauseIm : () => {};
      // this.player.player.onplaying = () => {
      //   console.log('playing');
      // };
      // clearTimeout(pauseIm);
    }

    this.player.setScaleFactor(this.sf);
    this.player.player.play();
    // this.pause();
    if (type !== 'resume') {
      self.handleMessage({ type: 'timestampUpdate', id: self.info.id, data: 1 });
      this.ts = 0;
    }
  }

  skip(_skip) {
    const skipTime = (this.ts - this.startTime) / 1000 + _skip;
    if (skipTime < 0) {
      this.pause();
      this.ts = 1;
      this.player.play(0);
    } else {
      this.pause();
      this.ts = this.ts + _skip * 1000;
      this.player.play(skipTime);
    }
  }

  refresh() {
    this.initPlayer();
  }

  seek(_seekData) {
    if (_seekData && this.player) {
      this.initPlayer(_seekData);
    }
  }

  setScaleFactor(value) {
    if (value && this.player) {
      this.sf = value;
      this.initPlayer((this.ts - this.startTime) / 1000);
    }
  }

  destroy() {
    if (this.player) {
      this.player.stop();
    }
    this.player = null;
    this.videoNode = null;
    if (this.videoWrap) {
      this.videoWrap.innerHTML = null;
    }
  }

  pause() {
    if (this.player) {
      // this.player.player.pause();
      this.player.pause();
    }
  }

  endStream() {
    console.log('endStream');
    const { playmode, camInfo, streamInfo } = this.state;
    if (camInfo && streamInfo) {
      this.handleMessage({
        type: 'endStream',
        id: this.info.id,
        data: {
          type: playmode,
          id: streamInfo.sessionId,
          name: camInfo.channelName
        }
      });
    }
    this.handleMessage({ type: 'timestampUpdate', id: this.info.id, data: 1 });
    this.handleMessage({ type: 'playerEndstream', id: this.info.id });
  }

  showVolumeRange = value => {
    this.setState({ volumeRange: value });
  };

  saveBookMark(e) {
    if (this.player) {
      const { camInfo } = this.state;
      if (e && e.keyCode === 13 && e.target.value.trim() !== '') {
        this.handleMessage({
          type: 'playerSaveBookmark',
          id: this.info.id,
          data: {
            savePayload: {
              bookmarkComments: e.target.value.trim(),
              bookmarkTimestamp: this.ts,
              channelId: camInfo.channelId,
              deviceId: camInfo.deviceId
            },
            getPayload: {
              type: 'rtsp/h264',
              channelId: camInfo.channelId,
              deviceId: camInfo.deviceId,
              channelName: camInfo.channelName,
              streamId: camInfo.streamId
            }
          }
        });
        e.target.value = '';
      }
    }
  }

  transtion(targetState) {
    // playing default blackout pause
    const { playerState, camInfo } = this.state;

    if (playerState === 'default') {
      // eslint-disable-next-line
      throw console.error('Player has not been initailized');
    }
    if (targetState !== playerState) {
      if (targetState === 'playing') {
        if (camInfo) {
          this.startPlay();
        }
        this.setState({ playerState: targetState });
      } else if (targetState === 'blackout') {
        this.destroy();
        this.endStream();
        this.setState({ playerState: targetState });
      } else if (targetState === 'pause') {
        this.pause();
        this.setState({ playerState: targetState });
      }
    }
  }

  startPlay() {
    const { layoutIndex } = this.state;

    if (this.newconfig) {
      if (layoutIndex === 1) {
        this.initPlayer(0, 'start');
        this.newconfig = false;
      } else {
        this.initPlayer(0, 'start');
        this.newconfig = false;
      }
    } else if (!this.newconfig) {
      if (this.player) {
        // this.player.player.play();
        this.player.play(Math.floor((this.ts - this.startTime) / 1000));
      }
    }
  }

  render() {
    const { playerState, layoutIndex, hover, selected, camInfo, volumeRange } = this.state;
    const { connectDropTarget, classes } = this.props;
    const layoutConfig = this.$layoutCalc(layoutIndex);
    const clickBorder = selected ? 'clickBorder' : '';

    return (
      connectDropTarget &&
      connectDropTarget(
        <div
          className={`${classes.videoTagContainer} ${clickBorder}`}
          onMouseOver={this.$onHover}
          onFocus={this.$onHover}
          // onClick={this.$onClick}
          onMouseLeave={this.$onMouseLeave}
          style={layoutConfig}
          id={`playerFulls${this.info.id}`}
        >
          <Fade in={hover}>
            <div className={classes.infoBar}>
              <div style={{ marginLeft: '10px' }}>
                {playerState === 'blackout' ? 'No Stream' : camInfo.channelName}
              </div>
              <div className={`${classes.endButton} 'clickBorder'`}>
                <HighlightOff
                  className={classes.clickBut}
                  onClick={() => {
                    this.transtion('blackout');
                  }}
                />
              </div>
            </div>
          </Fade>
          <div className={classes.videoT}>
            <div id={this.wrapVideoId} className={classes.wrapVideo} ref={this.videoWrapRef}>
              <span style={{ fontSize: '30px', opacity: '0.3' }}>{this.maskText}</span>
              <canvas
                ref={this.myCanvas}
                style={{
                  display: 'contents'
                }}
              />
            </div>

            <div
              className={classes.volumnWrap}
              onMouseEnter={() => {
                this.showVolumeRange(true);
              }}
              onMouseLeave={() => {
                this.showVolumeRange(false);
              }}
              onFocus={() => {}}
              style={{
                display: volumeRange ? 'flex' : 'none',
                flexDirection: 'column'
              }}
            >
              <div className={classes.volumn}>
                <Slider
                  orientation="vertical"
                  defaultValue={0}
                  min={0}
                  max={100}
                  aria-labelledby="vertical-slider"
                  onChange={e => {
                    this.setVolumn(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          {/* <Fade in={hover}>
            <div className={classes.toolBar}>
              <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <ToolTip title="Pin the Toolbar">
                  <FiberPin
                    className={`${selected ? classes.inpin : classes.depin} ${classes.clickBut}`}
                    onClick={this.$onClick}
                    style={{ marginLeft: '4px' }}
                  />
                </ToolTip>
              </div>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginRight: '2px'
                }}
              >
                <Input
                  hidden={!bookMarkToggle}
                  className={classes.bookmarkInput}
                  onKeyDown={this.saveBookMark}
                />
                <ToolTip title="BookMark">
                  {bookMarkToggle ? (
                    <BookmarkBorder
                      className={classes.clickBut}
                      onClick={() => {
                        this.$bookMarkToggle(false);
                      }}
                    />
                  ) : (
                    <Bookmark
                      className={classes.clickBut}
                      onClick={() => {
                        this.$bookMarkToggle(true);
                      }}
                    />
                  )}
                </ToolTip>
                <ToolTip title="Take Screenshot">
                  <AddAPhoto className={classes.clickBut} onClick={this.$screenShot} />
                </ToolTip>
                <ToolTip title={beginClipping ? 'End Clipping' : 'Start Clipping'}>
                  <Movie
                    className={`${beginClipping ? classes.inpin : classes.depin} ${
                      classes.clickBut
                    }`}
                    onClick={this.$clipping}
                  />
                </ToolTip>
                {mute ? (
                  <ToolTip title="mute">
                    <VolumeOff
                      className={classes.clickBut}
                      onClick={() => {
                        this.$muteToggle(false);
                        this.showVolumeRange(true);
                      }}
                    />
                  </ToolTip>
                ) : (
                  <ToolTip title="unmute">
                    <VolumeUp
                      className={classes.clickBut}
                      onMouseEnter={() => this.showVolumeRange(true)}
                      onClick={() => {
                        this.$muteToggle(true);
                      }}
                    />
                  </ToolTip>
                )}
                <ToolTip title="Fullscreen">
                  <Fullscreen
                    className={classes.clickBut}
                    onClick={() => {
                      if (this.videoNode) {
                        document.getElementById(`playerFulls${this.info.id}`).requestFullscreen();
                      }
                    }}
                  />
                </ToolTip>
              </div>
            </div>
          </Fade> */}
        </div>
      )
    );
  }
}

export default withStyles(styles)(
  DropTarget(Types.playback, boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }))(Player)
);
