/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import IconButton from '@material-ui/core/IconButton';
// import moment from 'moment';
import _ from 'lodash';
import Player from 'pages/VMS/player/PlaybackPlayerForVapInstance';
// list
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Videocam from '@material-ui/icons/Videocam';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import CropFree from '@material-ui/icons/CropFree';
import BorderColor from '@material-ui/icons/BorderColor';
import Replay from '@material-ui/icons/Replay';
import AddCircle from '@material-ui/icons/AddCircle';
import Clear from '@material-ui/icons/Clear';
import PhotoSizeSelectSmall from '@material-ui/icons/PhotoSizeSelectSmall';
import { DragListItem } from 'components/UVAP';
import { withStyles } from '@material-ui/styles';
import { TextField, ToolTip } from 'components/common';

const styles = theme => {
  return {
    listContainer: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: '0px',
      marginRight: '6px',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.primary.light}`
    },
    detailsBox: { height: '100%', position: 'relative' },
    toolbar_button: {
      marginLeft: 'auto',
      marginRight: '8px'
    },
    videoPlayer: {
      width: '100%',
      height: '100%',
      float: 'left'
    },
    canvasBc: {
      position: 'absolute'
    },
    channelMenu: {
      position: 'relative',
      zIndex: '999',
      maxHeight: '200px',
      overflow: 'auto'
    }
  };
};

let contextDraw = null;
// let canvasContext = null;
let canvasDraw = null;
let canvas = null;
let video = null;
let canvasBox = null;

class LiveVaInstanceVideoBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentAction: '',
      currentDrawData: [],
      currentDrawName: '',
      isClosePath: false,
      linesObj: {},
      regionsObj: {},
      oldDrawData: [],
      playerRef: {},
      videoInfo: {},
      isShowRegion: false,
      isNewPoint: false,
      hasRegions: false,
      hasLines: false,
      channelMenuStatus: false
    };
    const { dispatch } = props;
    this.dispatch = dispatch;
  }

  componentWillReceiveProps(nextProps) {
    const { linesObj, regionsObj, isShowRegion } = this.state;
    let newLinesObj = {};
    let newRegionsObj = {};
    if (!_.isNil(nextProps.parameters) && !_.isEmpty(nextProps.parameters)) {
      _.forEach(nextProps.parameters, param => {
        if (param.name === 'lines') newLinesObj = _.clone(param);
        else if (param.name === 'regions') newRegionsObj = _.clone(param);
      });
      if (!_.isEqual(linesObj, newLinesObj)) {
        this.setState(
          {
            linesObj: newLinesObj
          },
          () => {
            if (isShowRegion) this.changeParameterToDrawData();
          }
        );
      }
      if (!_.isEqual(regionsObj, newRegionsObj)) {
        this.setState(
          {
            regionsObj: newRegionsObj
          },
          () => {
            if (isShowRegion) this.changeParameterToDrawData();
          }
        );
      }
    }
    if (!_.isEmpty(nextProps.availableOptions)) {
      _.forEach(nextProps.availableOptions, option => {
        if (option.name === 'regions') this.setState({ hasRegions: true });
        else if (option.name === 'lines') this.setState({ hasLines: true });
      });
    }
    const { videoInfo, playerRef } = this.state;
    const rProps = nextProps.VMSLiveView;
    rProps.id = 0;
    if (!_.isEqual(this.props, nextProps)) {
      const instance = playerRef[`player${rProps.id}`];
      if (rProps.videoPlayInfo) {
        if (!_.isEqual(instance.state.streamInfo, rProps.videoPlayInfo.data)) {
          // videoInfo[`player${rProps.id}`].records = rProps.videoPlayInfo.data.records;
          // videoInfo[`player${rProps.id}`].bookmark = rProps.playbackData.bookmark;
          instance.setState({ streamInfo: rProps.videoPlayInfo.data }, () => {
            instance.transtion('playing');
          });
        }
        this.setState(videoInfo);
      }
    }
  }

  componentDidMount() {
    canvas = document.getElementById('myCanvas');
    canvasDraw = document.getElementById('myCanvas_draw');
    canvasDraw.width = '0px';
    canvasDraw.height = '0px';
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizefunc);
  }

  handleMessageFromPlayer = msg => {
    const { playerRef, videoInfo } = this.state;
    const { global } = this.props;
    const { state, bookmark } = videoInfo[`player${msg.id}`] || {};
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

      case 'receivedConfig':
        playerRef[`player${msg.id}`].videoStart = _.toNumber(new Date().getTime());
        this.dispatch({
          type: 'VMSLiveView/getLiveStream',
          payload: {
            ...msg.data,
            userId: global.userId
            // from: moment(new Date().getTime()).format('YYYY-MM-DDTHH:mm'),
            // to: moment(new Date().getTime()).format('YYYY-MM-DDTHH:mm')
          },
          id: msg.id
        });
        break;

      case 'playerSaveBookmark':
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
          bookmark
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
        });
        break;
      default:
        // eslint-disable-next-line
        console.info(msg);
        break;
    }
  };

  resizefunc = () => {
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    canvasDraw.width = video.clientWidth;
    canvasDraw.height = video.clientHeight;

    this.changeParameterToDrawData();

    this.drawcurrentDrawData();
  };

  showRegions = () => {
    this.setState({
      isShowRegion: true
    });
    window.removeEventListener('resize', this.resizefunc);
    video = document.getElementById('videoPlayer');
    canvas = document.getElementById('myCanvas');
    canvasDraw = document.getElementById('myCanvas_draw');
    contextDraw = canvasDraw.getContext('2d');
    // canvasContext = canvas.getContext('2d');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    canvasDraw.width = video.clientWidth;
    canvasDraw.height = video.clientHeight;
    canvas.style['z-index'] = '99';
    canvasDraw.style['z-index'] = '99';
    window.addEventListener('resize', this.resizefunc);

    this.changeParameterToDrawData();

    this.drawcurrentDrawData();
  };

  closeRegion = () => {
    const { oldDrawData } = this.state;
    window.removeEventListener('resize', this.resizefunc);
    canvas.style['z-index'] = '0';
    canvasDraw.style['z-index'] = '0';
    canvas.width = 0;
    canvas.height = 0;
    canvasDraw.width = 0;
    canvasDraw.height = 0;
    oldDrawData.forEach((draw, index) => {
      const oldNode = document.getElementById(`${draw.name}-${index}`);
      if (oldNode) canvasBox.removeChild(oldNode);
    });
    this.setState({
      isShowRegion: false
    });
  };

  openCanvas = type => {
    const { currentAction } = this.state;
    if (currentAction === type) {
      this.setState({
        currentAction: '',
        currentDrawData: [],
        currentDrawName: ''
      });
      if (currentAction === 'regions') {
        this.removeEventListener('click', canvasDraw, this.drawRegion);
        contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
      } else if (currentAction === 'lines') {
        this.removeEventListener('click', canvasDraw, this.drawLine);
        contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
      }

      return false;
    }
    video = document.getElementById('videoPlayer');
    canvas = document.getElementById('myCanvas');
    canvasDraw = document.getElementById('myCanvas_draw');
    contextDraw = canvasDraw.getContext('2d');
    // canvasContext = canvas.getContext('2d');

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    canvasDraw.width = video.clientWidth;
    canvasDraw.height = video.clientHeight;
    canvas.style['z-index'] = '99';
    canvasDraw.style['z-index'] = '99';

    if (currentAction === 'regions') {
      this.removeEventListener('click', canvasDraw, this.drawRegion);
      contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
    } else if (currentAction === 'lines') {
      this.removeEventListener('click', canvasDraw, this.drawLine);
      contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
    }

    this.setState({
      currentDrawData: [],
      currentAction: type
    });

    if (type === 'regions') {
      canvasDraw.addEventListener('click', this.drawRegion);
    } else if (type === 'lines') {
      canvasDraw.addEventListener('click', this.drawLine);
    }
  };

  // 画点
  drawPoint = (ctx, point) => {
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(point.x * canvasDraw.width - 4, point.y * canvasDraw.height - 4, 8, 8);
    ctx.font = '12px bold 宋体';
    ctx.fillText(
      `(${point.x},${point.y})`,
      point.x * canvasDraw.width,
      point.y * canvasDraw.height
    );
  };

  // 划线
  getLine = (canvasDraw, ctx, points, isClose, isOldDraw, drawName, drawType) => {
    let { currentDrawName, currentAction } = this.state;
    currentDrawName = isOldDraw ? drawName : currentDrawName;
    currentAction = isOldDraw ? drawType : currentAction;
    ctx.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
    ctx.strokeStyle = 'rgb(255,255,255)';
    if (points.length === 0) return false;
    ctx.beginPath();
    ctx.moveTo(points[0].x * canvasDraw.width, points[0].y * canvasDraw.height);
    for (let i = 0; i < points.length; i++) {
      this.drawPoint(ctx, points[i]);
      if (i >= 0) ctx.lineTo(points[i].x * canvasDraw.width, points[i].y * canvasDraw.height);
    }
    ctx.setLineDash([3, 3, 3]);
    ctx.lineCap = 'round';
    if (isClose && currentAction === 'regions') {
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fill();
      const textPoint = this.getAreaCenterPoint(points);
      textPoint.xx -= (currentDrawName.length * 9) / 2;
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.font = '18px bold 宋体';
      ctx.fillText(currentDrawName, textPoint.xx, textPoint.yy);
    } else if (currentAction === 'lines') {
      const textPoint = this.getLineCenterPoint(points);
      textPoint.x -= (currentDrawName.length * 9) / 2;
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.font = '18px bold 宋体';
      ctx.fillText(currentDrawName, textPoint.x, textPoint.y);
    }
    ctx.stroke();
  };

  Area = (p0, p1, p2) => {
    let area = 0.0;
    area = p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p1.x * p0.y - p2.x * p1.y - p0.x * p2.y;
    return area / 2;
  };

  getLineCenterPoint = points => {
    let x = 0;
    let y = 0;
    x = (points[0].x * canvasDraw.width + points[points.length - 1].x * canvasDraw.width) / 2;
    y = (points[0].y * canvasDraw.height + points[points.length - 1].y * canvasDraw.height) / 2;

    return { x, y };
  };

  getAreaCenterPoint = points => {
    let sumX = 0;
    let sumY = 0;
    let sumArea = 0;
    let p1 = points[1];
    for (let i = 2; i < points.length; i++) {
      const p2 = points[i];
      const area = this.Area(points[0], p1, p2);
      sumArea += area;
      sumX +=
        (points[0].x * canvasDraw.width + p1.x * canvasDraw.width + p2.x * canvasDraw.width) * area;
      sumY +=
        (points[0].y * canvasDraw.height + p1.y * canvasDraw.height + p2.y * canvasDraw.height) *
        area;
      p1 = p2;
    }
    const xx = _.parseInt(sumX / sumArea / 3);
    const yy = _.parseInt(sumY / sumArea / 3);
    return { xx, yy };
  };

  closePath = (canvasDraw, contextDraw, currentDrawData) => {
    this.getLine(canvasDraw, contextDraw, currentDrawData, true);

    this.setState({
      isClosePath: true
    });
  };

  removeEventListener = (action, node, func) => {
    node.removeEventListener(action, func);
  };

  drawRegion = event => {
    const { currentDrawData } = this.state;
    const ev = event || window.event;
    let x = '';
    let y = '';
    x = this.changeCoordinateToPercentage(
      'x',
      ev.clientX - canvasDraw.getBoundingClientRect().left
    );
    y = this.changeCoordinateToPercentage('y', ev.clientY - canvasDraw.getBoundingClientRect().top);
    const point = { x, y };
    let isNewPoint = true;
    currentDrawData.forEach(pathPoint => {
      if (
        pathPoint.x * canvasDraw.width - 5 <= point.x * canvasDraw.width &&
        point.x * canvasDraw.width <= pathPoint.x * canvasDraw.width + 5 &&
        pathPoint.y * canvasDraw.height - 5 <= point.y * canvasDraw.height &&
        point.y * canvasDraw.height <= pathPoint.y * canvasDraw.height + 5
      ) {
        isNewPoint = false;
      }
    });
    if (isNewPoint) {
      currentDrawData.push(point);
      if (currentDrawData.length === 0) {
        this.drawPoint(contextDraw, point);
      } else if (currentDrawData.length >= 1) {
        this.getLine(canvasDraw, contextDraw, currentDrawData, false);
      }
      this.setState({
        currentDrawData,
        isNewPoint
      });
    } else {
      // close the regions
      this.closePath(canvasDraw, contextDraw, currentDrawData);
    }
  };

  drawLine = event => {
    const { currentDrawData } = this.state;
    const ev = event || window.event;
    let x = '';
    let y = '';
    x = this.changeCoordinateToPercentage(
      'x',
      ev.clientX - canvasDraw.getBoundingClientRect().left
    );
    y = this.changeCoordinateToPercentage('y', ev.clientY - canvasDraw.getBoundingClientRect().top);
    const point = { x, y };
    let isInvalidPoint = false;
    // let isSecondPoint = currentDrawData.length === 2;

    currentDrawData.forEach(pathPoint => {
      if (
        pathPoint.x * canvasDraw.width - 5 <= point.x * canvasDraw.width &&
        point.x * canvasDraw.width <= pathPoint.x * canvasDraw.width + 5 &&
        pathPoint.y * canvasDraw.height - 5 <= point.y * canvasDraw.height &&
        point.y * canvasDraw.height <= pathPoint.y * canvasDraw.height + 5
      ) {
        isInvalidPoint = true;
      }
    });

    isInvalidPoint = currentDrawData.length === 2;
    if (!isInvalidPoint) {
      currentDrawData.push(point);
      if (currentDrawData.length === 0) {
        this.drawPoint(contextDraw, point);
      } else if (currentDrawData.length >= 1) {
        this.getLine(canvasDraw, contextDraw, currentDrawData, false);
      }

      this.setState({
        currentDrawData
      });
    } else {
      // this.closePath(canvasDraw, contextDraw, currentDrawData);
      // this.removeEventListener("click", canvasDraw, this.drawLine);
    }
  };

  createOldDrawDataCanvas = () => {
    const { oldDrawData } = this.state;
    if (oldDrawData.length > 0) {
      video = document.getElementById('videoPlayer');
      canvasBox = document.getElementById('canvasBox');
      oldDrawData.forEach((draw, index) => {
        const oldNode = document.getElementById(`${draw.name}-${index}`);
        if (oldNode) canvasBox.removeChild(oldNode);

        const newCanvas = document.createElement('canvas');
        newCanvas.id = `${draw.name}-${index}`;
        newCanvas.style.position = 'absolute';
        newCanvas.style['z-index'] = '99';

        const contextDraw = newCanvas.getContext('2d');
        canvasDraw = document.getElementById('myCanvas_draw');

        newCanvas.width = video.clientWidth;
        newCanvas.height = video.clientHeight;
        canvasDraw.parentNode.insertBefore(newCanvas, canvasDraw);
        // draw line
        if (draw.type === 'lines') {
          this.getLine(newCanvas, contextDraw, draw.points, true, true, draw.name, 'lines');
        }
        if (draw.type === 'regions') {
          this.getLine(newCanvas, contextDraw, draw.points, true, true, draw.name, 'regions');
        }
      });
    }
  };

  drawcurrentDrawData = () => {
    const { currentDrawData, currentAction, currentDrawName } = this.state;
    if (currentDrawData.length > 0) {
      video = document.getElementById('videoPlayer');
      canvasBox = document.getElementById('canvasBox');
      // draw line
      if (currentAction === 'lines') {
        this.getLine(
          canvasDraw,
          contextDraw,
          currentDrawData,
          true,
          true,
          currentDrawName,
          'lines'
        );
      }
      const { isNewPoint } = this.state;
      if (currentAction === 'regions') {
        if (isNewPoint) {
          if (currentDrawData.length === 0) {
            this.drawPoint(contextDraw, currentDrawData[0]);
          } else if (currentDrawData.length >= 1) {
            this.getLine(canvasDraw, contextDraw, currentDrawData, false);
          }
        } else {
          // close the regions
          this.closePath(canvasDraw, contextDraw, currentDrawData);
        }
      }
    }
  };

  changeParameterToDrawData = () => {
    const { linesObj, regionsObj } = this.state;
    if (!!linesObj && !!linesObj.value) {
      const oldDrawData = linesObj.value.split(';').map(item => {
        const name = item.split(',')[0];
        const point1 = {
          x: item.split(',')[1],
          y: item.split(',')[2]
        };
        const point2 = {
          x: item.split(',')[3],
          y: item.split(',')[4]
        };
        return {
          name,
          type: 'lines',
          points: [point1, point2]
        };
      });

      this.setState(
        {
          oldDrawData
        },
        () => {
          this.createOldDrawDataCanvas();
        }
      );
    } else if (!!regionsObj && !!regionsObj.value) {
      const oldDrawData = regionsObj.value.split(';').map(item => {
        item = item.replace('polygon,', '');
        const items = item.split(',');
        const name = items[0];
        const points = [];
        const point = {};
        for (const index in items) {
          if (index !== '0' && index % 2 === 1) {
            point.x = items[index];
          }
          if (index !== '0' && index % 2 === 0) {
            point.y = items[index];
            points.push(Object.assign({}, point));
          }
        }
        return {
          name,
          type: 'regions',
          points
        };
      });

      this.setState(
        {
          oldDrawData
        },
        () => {
          this.createOldDrawDataCanvas();
        }
      );
    }
  };

  revokeData = () => {
    const { currentDrawData } = this.state;
    currentDrawData.pop();
    this.setState(
      {
        currentDrawData
      },
      () => {
        this.getLine(canvasDraw, contextDraw, currentDrawData, false);
      }
    );
  };

  changeCoordinateToPercentage = (type, val) => {
    if (type === 'x') {
      // Keep one decimal place
      return Math.floor((val / canvasDraw.width) * 1000) / 1000;
    } else if (type === 'y') {
      // Keep one decimal place
      return Math.floor((val / canvasDraw.height) * 1000) / 1000;
    }
  };

  handleSetParameters = (params, option) => {
    let hasParam = '';
    _.forEach(params, param => {
      if (param.name === option.name) {
        hasParam = true;
      }
      return param.name !== option.name;
    });
    if (hasParam) {
      _.forEach(params, param => {
        if (param.name === option.name) {
          param.value = `${param.value}${param.value !== '' ? ';' : ''}${option.value}`;
        }
      });
    } else {
      params.push({ keep: true, name: option.name, value: option.value, scope: option.scope });
    }
    return _.cloneDeep(params);
  };

  addRegion = () => {
    const { currentAction, currentDrawData, currentDrawName } = this.state;
    const { setParameters, parameters } = this.props;

    if (currentAction === 'lines') {
      canvasDraw.removeEventListener('click', this.drawLine);
      let valStr = `${currentDrawName}`;
      currentDrawData.forEach(point => {
        valStr = `${valStr},${point.x},${point.y}`;
      });
      const obj = {
        name: 'lines',
        scope: 'instance',
        value: valStr
      };
      setParameters(this.handleSetParameters(parameters, obj));
      // clear draw canvas and draw data
      contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
      this.setState({
        currentDrawData: [],
        currentDrawName: '',
        currentAction: ''
      });
    } else if (currentAction === 'regions') {
      canvasDraw.removeEventListener('click', this.drawRegion);
      let valStr = `${currentDrawName},polygon`;
      currentDrawData.forEach(point => {
        valStr = `${valStr},${point.x},${point.y}`;
      });
      const obj = {
        name: 'regions',
        scope: 'instance',
        value: valStr
      };
      setParameters(this.handleSetParameters(parameters, obj));
      // clear draw canvas and draw data
      contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
      this.setState({
        currentDrawData: [],
        currentDrawName: '',
        currentAction: ''
      });
    }
  };

  render() {
    const { global, channelNode, classes } = this.props;
    const {
      isShowRegion,
      currentAction,
      currentDrawData,
      isClosePath,
      hasRegions,
      hasLines,
      currentDrawName,
      channelMenuStatus
    } = this.state;
    let addBtnStatus = false;
    if (currentAction === 'regions') {
      addBtnStatus = !isClosePath;
    }
    if (currentAction === 'lines') {
      addBtnStatus = !(currentDrawData.length === 2);
    }
    return (
      <Fragment>
        <List component="nav">
          <ListItem button onClick={() => this.setState({ channelMenuStatus: !channelMenuStatus })}>
            <ListItemIcon>
              <Videocam />
            </ListItemIcon>
            <ListItemText primary="Source Provider" />
            {channelMenuStatus ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={channelMenuStatus} timeout="auto">
            <List component="div" disablePadding className={classes.channelMenu}>
              {!_.isEmpty(channelNode) &&
                channelNode.map(node => (
                  <ListItem button disabled={isShowRegion}>
                    <DragListItem node={node} />
                  </ListItem>
                ))}
            </List>
          </Collapse>
        </List>
        <div className={classes.videoPlayer} id="canvasBox">
          <canvas id="myCanvas" className={classes.canvasBc} />
          <canvas
            id="myCanvas_draw"
            className={classes.canvasBc}
            style={{ background: 'rgba(0,0,0,.4)' }}
          />
          <div id="videoPlayer" className={classes.videoPlayer}>
            <Player
              mode="playback"
              handleMessage={this.handleMessageFromPlayer}
              id={1}
              key={`player${0}`}
              // layoutIndex={num}
              info={{ id: 0 }}
              global={global}
              dispatch={this.dispatch}
            />
          </div>
        </div>
        {!_.isEmpty(channelNode) && (
          <div style={{ marginTop: '10px' }}>
            {!isShowRegion && (
              <ToolTip title="Show Regions">
                <IconButton aria-label="Show Regions" onClick={() => this.showRegions()}>
                  <PhotoSizeSelectSmall />
                </IconButton>
              </ToolTip>
            )}
            {isShowRegion && (
              <ToolTip title="Close Regions">
                <IconButton aria-label="Close Regions" onClick={() => this.closeRegion()}>
                  <Clear />
                </IconButton>
              </ToolTip>
            )}
            {currentAction !== 'regions' && hasRegions && (
              <ToolTip title="Draw Region">
                <IconButton
                  aria-label="Draw Region"
                  onClick={() => this.openCanvas('regions')}
                  disabled={!isShowRegion}
                >
                  <CropFree />
                </IconButton>
              </ToolTip>
            )}
            {currentAction === 'regions' && hasRegions && (
              <ToolTip title="Close Draw Region">
                <IconButton
                  aria-label="Close Draw Region"
                  onClick={() => this.openCanvas('regions')}
                  disabled={!isShowRegion}
                >
                  <Clear />
                </IconButton>
              </ToolTip>
            )}
            {currentAction !== 'lines' && hasLines && (
              <ToolTip title="Draw Line">
                <IconButton
                  aria-label="Draw Line"
                  onClick={() => this.openCanvas('lines')}
                  disabled={!isShowRegion}
                >
                  <BorderColor />
                </IconButton>
              </ToolTip>
            )}
            {currentAction === 'lines' && hasLines && (
              <ToolTip title="Close Draw Line">
                <IconButton
                  aria-label="Close Draw Line"
                  onClick={() => this.openCanvas('lines')}
                  disabled={!isShowRegion}
                >
                  <Clear />
                </IconButton>
              </ToolTip>
            )}
            <ToolTip title="Revoke">
              <IconButton
                aria-label="Revoke"
                onClick={() => this.revokeData()}
                disabled={!isShowRegion || _.isEmpty(currentDrawData)}
              >
                <Replay />
              </IconButton>
            </ToolTip>
            <ToolTip title="Add Region">
              <IconButton
                aria-label="Add Region"
                onClick={this.addRegion}
                disabled={addBtnStatus || !isShowRegion || _.isEmpty(currentDrawData)}
              >
                <AddCircle />
              </IconButton>
            </ToolTip>
            <TextField
              id="regionName"
              placeholder="Region Name"
              value={currentDrawName}
              margin="normal"
              onChange={e => {
                this.setState(
                  {
                    currentDrawName: e.target.value
                  },
                  // eslint-disable-next-line react/destructuring-assignment
                  () => this.getLine(canvasDraw, contextDraw, this.state.currentDrawData, true)
                );
              }}
              inputProps={{ maxLength: '50' }}
              disabled={!isShowRegion}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(
  connect(({ global, liveVaInstance, VMSLiveView }) => ({
    global,
    liveVaInstance,
    VMSLiveView
  }))(LiveVaInstanceVideoBox)
);
