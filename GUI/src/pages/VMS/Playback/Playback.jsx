import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  PanoramaWideAngle,
  ViewModule,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@material-ui/icons';
import { ToolTip } from 'components/common';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';
import { RecordingRender } from 'components/VMS/Playback';
import { TreeList } from 'components/VMS/TreeList';
import { isSuccess } from 'utils/helpers';
import msgCenter from 'utils/messageCenter';
import { DATE_FORMAT_HH_MM_SS } from 'commons/constants/const';
import ControlSection from './ControlSec';
import Player from '../player/PlaybackPlayerHooks';

const styles = theme => {
  return {
    pageContainer: {
      height: 'calc(100% - 56px)',
      width: '100%',
      display: 'flex',
      borderRadius: '4px',
      marginTop: '6px'
    },
    listContainer: {
      height: '100%',
      width: '20%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: '0px',
      marginRight: '6px',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.primary.light}`
    },
    videoContainer: {
      height: '100%',
      width: '80%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      color: theme.palette.text.primary,
      overflow: 'hidden',
      border: `1px solid ${theme.palette.primary.light}`
    },
    vConHeader: {
      height: '7%',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    vConBody: {
      // height: "70%",
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    vConCtrl: {
      // height: "20%",
      width: '100%',
      backgroundColor: 'blue'
    },
    layoutButGroup: {
      width: '10%',
      height: '68%',
      backgroundColor: theme.palette.primary.light,
      marginRight: '15px',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    layoutBut: {
      width: '50%',
      height: '100%',
      float: 'left',
      color: theme.palette.text.primary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    vConArrBut: { marginTop: '-4px' },
    selected: {
      // borderBottomLeftRadius: '4px',
      // borderTopLeftRadius: '4px',
      backgroundColor: theme.palette.background.default
    },
    deSelected: {
      // borderBottomLeftRadius: '4px',
      // borderTopLeftRadius: '4px',
      backgroundColor: theme.palette.primary.light
    },
    toggleCon: {
      width: '100%',
      height: '15px',
      backgroundColor: theme.palette.primary.light,
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      display: 'flex',
      justifyContent: 'center'
    },
    toggleConBut: {
      height: '100%',
      width: '20%',
      backgroundColor: theme.palette.background.default,
      borderRadius: '2px',
      textAlign: 'center',
      color: theme.palette.text.primary
    }
  };
};

class Playback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: [],
      playerNum: 0,
      playerRef: {},
      toggleHeight: 24,
      vConOpen: true,
      videoInfo: {},
      global: props.global,
      drawerOpen: false,
      currentItem: {},
      controlRef: null
    };

    const { dispatch, global } = props;
    this.toggleHeightNUM = 24;
    this.dispatch = dispatch;
    this.videoStart = null;
    this.requestbuf = [];
    this.userId = global.userId;
    this.handleMessageFromPlayer = this.handleMessageFromPlayer.bind(this);
    this.layoutChange = this.layoutChange.bind(this);
    this.orderCommand = this.orderCommand.bind(this);
    this.treeOperation = this.treeOperation.bind(this);

    this.treeRender = {
      NodeIcon: 'null',
      TreeNode: null
      // () => {
      //   // return <TreeNodeText {...props} />;
      // }
    };
  }

  componentDidMount() {
    const { global } = this.props;
    this.layoutChange(1);
    this.dispatch({
      type: 'VMSPlayback/getChannelListData',
      payload: {
        id: global.userId
      }
    });
  }

  componentWillUnmount() {
    this.setState({ player: [], playerNum: 0, playerRef: {} });
  }

  componentWillReceiveProps(nextProps) {
    const { videoInfo, playerRef } = this.state;
    const rProps = nextProps.VMSPlayback;
    if (!_.isEqual(this.props, nextProps)) {
      const instance = rProps.id > -1 ? playerRef[`player${rProps.id}`] : {};
      if (rProps.playbackData) {
        if (instance && !_.isEqual(instance.state.streamInfo, rProps.playbackData)) {
          videoInfo[`player${rProps.id}`].records = rProps.playbackData.records;
          videoInfo[`player${rProps.id}`].bookmark = rProps.playbackData.bookmark;
          instance.setState({ streamInfo: rProps.playbackData }, () => {
            instance.transtion('playing');
          });
        }

        if (rProps.bookmark) {
          videoInfo[`player${rProps.id}`].bookmark = rProps.bookmark;
        }
        if (rProps.preview) {
          videoInfo[`player${rProps.id}`].preview = rProps.preview;
        }
        this.setState(videoInfo);
      }
    }
  }

  layoutChange(num) {
    const { playerNum, global } = this.state;
    const { dispatch } = this.props;
    if (num !== playerNum) {
      const player = [];
      for (let i = 0; i < num; i++) {
        player.push(
          <Player
            mode="playback"
            handleMessage={this.handleMessageFromPlayer}
            id={i}
            key={`player${i}`}
            layoutIndex={num}
            info={{ id: i }}
            global={global}
            dispatch={dispatch}
          />
        );
      }
      this.setState({ player, playerNum: num });
    }
  }

  orderCommand(msg) {
    const { playerRef } = this.state;
    switch (msg.type) {
      case 'controlRef':
        this.setState({ controlRef: msg.data });
        break;
      case 'pauseall':
        for (const keys in playerRef) {
          if (playerRef[keys].state.streamInfo) {
            playerRef[keys].transtion('pause');
          }
        }
        break;
      case 'playall':
        for (const keys in playerRef) {
          if (playerRef[keys].state.streamInfo) {
            playerRef[keys].transtion('playing');
          }
        }
        break;
      case 'endall':
        for (const keys in playerRef) {
          playerRef[keys].transtion('blackout');
          // playerRef[keys].destroy();
        }
        break;
      case 'resetall':
        for (const keys in playerRef) {
          if (playerRef[keys].state.streamInfo) {
            playerRef[keys].initPlayer(0);
          }

          // playerRef[keys].transtion('playing');
        }
        break;
      case 'skip':
        console.log(msg.ts);
        for (const keys in playerRef) {
          if (playerRef[keys].state.streamInfo) {
            playerRef[keys].skip(msg.data, msg.ts);
          }
        }
        break;

      case 'seek':
        for (const keys in playerRef) {
          if (playerRef[keys].state.streamInfo) {
            playerRef[keys].seek(msg.data);
          }
        }
        break;

      case 'scale':
        for (const keys in playerRef) {
          if (playerRef[keys].state.streamInfo) {
            playerRef[keys].setScaleFactor(msg.data);
          }
        }
        break;

      case 'currentSelectedTimeRange':
        for (const keys in playerRef) {
          playerRef[keys].startTime = new Date(msg.data.startTime).getTime();
          if (playerRef[keys].state.playerState !== 'blackout') {
            playerRef[keys].ts = new Date(msg.data.startTime).getTime();
          }
        }
        this.setState({ startTime: msg.data.startTime, endTime: msg.data.endTime });
        break;
      case 'delBookmark':
        this.dispatch({
          type: 'VMSPlayback/delBookmark',
          payload: msg.data,
          id: msg.id
        }).then(() => {
          this.getBookMark('all');
        });
        break;
      case 'getPreview':
        if (playerRef[`player${msg.id}`].itemDataSource) {
          this.dispatch({
            type: 'VMSPlayback/getPreview',
            payload: {
              time: msg.data,
              streamId: '0',
              channelId: playerRef[`player${msg.id}`].itemDataSource.channelId,
              deviceId: playerRef[`player${msg.id}`].itemDataSource.deviceId
            },
            id: msg.id
          });
        }

        break;
      case 'setTimeMethod':
        this.timeSet = msg.data;
        break;
      // case 'searchBookmark':
      //   this.dispatch({
      //     type: 'VMSPlayback/searchBookmark',
      //     payload: msg.data,
      //     getPayload: {
      //       channelId: playerRef[`player${msg.id}`].itemDataSource.channelId,
      //       channelName: playerRef[`player${msg.id}`].itemDataSource.channelName,
      //       createdId: this.userId,
      //       deviceId: playerRef[`player${msg.id}`].itemDataSource.deviceId,
      //       streamId: '0',
      //       type: 'rtsp/h264',
      //       from: moment(startTime).format('YYYY-MM-DDTHH:mm'),
      //       to: moment(endTime).format('YYYY-MM-DDTHH:mm')
      //     },
      //     id: msg.id
      //   });
      //   break;
      default:
        // eslint-disable-next-line
        console.info(msg);
        break;
    }
  }

  setTime = obj => {
    this.timeSet(obj.type, obj.time);
  };

  getBookMark = target => {
    const { playerRef, startTime, endTime } = this.state;
    if (target === 'all') {
      for (const keys in playerRef) {
        if (playerRef[keys].state.streamInfo) {
          this.dispatch({
            type: 'VMSPlayback/getBookmark',
            payload: {
              channelId: playerRef[keys].itemDataSource.channelId,
              channelName: playerRef[keys].itemDataSource.channelName,
              createdId: this.userId,
              deviceId: playerRef[keys].itemDataSource.deviceId,
              streamId: '0',
              type: 'rtsp/h264',
              from: moment(startTime).format('YYYY-MM-DDTHH:mm'),
              to: moment(endTime).format('YYYY-MM-DDTHH:mm')
            },
            id: playerRef[keys].info.id
          });
        }
      }
    }
  };

  handleMessageFromPlayer(msg) {
    const { playerRef, videoInfo, startTime, endTime, global, controlRef } = this.state;
    const { state, bookmark, records, preview } = videoInfo[`player${msg.id}`] || {};
    const { itemDataSource } = playerRef[`player${msg.id}`] || {};
    switch (msg.type) {
      case 'playerMonutRef':
        playerRef[`player${msg.id}`] = msg.data;
        videoInfo[`player${msg.id}`] = {
          ts: msg.data.ts,
          state: msg.data.state,
          id: msg.id,
          bookmark: msg.bookmark
        };
        this.setState({ playerRef, videoInfo });
        break;

      case 'playerUnmonutRef':
        delete playerRef[`player${msg.id}`];
        delete videoInfo[`player${msg.id}`];
        this.setState({ playerRef, videoInfo });
        break;

      case 'playerEndstream':
        videoInfo[`player${msg.id}`] = {};
        this.setState({ videoInfo });
        break;

      case 'receivedConfig':
        this.videoStart = new Date(startTime).getTime();
        playerRef[`player${msg.id}`].videoStart = new Date(startTime).getTime();
        this.dispatch({
          type: 'VMSPlayback/requestPlayback',
          payload: {
            ...msg.data,
            userId: global.userId,
            from: moment(startTime).format('YYYY-MM-DDTHH:mm'),
            to: moment(endTime).format('YYYY-MM-DDTHH:mm')
          },
          id: msg.id
        });
        break;

      case 'playerSaveBookmark':
        this.dispatch({
          type: 'VMSPlayback/saveBookmark',
          savePayload: {
            ...msg.data.savePayload,
            userId: global.userId
          },
          id: msg.id
        }).then(() => {
          this.getBookMark('all');
        });
        break;

      case 'endStream':
        this.dispatch({
          type: 'VMSPlayback/endStream',
          payload: {
            ...msg.data
          },
          id: msg.id
        });
        break;
      case 'timestampUpdate':
        videoInfo[`player${msg.id}`] = {
          ts: msg.data,
          state,
          id: msg.id,
          bookmark,
          records,
          itemDataSource,
          preview
        };
        this.setState({ videoInfo });
        break;
      case 'clipping':
        this.dispatch({
          type: 'VMSPlayback/clipping',
          payload: {
            ...msg.data
          },
          id: msg.id
        }).then(res => {
          if (!res) return;
          if (isSuccess(res)) {
            this.dispatch({
              type: 'messageCenter/addProgressBar',
              payload: {
                deviceName: itemDataSource.channelName,
                msg: 'Play Back Clipping In Progress..',
                clippingId: res.data.id,
                start: moment(this.startT).format(DATE_FORMAT_HH_MM_SS),
                end: moment(new Date()).format(DATE_FORMAT_HH_MM_SS)
              }
            });
          } else if (res) {
            msgCenter.error(res.message, 'Playback');
          }
        });
        break;
      case 'allSetResumeSeek':
        playerRef[`player${msg.id}`].initPlayer(
          Math.floor((msg.data - new Date(startTime).getTime()) / 1000) + 3,
          'resume'
        );
        break;
      case 'enableSkip':
        controlRef.setskip(true);
        break;
      case 'disableSkip':
        controlRef.setskip(false);
        break;
      case 'bookmarkPause':
        for (const keys in playerRef) {
          if (playerRef[keys].state.streamInfo) {
            playerRef[keys].transtion('pause');
          }
        }
        controlRef.setPlaypause(true);
        break;
      default:
        // eslint-disable-next-line
        console.info(msg);
        break;
    }
  }

  toggleDrawer = (bool, item) => {
    this.setState({ drawerOpen: bool, currentItem: item });
  };

  treeOperation() {
    return {
      onSearch: () => {},
      onSelectTreeNode: node => {
        if (node.deviceId) {
          this.toggleDrawer(true, node);
        }
      }
    };
  }

  render() {
    const { classes, VMSPlayback } = this.props;
    const { listData } = VMSPlayback; // , dispatch, global
    const {
      toggleHeight,
      vConOpen,
      videoInfo,
      playerNum,
      player,

      drawerOpen,
      currentItem
    } = this.state;
    const index = {
      groupNode: 'groupName', // the node that has children nodes
      singleNode: 'channelName' // the node that has no children nodes
    };
    const searchFields = [
      {
        title: 'Channel Name',
        index: 'channelName'
      }
    ];
    return (
      <div className={classes.pageContainer} id="pageContainer">
        <Drawer
          open={drawerOpen}
          onClose={() => {
            this.toggleDrawer(false);
          }}
        >
          <RecordingRender
            itemData={currentItem || {}}
            dispatch={this.dispatch}
            userId={this.userId}
            setTime={this.setTime}
          />
        </Drawer>
        <div className={classes.listContainer}>
          <div style={{ height: '100%' }}>
            <div
              style={{
                height: '7%',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '15px'
              }}
            >
              <Typography
                color="textSecondary"
                className={classes.title}
                component="span"
                variant="h6"
              >
                Resource Tree
              </Typography>
            </div>

            <div style={{ height: '93%', marginLeft: '15px' }}>
              {listData ? (
                <TreeList
                  dateSource={listData}
                  index={index}
                  treeOperation={this.treeOperation()}
                  searchFields={searchFields}
                  dragType="playback"
                />
              ) : (
                'list tree'
              )}
            </div>
          </div>
        </div>
        <div className={classes.videoContainer}>
          <div className={classes.vConHeader}>
            <div style={{ marginLeft: '15px' }}>
              <Typography
                color="textSecondary"
                className={classes.title}
                component="span"
                variant="h6"
              >
                Playback Panel
              </Typography>
            </div>
            <div className={classes.layoutButGroup}>
              <div
                className={`${classes.layoutBut} ${
                  playerNum === 1 ? classes.selected : classes.deSelected
                }`}
                onClick={() => {
                  this.layoutChange(1);
                }}
              >
                <ToolTip title="1 X 1">
                  <PanoramaWideAngle />
                </ToolTip>
              </div>
              <div
                className={`${classes.layoutBut} ${
                  playerNum === 6 ? classes.selected : classes.deSelected
                }`}
                onClick={() => {
                  this.layoutChange(6);
                }}
              >
                <ToolTip title="2 X 3">
                  <ViewModule />
                </ToolTip>
              </div>
            </div>
          </div>
          <div className={classes.vConBody} style={{ height: `${93 - toggleHeight}% ` }}>
            <div style={{ height: 'calc(100% - 15px)', width: '100%' }}>{player}</div>
            <div className={classes.toggleCon}>
              <div
                className={classes.toggleConBut}
                onClick={() => {
                  if (vConOpen) {
                    this.setState({ vConOpen: false, toggleHeight: 0 });
                  } else {
                    this.setState({
                      vConOpen: true,
                      toggleHeight: this.toggleHeightNUM
                    });
                  }
                }}
              >
                {vConOpen ? (
                  <KeyboardArrowDown className={classes.vConArrBut} />
                ) : (
                  <KeyboardArrowUp className={classes.vConArrBut} />
                )}
              </div>
            </div>
          </div>
          <ControlSection
            className={classes.vConCtrl}
            style={{ height: `${toggleHeight}%` }}
            show={vConOpen}
            videoInfo={videoInfo}
            orderCommand={this.orderCommand}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(
  connect(({ VMSPlayback, global }) => ({ VMSPlayback, global }))(Playback)
);
