import React from 'react';
import { withStyles } from '@material-ui/styles';
import { DropTarget } from 'react-dnd';
import {
  HighlightOff,
  Movie,
  FiberPin,
  AddAPhoto,
  VolumeOff,
  VolumeUp,
  Fullscreen
} from '@material-ui/icons';
import Fade from '@material-ui/core/Fade';
import _ from 'lodash';
import { ToolTip, Permission } from 'components/common';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import WSPlayer, { WebsocketTransport, RTSPClient } from 'libs/streamedian';
import { Button } from 'antd';
import Slider from '@material-ui/core/Slider';
import materialKeys from 'utils/materialKeys';
import { saveFile } from 'utils/fileTool';
import { DATE_FORMAT_HH_MM_SS } from 'commons/constants/const';
import moment from 'moment';

const boxTarget = {
  canDrop() {
    return true;
  },
  drop(_, monitor, component) {
    component.endStream();
    const item = monitor.getItem();
    const { channelId, channelName, deviceId, ptzInd } = item.itemData;
    component.transtion('blackout');
    component.itemDataSource = item.itemData;
    // if (component.state.streamInfo && component.state.streamInfo.sessionId) {
    // component.endStream();
    // }
    component.receivedConfig({
      channelId,
      channelName,
      deviceId,
      streamId: '0',
      type: 'rtsp/h264',
      ptzInd
    });
  }
};

const Types = {
  liveview: 'playback'
};

const arrowDistance = '3px';

