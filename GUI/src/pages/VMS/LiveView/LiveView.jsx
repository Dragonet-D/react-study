import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { connect } from 'dva';
import { ToolTip, Permission } from 'components/common';
import {
  PanoramaWideAngle,
  SelectAll,
  BorderAll,
  Apps,
  Fullscreen,
  Settings,
  Cancel,
  Replay
} from '@material-ui/icons';
import materialKeys from 'utils/materialKeys';
import { TreeList } from 'components/VMS/TreeList';
import { PtzPreset } from 'components/VMS/LiveView';
import Player from '../player/livePlayer';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      width: '400px',
      height: '500px',
      margin: '0 auto',
      paddingTop: theme.spacing(5),
      backgroundColor: theme.palette.background.default
    },
    pageContainer: {
      height: 'calc(100% - 56px)',
      width: '100%',
      display: 'flex',
      borderRadius: '4px',
      marginTop: '6px'
    },
    listContainer: {
      height: '100%',
      width: '30%',
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
      height: '93%',
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    vConCtrl: {
      // height: "20%",
      width: '100%',
      backgroundColor: 'blue'
    },
    layoutButGroup: {
      width: '50%',
      height: '68%',
      backgroundColor: theme.palette.primary.light,
      marginRight: '15px',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    layoutBut: {
      width: '25%',
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
    },
    ptzPanel: {
      margin: '5px',
      border: `1px solid ${theme.palette.grey.A200}`,
      borderRadius: '4px',
      overflow: 'hidden scroll'
    },
    treeContainer: {
      margin: '5px',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    controlButG: {
      width: '35%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    controlBut: {
      marginRight: '6px',
      cursor: 'pointer'
    }
  };
});