const styles = theme => ({
  videoTagContainer: {
    backgroundColor: theme.palette.background.default,
    borderRadius: '4px',
    margin: '3px',
    float: 'left',
    zIndex: '2',
    overflow: 'hidden',
    position: 'relative'
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
    color: theme.palette.text.primary,
    alignItems: 'center',
    display: 'flex'
  },
  clickBorder: {
    border: `2px solid ${theme.palette.primary.light}`
  },
  wrapVideo: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
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
  ptzBut: {
    height: '90% !important',
    marginRight: '10px',
    lineHeight: '1.6222'
  },
  ptzControl: {
    height: '170px',
    width: '140px',
    backgroundColor: `${theme.palette.grey.A200}80`,
    position: 'absolute',
    right: '5px',
    top: '32px',
    borderRadius: '4px'
  },
  'arrow_ctilt-up': {
    top: arrowDistance,
    left: '50%',
    transform: 'rotate(-90deg) translateY(-50%)'
  },
  'arrow_cpan-right': {
    right: arrowDistance,
    top: '50%',
    transform: 'translateY(-50%)'
  },
  'arrow_ctilt-down': {
    bottom: arrowDistance,
    left: '50%',
    transform: 'rotate(90deg) translateY(50%)'
  },
  'arrow_cpan-left': {
    left: arrowDistance,
    top: '50%',
    transform: 'rotate(-180deg) translateY(50%)'
  },
  empty_arrow: {
    color: theme.palette.text.primary,
    position: 'absolute',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.secondary.dark
    }
  },
  ptzcontainer1: {
    height: '120px',
    width: '120px',
    position: 'relative',
    borderRadius: '60px',
    marginLeft: '10px',
    marginTop: '10px',
    backgroundColor: `${theme.palette.grey.A200}99`
  },
  ptzcontainer2: {
    height: '60px',
    width: '60px',
    position: 'relative',
    borderRadius: '30px',
    backgroundColor: `${theme.palette.grey.A200}aa`,
    top: 'calc(50% - 30px)',
    left: 'calc(50% - 30px)'
  },
  ptzcontainer3: {
    width: '80%',
    marginTop: '10px',
    marginLeft: '12%'
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
});

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: props.info,
      playerState: 'default',
      layoutIndex: props.layoutIndex,
      hover: false,
      selected: false,
      mute: true,
      beginClipping: false,
      ptzSlideValue: 1,
      volumeRange: false,
      camInfo: {}
      // playmode: props.mode
    };

    const { info } = this.state;
    const { handleMessage, classes, dispatch, global } = this.props;
    const { userId } = global;

    this.info = info;
    this.classes = classes;
    this.ts = null;
    this.dispatch = dispatch;
    this.userId = userId;

    this.videoWrapRef = React.createRef();
    this.myCanvas = React.createRef();
    this.wrapVideoId = `wrapVideo${info.id}`;

    this.handleMessage = handleMessage;
    this.init = this.init.bind(this);
    this.receivedConfig = this.receivedConfig.bind(this);
    this.transtion = this.transtion.bind(this);
    this.refresh = this.refresh.bind(this);
    this.destroy = this.destroy.bind(this);
    this.saveBookMark = this.saveBookMark.bind(this);
    this.startPlay = this.startPlay.bind(this);
    this.endStream = this.endStream.bind(this);
  }

  init() {
    this.setState({ playerState: 'blackout' });
  }

  // createVideoEnv = () => {
  //   this.setState({
  //     videoInstance: (
  //       // eslint-disable-next-line
  //       <video id={'videoPlayer' + this.info.id} className={this.classes.videoTag}></video>
  //     )
  //   });
  // };

  receivedConfig(config) {
    this.newconfig = true;
    const camInfo = config || null;
    if (camInfo) {
      this.setState({ camInfo });
      this.dispatch({
        type: 'VMSLiveView/getLiveStream',
        payload: { ...camInfo, userId: this.userId },
        id: this.info.id
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      this.setState({ layoutIndex: nextProps.layoutIndex });
    }
  }

  componentWillUnmount() {
    this.transtion('blackout');
    this.handleMessage({ type: 'playerUnmonutRef', id: this.info.id });
  }

  componentDidMount() {
    this.init();
    this.handleMessage({ type: 'playerMonutRef', id: this.info.id, data: this });
  }

  transtion(targetState) {
    const { playerState, camInfo } = this.state;
    const { ptzConIndex } = this.props;
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
        if (this.player) {
          this.player.stop();
          this.player = null;
          if (ptzConIndex === this.info.id) {
            this.handleMessage({ type: 'ptzControlIndex', id: null });
          }
          // document.getElementById(this.wrapVideoId).innerHTML =
          //   "<span style={{ fontSize: ' 120px', opacity: '0.3' }}>" + this.info.id + 1 + '</span>';
        }
        this.destroy();
        this.setState({ playerState: targetState });
      }
    }
  }

  refresh() {}

  startPlay() {
    this.initPlayer();
    // if (this.itemDataSource.ptzInd === 'Y') {
    //   this.dispatch({
    //     type: 'VMSLiveView/getLiveStream',
    //     payload: {},
    //     id: this.info.id
    //   });
    // }
  }

  setVolumn = value => {
    if (this.videoNode) {
      this.videoNode.volumn = value / 100;
      this.videoNode.muted = false;
    }
  };

  endStream() {
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
    this.transtion('blackout');
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
      this.player.player.pause();
      // this.player.pause();
    }
  }

  saveBookMark(e) {
    if (e && e.keyCode === 13 && e.target.value.trim() !== '') {
      this.handleMessage({
        type: 'playerSaveBookmark',
        id: this.info.id,
        data: { bookMarkName: e.target.value.trim(), timestamp: this.ts }
      });
    }
  }

  ptzCon = action => {
    const { ptzSlideValue } = this.state;
    if (this.videoNode) {
      this.dispatch({
        type: 'VMSLiveView/ptzControl',
        payload: {
          deviceId: this.itemDataSource.deviceId,
          channelId: this.itemDataSource.channelId,
          action,
          ptzInd: this.itemDataSource.ptzInd,
          userId: this.userId,
          value: ptzSlideValue
        }
      });
    }
  };

  $screenShot = () => {
    const { streamInfo } = this.state;
    if (streamInfo && streamInfo.sessionId) {
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
      saveFile(image.src, 'live.png');
    }
  };

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

  setPlay() {}

  initPlayer(_playTime) {
    const { streamInfo } = this.state; //  , camInfo
    const { urls } = streamInfo;
    const fetchUrl = urls.replace(/^streams:\/\//i, 'https://');
    fetch(fetchUrl);
    const self = this;
    const playtime = _playTime || 0;
    this.videoWrap = document.getElementById(this.wrapVideoId);
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
    if (this.player) {
      this.player.stop();
      this.player = null;
    }
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
      function addTime() {},
      () => {
        this.initPlayer();
      }
    );
    this.player.on('gapdetected', e => {
      self.playedTime = e.detail.elapsedTS;
      self.initPlayer();
    });
    this.player.on('play', () => {});
    this.player.player.play();
    // this.pause();
  }

  $onHover = () => {
    this.setState({ hover: true });
  };

  $onMouseLeave = () => {
    const { selected } = this.state;
    if (!selected) {
      this.setState({ hover: false });
    }
  };

  $showVolumeRange = value => {
    this.setState({ volumeRange: value });
  };

  $clipping = () => {
    const { beginClipping, camInfo } = this.state;
    if (beginClipping === false) {
      this.dispatch({
        type: 'VMSLiveView/beginClipping',
        payload: { ...camInfo, userId: this.userId }
      }).then(res => {
        this.clipId = res.data.id;
        this.startT = new Date().getTime();
      });
    } else if (beginClipping === true) {
      // show progress bar by lz
      this.dispatch({
        type: 'messageCenter/addProgressBar',
        payload: {
          deviceName: camInfo.channelName,
          msg: 'Live View Clipping In Progress..',
          clippingId: this.clipId,
          start: moment(this.startT).format(DATE_FORMAT_HH_MM_SS),
          end: moment(new Date()).format(DATE_FORMAT_HH_MM_SS)
        }
      });
      this.dispatch({
        type: 'VMSLiveView/endClipping',
        payload: {
          ...camInfo,
          clippingId: this.clipId,
          start: this.startT,
          end: new Date().getTime(),
          userId: this.userId
        }
      });
    } else {
      return 0;
    }

    this.setState({ beginClipping: !beginClipping });
  };

  $onClick = () => {
    const { selected } = this.state;
    this.setState({ selected: !selected });
  };

  $muteToggle = bool => {
    if (this.videoNode) {
      this.videoNode.muted = bool;
      this.setState({ mute: bool });
    }
  };

  showVolumeRange = value => {
    this.setState({ volumeRange: value });
  };

  render() {
    const {
      playerState,
      layoutIndex,
      hover,
      selected,
      mute,
      beginClipping,
      camInfo,
      volumeRange
    } = this.state;
    const { classes, connectDropTarget, ptzConIndex } = this.props;
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
                {camInfo && camInfo.ptzInd === 'Y' && this.player && (
                  <Permission materialKey={materialKeys['M4-91']}>
                    <Button
                      className={classes.ptzBut}
                      type={ptzConIndex === this.info.id ? 'primary' : 'default'}
                      onClick={() => {
                        if (ptzConIndex === this.info.id) {
                          this.handleMessage({ type: 'ptzControlIndex', id: null });
                        } else {
                          this.$onClick();
                          this.handleMessage({ type: 'ptzControlIndex', id: this.info.id });
                        }
                      }}
                    >
                      PTZ Control
                    </Button>
                  </Permission>
                )}

                <HighlightOff
                  className={classes.clickBut}
                  onClick={() => {
                    this.endStream();
                  }}
                />
              </div>
            </div>
          </Fade>
          <div className={classes.videoT}>
            <div id={this.wrapVideoId} className={classes.wrapVideo} ref={this.videoWrapRef}></div>
            <span
              style={{ fontSize: '120px', opacity: '0.3', position: 'absolute' }}
              hidden={this.videoNode}
            >
              {this.info.id + 1}
            </span>
            <canvas
              ref={this.myCanvas}
              style={{
                display: 'contents'
              }}
            />
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
              {mute ? (
                <VolumeOff
                  className={classes.clickBut}
                  onClick={() => {
                    if (this.videoNode) {
                      this.$muteToggle(false);
                    }
                  }}
                  style={{ marginTop: '18px' }}
                />
              ) : (
                <VolumeUp
                  className={classes.clickBut}
                  onClick={() => {
                    this.$muteToggle(true);
                    this.showVolumeRange(false);
                  }}
                  style={{ marginTop: '18px' }}
                />
              )}
            </div>
            <div className={classes.ptzControl} hidden={!(ptzConIndex === this.info.id)}>
              <div className={classes.ptzcontainer1}>
                {['ctilt-up', 'cpan-right', 'ctilt-down', 'cpan-left'].map(item => {
                  const classItem = `arrow_${item}`;
                  return (
                    <PlayArrow
                      // onClick={handlePlay.bind(this, item)}
                      key={item}
                      className={`${classes.empty_arrow} ${classes[classItem]}`}
                      onMouseDown={() => {
                        this.ptzCon(item);
                      }}
                      onMouseUp={() => {
                        this.ptzCon('stop');
                      }}
                      onMouseLeave={() => {
                        this.ptzCon('stop');
                      }}
                    />
                  );
                })}
                <div className={classes.ptzcontainer2}>
                  <Add
                    className={classes.empty_arrow}
                    style={{ top: '10%', left: '18px ' }}
                    onMouseDown={() => {
                      this.ptzCon('czoom-in');
                    }}
                    onMouseUp={() => {
                      this.ptzCon('stop');
                    }}
                  />
                  <Remove
                    className={classes.empty_arrow}
                    style={{ top: '50%', left: '18px ' }}
                    onMouseDown={() => {
                      this.ptzCon('czoom-out');
                    }}
                    onMouseUp={() => {
                      this.ptzCon('stop');
                    }}
                  />
                </div>
              </div>
              <div className={classes.ptzcontainer3}>
                <Slider
                  defaultValue={1}
                  onChange={e => this.setState({ ptzSlideValue: e.target.value })}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={7}
                />
              </div>
            </div>
          </div>
          <Fade in={hover}>
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
                <ToolTip title="Take Screenshot">
                  <AddAPhoto className={classes.clickBut} onClick={this.$screenShot} />
                </ToolTip>
                <ToolTip title={beginClipping ? 'End Clipping' : 'Start Clipping'}>
                  <Movie
                    className={`${beginClipping ? classes.inpin : classes.depin} ${
                      classes.clickBut
                    }`}
                    onClick={() => {
                      if (this.videoNode) {
                        this.$clipping(beginClipping ? 'end' : 'start');
                      }
                    }}
                  />
                </ToolTip>
                <ToolTip title="mute">
                  {mute ? (
                    <VolumeOff
                      className={classes.clickBut}
                      onClick={() => {
                        if (this.videoNode) {
                          this.$muteToggle(false);
                          this.showVolumeRange(true);
                        }
                      }}
                    />
                  ) : (
                    <VolumeUp
                      className={classes.clickBut}
                      onMouseEnter={() => this.showVolumeRange(true)}
                      // onMouseLeave={() => this.showVolumeRange(false)}
                      onClick={() => {
                        this.$muteToggle(true);
                      }}
                    />
                  )}
                </ToolTip>

                <ToolTip title="Fullscreen">
                  <Fullscreen
                    className={classes.clickBut}
                    onClick={() => {
                      if (this.videoNode) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          document.getElementById(`playerFulls${this.info.id}`).requestFullscreen();
                        }
                      }
                    }}
                  />
                </ToolTip>
              </div>
            </div>
          </Fade>
        </div>
      )
    );
  }
}

// function PlayerHooks() {
//   const [playerState, setPlayerState] = useState('default');

//   return <div>{playerState}</div>;
// }

// export default withStyles(styles)(Player);
export default withStyles(styles)(
  DropTarget(Types.liveview, boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }))(Player)
);