function LiveView(props) {
  const classes = useStyles();
  const { dispatch, global, VMSLiveView } = props;
  const { userId } = global;
  const { listData, videoPlayInfo, defaultData, presetsDatasource } = VMSLiveView;
  const [playerRef, setPlayerRef] = useState({});
  const [playerNum, setPlayerNum] = useState(0);
  const [ptzControlIndex, setptzControlIndex] = useState(null);
  const [clipContent, setclipContent] = useState({});
  const videofullview = useRef(null);
  // const [listData, setListData] = useState(null);

  let renderPlay = null;

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

  useEffect(() => {
    layoutChange(1);
    getDefault(userId);
    dispatch({
      type: 'VMSLiveView/getChannelListData',
      payload: {
        id: global.userId
      }
    });
  }, []);

  useEffect(() => {
    if (defaultData) {
      setPlayerNum(defaultData.layoutNum);
      dispatch({ type: 'VMSLiveView/setDefaultPlay', payload: defaultData.defaultData });
      defaultData.defaultData.forEach((x, i) => {
        const { channelId, channelName, deviceId, ptzInd } = x;
        playerRef[`player${i}`].receivedConfig({
          channelId,
          channelName,
          deviceId,
          streamId: '0',
          type: 'rtsp/h264',
          ptzInd
        });
      });
    }
  }, [defaultData]);

  function getDefault() {
    dispatch({
      type: 'VMSLiveView/getDefault',
      payload: {
        userId
      }
    })
      .then(res => {
        if (res) {
          setPlayerNum(res.layoutNum);
          renderPlay = res.defaultData;
        }
      })
      .then(() => {
        if (renderPlay) {
          renderPlay.forEach((x, i) => {
            const { channelId, channelName, deviceId, ptzInd } = x;
            playerRef[`player${i}`].itemDataSource = x;
            playerRef[`player${i}`].receivedConfig({
              channelId,
              channelName,
              deviceId,
              streamId: '0',
              type: 'rtsp/h264',
              ptzInd
            });
          });
        }
      });
  }

  useEffect(() => {
    if (videoPlayInfo && videoPlayInfo.id > -1) {
      const videoInstance = playerRef[`player${videoPlayInfo.id}`];
      if (videoInstance) {
        videoInstance.setState({ streamInfo: videoPlayInfo.data }, () => {
          videoInstance.transtion('playing');
        });
      }
    }
  }, [videoPlayInfo]);

  function layoutChange(num) {
    if (num !== playerNum) {
      setPlayerNum(num);
    }
  }

  function handleMessageFromPlayer(msg) {
    switch (msg.type) {
      case 'playerMonutRef':
        playerRef[`player${msg.id}`] = msg.data;
        // videoInfo[`player${msg.id}`] = {
        //   ts: msg.data.ts,
        //   state: msg.data.state,
        //   id: msg.id,
        //   bookmark: msg.bookmark
        // };
        setPlayerRef(playerRef);
        break;
      case 'playerUnmonutRef':
        delete playerRef[`player${msg.id}`];
        // delete videoInfo[`player${msg.id}`];
        setPlayerRef(playerRef);
        break;
      case 'ptzControlIndex':
        setptzControlIndex(msg.id);
        break;
      case 'endStream':
        dispatch({ type: 'VMSLiveView/endStream', payload: msg.data });
        break;
      case 'beginClipping':
        clipContent[`player${msg.id}`] = { start: msg.data, id: msg.id };
        setclipContent(clipContent);

        break;
      case 'endClipping':
        dispatch({
          type: 'VMSLiveView/cliping',
          payload: { ...clipContent[`player${msg.id}`], end: msg.data }
        });
        break;
      default:
        break;
    }
  }

  function ptzControl(obj) {
    dispatch({
      type: 'VMSLiveView/ptzControl',
      payload: obj
    });
  }

  function getPtzPreset(obj) {
    const info = playerRef[`player${ptzControlIndex}`].itemDataSource;
    const { channelId, deviceId } = info;
    dispatch({
      type: 'VMSLiveView/getPtzPreset',
      payload: { ...obj, channelId, deviceId }
    });
  }

  function handleSetDefault() {
    const payload = { defaultData: [], layoutNum: playerNum, userId };
    for (const keys in playerRef) {
      if (playerRef[keys].itemDataSource) {
        payload.defaultData.push(playerRef[keys].itemDataSource);
      }
    }
    dispatch({
      type: 'VMSLiveView/setDefault',
      payload
    });
  }

  function setPTZpreset(type, namestr, index, config) {
    if (type === 'set') {
      dispatch({
        type: 'VMSLiveView/setPTZpreset',
        method: 'post',
        payload: {
          deviceId: config.itemSource.deviceId,
          channelId: config.itemSource.channelId,
          index
        }
      }).then(() => {
        getPtzPreset({ psize: config.pageSize, pindex: config.pageNo, index: '', name: '' });
      });
    } else if (type === 'update') {
      dispatch({
        type: 'VMSLiveView/updatePTZpreset',
        method: 'put',
        payload: {
          name: namestr,
          deviceId: config.itemSource.deviceId,
          channelId: config.itemSource.channelId,
          index
        }
      }).then(() => {
        getPtzPreset({ psize: config.pageSize, pindex: config.pageNo, index: '', name: '' });
      });
    }
  }

  function endAll() {
    for (const keys in playerRef) {
      if (playerRef[keys].state.streamInfo) {
        playerRef[keys].endStream();
      }
    }
  }

  function refreshAll() {
    for (const keys in playerRef) {
      if (playerRef[keys].state.streamInfo) {
        playerRef[keys].initPlayer();
      }
    }
  }

  function delPTZpreset(obj) {
    dispatch({
      type: 'VMSLiveView/delPTZpreset',
      payload: obj
    }).then(() => {
      getPtzPreset({ psize: 5, pindex: 0, index: '', name: '' });
    });
  }

  const layoutButGroup = (num = [1, 4, 9, 16]) => {
    const group = [];
    const but = [0, <PanoramaWideAngle />, <BorderAll />, <Apps />, <SelectAll />];
    num.map(x => {
      group.push(
        <div
          className={`${classes.layoutBut} ${
            playerNum === x ? classes.selected : classes.deSelected
          }`}
          onClick={() => {
            layoutChange(x);
          }}
          key={`layoutButVal${x}`}
        >
          <ToolTip title={`${Math.sqrt(x)} X ${Math.sqrt(x)}`}>{but[Math.sqrt(x)]}</ToolTip>
        </div>
      );
      return x;
    });
    return group;
  };

  const playerRender = () => {
    const player = [];
    for (let i = 0; i < playerNum; i++) {
      player.push(
        <Player
          mode="playback"
          handleMessage={handleMessageFromPlayer}
          id={i}
          key={`player${i}`}
          layoutIndex={playerNum}
          info={{ id: i }}
          global={global}
          ptzConIndex={ptzControlIndex}
          dispatch={dispatch}
        />
      );
    }
    return player;
  };

  return (
    <div className={classes.pageContainer} id="pageContainer">
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
            {/* <span style={{ fontSize: '1.5vw' }}>Resource Tree</span> */}
          </div>

          <div
            style={{ height: `${!(ptzControlIndex === null) ? 50 : 93}%` }}
            className={classes.treeContainer}
          >
            {listData ? (
              <TreeList
                dateSource={listData}
                index={index}
                searchFields={searchFields}
                dragType="liveview"
              />
            ) : (
              'list tree'
            )}
          </div>
          <Permission materialKey={materialKeys['M4-92']}>
            <div
              style={{
                height: `${!(ptzControlIndex === null) ? 41 : 0}%`,
                display: ptzControlIndex === null ? 'none' : 'block'
              }}
              className={classes.ptzPanel}
            >
              {!(ptzControlIndex === null) && (
                <PtzPreset
                  getPtzPreset={getPtzPreset}
                  dataSource={presetsDatasource}
                  itemSource={playerRef[`player${ptzControlIndex}`].itemDataSource}
                  setPTZpreset={setPTZpreset}
                  delPTZpreset={delPTZpreset}
                  userId={userId}
                  ptzControl={ptzControl}
                />
              )}
            </div>
          </Permission>
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
              Live View Panel
            </Typography>
            {/* <span style={{ fontSize: '1.5vw' }}>Live View Panel</span> */}
          </div>
          <div className={classes.controlButG}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <ToolTip title="Full screen">
                <Fullscreen
                  className={classes.controlBut}
                  onClick={() => {
                    // this.setState({ fullScreen: true });
                    videofullview.current.requestFullscreen();
                  }}
                />
              </ToolTip>
              <ToolTip title="Set Default">
                <Settings className={classes.controlBut} onClick={handleSetDefault} />
              </ToolTip>
              <ToolTip title="End All">
                <Cancel className={classes.controlBut} onClick={endAll} />
              </ToolTip>
              <ToolTip title="Refresh">
                <Replay className={classes.controlBut} onClick={refreshAll} />
              </ToolTip>
            </div>
            <div className={classes.layoutButGroup}>{layoutButGroup()}</div>
          </div>
        </div>
        <div className={classes.vConBody} id="videofullview" ref={videofullview}>
          <div style={{ height: '100%', width: '100%' }}>{playerRender()}</div>
        </div>
      </div>
    </div>
  );
}

export default connect(({ VMSLiveView, global }) => ({ VMSLiveView, global }))(LiveView);
