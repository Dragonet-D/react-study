import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
// import Permission from 'commons/components/permissionComponent';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import msg from 'utils/messageCenter';
import {
  Cancel,
  Replay,
  ChevronLeft,
  ChevronRight,
  PlayArrow,
  Pause,
  Bookmarks
} from '@material-ui/icons';
import { DatePicker, SingleSelect, ToolTip } from 'components/common';
import { DATE_FORMAT_DATE_PICKER } from 'commons/constants/const';
import './Playback.module.less';
import _ from 'lodash';

import { DrawerRender } from 'components/VMS/Playback';

const styles = theme => ({
  '@global': {
    '::-webkit-slider-thumb': {
      WebkitAppearance: 'none',
      height: '160px',
      width: '1px',
      top: '0px',
      marginTop: '157px',
      // position: 'absolute',
      background: theme.palette.primary.main,
      borderRadius: '1px',
      zIndex: '1003'
    }
  },
  baselContainer: {
    // height: "35%",
    width: '100%',
    backgroundColor: theme.palette.primary.light,
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    display: 'flex',
    flexDirection: 'column'
  },
  controlContainer: {
    width: '100%',
    height: '40%',
    backgroundColor: theme.palette.primary.light,
    display: 'flex',
    alignItems: 'center'
  },
  barContainer: {
    width: '100%',
    height: '60%',
    backgroundColor: theme.palette.primary.light,
    borderBottomRightRadius: '4px',
    borderBottomLeftRadius: '4px',
    overflowY: 'scroll'
  },
  progressBarCntainer: {
    height: '20%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    zIndex: '1000'
  },
  progressBar: {
    height: '8px',
    width: '93%',
    backgroundColor: theme.palette.background.default,
    borderRadius: '4px',
    zIndex: '1002',

    // marginLeft: 'calc(3.5% + 3.5px)',
    position: 'relative',
    left: '3.5%'
  },
  dateTimePicker: {
    width: '230px',
    float: 'left',
    marginLeft: '10px'
  },
  mainBar: {
    width: '100%',
    height: '35%',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
    // marginLeft: '-100px'
  },
  timeBarAllControl: {
    width: '93%',
    // marginLeft: '4%',
    cursor: 'pointer',
    outline: 'none',
    height: '3px',
    WebkitAppearance: 'none'
  },
  ctrlButton: {
    width: '20%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  ctrlButtonGroup: {
    display: 'flex',
    color: 'white',
    width: '15%',
    height: '45%',
    backgroundColor: theme.palette.background.default,
    borderRadius: '4px',
    overflow: 'hidden'
  },
  alignLine: {
    width: '1px',
    height: '525%',
    backgroundColor: 'red',
    position: 'relative',
    top: '246.5%',
    marginLeft: '-1px'
  },
  timeHover: {
    width: '115px',
    height: '55%',
    backgroundColor: theme.palette.primary.main,
    position: 'relative',
    marginLeft: '-115px',
    borderRadius: '4px',
    zIndex: '9',
    overflowY: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '15%'
  },
  timeChangeRef: {
    width: '115px',
    height: '55%',
    overflowY: 'hidden',
    backgroundColor: theme.palette.primary.main,
    position: 'relative',
    marginLeft: '-115px',
    borderRadius: '4px',
    zIndex: '9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '15%'
  },
  scaleSelect: {
    marginLeft: '10px',
    marginRight: '10px'
  },
  toggleBut: {
    position: 'absolute',
    left: '0px',
    marginLeft: '-24px',
    top: '-8px',
    width: '15px',
    zIndex: '1002',
    cursor: 'pointer'
  },
  timeScale: {
    width: '93%',
    position: 'absolute',
    left: '3.5%',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    top: '87%',
    height: '5px'
  },
  timeScaleUnit: {
    backgroundColor: theme.palette.primary.main
  },
  imgPop: {
    width: '80px',
    height: '60px',
    marginLeft: '-80px',
    position: 'absolute',
    top: '-50px',
    zIndex: '1003'
  },
  img: {
    height: '100%',
    width: '100%',
    zIndex: '1001'
  },
  newRec: {
    backgroundColor: theme.palette.primary.main
  }
});

class ControlSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // videoNum: props.videoNum,
      flagIsPause: true,
      // videoInfo: { ...props.videoInfo },

      endTime: moment().format('YYYY-MM-DDTHH:mm'),
      startTime: moment()
        .subtract(10, 'minutes')
        .format('YYYY-MM-DDTHH:mm'),
      // videoInfo: props.videoInfo
      scaleFactor: '1.0',
      drawerOpen: false,
      skip: true
    };
    this.timeHoverRef = React.createRef();
    this.timeChangeRef = React.createRef();
    this.alignDomRef = React.createRef();
    this.inputRef = React.createRef();
    this.input = null;
    this.orderCommand = props.orderCommand;
    this.alignDom = null;

    this.onChangeTime = this.onChangeTime.bind(this);
    this.delBookmark = this.delBookmark.bind(this);
  }

  componentDidMount() {
    const { startTime, endTime } = this.state;
    this.orderCommand({ type: 'controlRef', data: this });
    this.orderCommand({
      type: 'currentSelectedTimeRange',
      data: {
        startTime: moment(startTime).format('YYYY-MM-DDTHH:mm'),
        endTime: moment(endTime).format('YYYY-MM-DDTHH:mm')
      }
    });
    this.orderCommand({
      type: 'setTimeMethod',
      data: this.onChangeTime
    });
  }

  setskip = bool => {
    this.setState({ skip: bool });
  };

  componentWillReceiveProps(nextprops) {
    this.handleTimeStamp(nextprops.videoInfo);
    // this.setState({ videoInfo: nextprops.videoInfo });
  }

  setPlaypause = bool => {
    this.setState({ flagIsPause: bool });
  };

  handleTimeStamp = videoInfo => {
    if (videoInfo.player0) {
      const { ts } = videoInfo.player0;
      for (const keys in videoInfo) {
        console.log(keys, videoInfo[keys].ts);
      }
      if (this.inputRef.current && ts) {
        this.inputRef.current.value = ts;
      }
    }
  };

  delBookmark(item, id) {
    this.orderCommand({ type: 'delBookmark', data: item, id });
  }

  onChangeTime(type, val) {
    const { startTime, endTime } = this.state;
    if (type === 'endTime') {
      if (moment(val).isBefore(moment(startTime))) {
        msg.warn('End Time must be later than start time');
        this.setState({ [type]: startTime }, () => {
          const { startTime, endTime } = this.state;
          this.orderCommand({ type: 'currentSelectedTimeRange', data: { startTime, endTime } });
        });
      } else if (
        moment(startTime)
          .add(1, 'day')
          .isBefore(moment(val))
      ) {
        msg.warn('Time range cannot exceed 24 hours');
        this.setState({ [type]: startTime }, () => {
          const { startTime, endTime } = this.state;
          this.orderCommand({ type: 'currentSelectedTimeRange', data: { startTime, endTime } });
        });
      } else {
        this.setState({ [type]: val }, () => {
          const { startTime, endTime } = this.state;
          this.orderCommand({ type: 'currentSelectedTimeRange', data: { startTime, endTime } });
        });
      }
    } else if (type === 'startTime') {
      this.videoStart = new Date(val).getTime();
      this.setState({ [type]: val }, () => {
        this.orderCommand({ type: 'currentSelectedTimeRange', data: { startTime, endTime } });
      });
    }
  }

  onPauseAll = () => {
    this.orderCommand({ type: 'pauseall' });
    this.setState({ flagIsPause: true });
  };

  onPlayAll = () => {
    this.orderCommand({ type: 'playall' });
    this.setState({ flagIsPause: false });
  };

  onEndAll = () => {
    this.orderCommand({ type: 'endall' });
  };

  onResetAll = () => {
    this.orderCommand({ type: 'resetall' });
  };

  toggleDrawer = (bool, cn, id) => {
    this.setState({ drawerOpen: bool, renderCN: cn, renderId: id });
  };

  getTimeOffset = () => {
    const { startTime } = this.state;
    const current = this.inputRef.current.value;
    const start = new Date(startTime).getTime();
    return (parseInt(current, 10) - start) / 1000;
  };

  seek = time => {
    const { startTime } = this.state;
    const epoStartTime = new Date(startTime).getTime();
    this.orderCommand({
      type: 'seek',
      data: (parseInt(time, 10) - epoStartTime) / 1000
    });
  };

  handlescaleFactor = value => {
    this.orderCommand({ type: 'scale', data: value });
    this.setState({ scaleFactor: value });
  };

  getPreview = (time, id) => {
    this.orderCommand({
      type: 'getPreview',
      data: time,
      id
    });
  };

  render() {
    const { classes, show, videoInfo, style } = this.props;
    const {
      flagIsPause,
      startTime,
      endTime,
      alignDomLeft,
      bookmark,
      scaleFactor,
      drawerOpen,
      renderCN,
      renderId,
      skip
    } = this.state;
    const epoStartTime = new Date(startTime).getTime();
    const epoEndTime = new Date(endTime).getTime();
    const progressBar = [];
    this.alignDom = document.getElementById('alignLine');
    for (const key in videoInfo) {
      progressBar.push(videoInfo[key]);
    }

    return show ? (
      <div className={classes.baselContainer} style={{ ...style }}>
        <div className={classes.controlContainer}>
          <div className={classes.dateTimePicker}>
            <DatePicker
              date={moment(startTime).format('YYYY-MM-DDTHH:mm')}
              label="Start Time"
              format={DATE_FORMAT_DATE_PICKER}
              handleChange={val => this.onChangeTime('startTime', val)}
              value={moment(startTime).format('YYYY-MM-DDTHH:mm')}
              style={{ width: 215 }}
              className={classes.textField}
            />
          </div>

          <div className={classes.dateTimePicker}>
            <DatePicker
              date={moment(endTime).format('YYYY-MM-DDTHH:mm')}
              label="End Time"
              format={DATE_FORMAT_DATE_PICKER}
              value={moment(endTime).format('YYYY-MM-DDTHH:mm')}
              handleChange={val => this.onChangeTime('endTime', val)}
              style={{ width: 215 }}
              className={classes.textField}
            />
          </div>

          <div className={classes.scaleSelect}>
            <SingleSelect
              label="Play speed"
              onSelect={this.handlescaleFactor}
              selectOptions={['0.25', '0.5', '1.0', '2.0', '4.0', '8.0', '16']}
              value={scaleFactor}
            />
          </div>

          <div className={classes.ctrlButtonGroup}>
            <div className={classes.ctrlButton}>
              <IconButton aria-label="Skip-10" disabled={!skip}>
                <ToolTip title="Skip-10">
                  <ChevronLeft
                    onClick={() =>
                      this.orderCommand({ type: 'skip', data: -10, ts: this.getTimeOffset() })
                    }
                  />
                </ToolTip>
              </IconButton>
            </div>
            <div className={classes.ctrlButton}>
              <IconButton aria-label="play">
                {flagIsPause ? (
                  <ToolTip title="Play All">
                    <PlayArrow onClick={this.onPlayAll} />
                  </ToolTip>
                ) : (
                  <ToolTip title="Pause All">
                    <Pause onClick={this.onPauseAll} />
                  </ToolTip>
                )}
              </IconButton>
            </div>
            <div className={classes.ctrlButton}>
              <IconButton aria-label="Skip+10" disabled={!skip}>
                <ToolTip title="Skip+10">
                  <ChevronRight
                    onClick={() =>
                      this.orderCommand({ type: 'skip', data: 10, ts: this.getTimeOffset() })
                    }
                  />
                </ToolTip>
              </IconButton>
            </div>
            <div className={classes.ctrlButton}>
              <IconButton aria-label="Skip-10">
                <ToolTip title="End All">
                  <Cancel onClick={this.onEndAll} />
                </ToolTip>
              </IconButton>
            </div>
            <div className={classes.ctrlButton}>
              <IconButton aria-label="Skip-10">
                <ToolTip title="Reset All">
                  <Replay onClick={this.onResetAll} />
                </ToolTip>
              </IconButton>
            </div>
          </div>
        </div>
        <div className={classes.barContainer}>
          <div className={classes.mainBar}>
            <div
              hidden
              id="alignLine"
              className={classes.alignLine}
              style={{ left: alignDomLeft }}
              ref={this.alignDomRef}
            />
            <div ref={this.timeHoverRef} className={classes.timeHover} />
            <div ref={this.timeChangeRef} className={classes.timeChangeRef} />
            <div className={classes.timeScale}>
              {(() => {
                const arr = [];
                const step = (epoEndTime - epoStartTime) / 12;
                for (let i = 0; i < 13; i++) {
                  let time = 0;
                  const remainder = (epoStartTime + i * step) % 60000;

                  if (remainder >= 30000) {
                    time = epoStartTime + i * step + (60000 - remainder);
                  } else if (remainder < 30000) {
                    time = epoStartTime + i * step - remainder;
                  }

                  let percentage = (time - epoStartTime) / (epoEndTime - epoStartTime);
                  if (percentage < 0) {
                    percentage = 0;
                  }
                  arr.push(
                    <div
                      className={classes.timeScaleUnit}
                      key={`timescale${i}`}
                      style={{
                        position: 'absolute',
                        height: '100%',
                        width: '2px',
                        left: `${percentage * 100}%`,
                        marginLeft: '-2px'
                      }}
                    >
                      <div style={{ position: 'absolute', top: '-18px', left: '-18px' }}>
                        {moment(new Date(time)).format('HH:mm')}
                      </div>
                    </div>
                  );
                }
                return arr;
              })()}
            </div>
            <input
              id="timeBarIpt"
              className={classes.timeBarAllControl}
              onChange={e => {
                this.timeHoverRef.current.style.left = '0px';
                e.currentTarget.style.marginLeft = '-1px';
                const marginLeft = e.currentTarget.parentElement.offsetWidth * 0.035 + 1;
                const width = e.currentTarget.parentElement.offsetWidth * 0.93 - 7;
                const num =
                  ((e.currentTarget.value - epoStartTime) / (epoEndTime - epoStartTime)) * width;
                // this.alignDom.setAttribute('style', ` left: ${num + marginLeft + 2}px`);
                // this.setState({ alignDomLeft: `${num + marginLeft + 2}px` });
                if ((e.currentTarget.value - epoStartTime) / (epoEndTime - epoStartTime) < 0.1) {
                  this.timeChangeRef.current.style.left = `${num + marginLeft + 120}px`;
                } else {
                  this.timeChangeRef.current.style.left = `${num}px`;
                }
                this.alignDomRef.current.style.left = `${num + marginLeft + 2}px`;
                this.timeChangeRef.current.innerHTML = moment(
                  parseInt(e.currentTarget.value, 10)
                ).format('DD/MM HH:mm:ss');
                this.commonLeft = `${num + marginLeft + 2}px`;
              }}
              onMouseLeave={() => {
                this.timeHoverRef.current.style.left = '0px';
                this.timeChangeRef.current.style.left = '0px';
              }}
              onMouseUp={e => {
                e.currentTarget.style.marginLeft = '0px';
                this.timeChangeRef.current.style.left = '0px';
                this.timeHoverRef.current.style.left = '0px';
                this.seek(e.target.value);
              }}
              onFocus={() => {}}
              onMouseOver={e => {
                const srcObj = e.target || e.srcElement;
                let offset = 0;
                let hoverleft = 0;
                const rect = srcObj.getBoundingClientRect();
                offset = e.clientX - rect.left;
                const fullWidth = e.currentTarget.offsetWidth;

                if (offset < 100) {
                  hoverleft = offset + 130;
                } else {
                  hoverleft = offset;
                }
                this.timeHoverRef.current.style.left = `${hoverleft}px`;
                this.timeHoverRef.current.innerHTML = moment(
                  new Date((epoEndTime - epoStartTime) * (offset / fullWidth) + epoStartTime)
                ).format('DD/MM HH:mm:ss');
              }}
              type="range"
              min={epoStartTime}
              max={epoEndTime}
              // step={1}
              style={{ position: 'relative', width: '93%', left: '3.5%', top: '-25%' }}
              ref={this.inputRef}
            />
          </div>
          <Drawer
            open={drawerOpen}
            onClose={() => {
              this.toggleDrawer(false);
            }}
          >
            <div style={{ width: 400, height: 400 }}>
              <DrawerRender
                videoInfo={videoInfo || {}}
                deleteBookmark={this.delBookmark}
                renderCN={renderCN}
                renderId={renderId}
                seek={this.seek}
              />
            </div>
          </Drawer>
          {[...progressBar].map(x => {
            return (
              <ProgressVid
                classes={classes}
                videoInfo={x}
                key={`progressBar${x.id}`}
                bookmark={bookmark}
                openDrawer={this.toggleDrawer}
                update={this.update}
                timeRange={{
                  startTime: new Date(startTime).getTime(),
                  endTime: new Date(endTime).getTime()
                }}
                getPreview={this.getPreview}
              />
            );
          })}
        </div>
      </div>
    ) : null;
  }
}

// function leftCalc(start, end, value) {}

class ProgressVid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgPop: false
    };
  }

  addBookMark = x => {
    const { timeRange } = this.props;
    const { startTime, endTime } = timeRange;
    const ts = x.bookmarkTimestamp;
    function percentageS(e) {
      const range = endTime - startTime;
      const offset = e - startTime;
      if (offset > range) {
        return 1;
      }
      if (offset > 0) {
        return offset / range;
      } else {
        return 0;
      }
    }
    const bookM = (
      <ToolTip title={x.bookmarkComments}>
        <div
          style={{
            left: `calc(${percentageS(ts) * 100}% + 1px)`,
            height: '18px',
            top: '-5px',
            width: '1px',
            borderTop: '5px solid #00c4ff',
            borderBottom: '5px solid #00c4ff',
            position: 'absolute',
            marginLeft: '-1px'
          }}
        />
      </ToolTip>
    );
    return bookM;
  };

  componentWillReceiveProps(nextprops) {
    // const { bookmark, id, itemDataSource } = nextprops.videoInfo;
    // const { openDrawer } = this.props;
    // openDrawer(true, bookmark, itemDataSource.channelName, id);
    // if (nextprops.videoInfo.records) {
    //   this.renderRecords();
    // }
    // if (nextprops.videoInfo.preview) {
    //   console.log(nextprops.videoInfo.preview.toString());
    // }
    if (!_.isEqual(nextprops, this.props)) {
      this.renderRecords();
    }
    // if (!_.isEqual(nextprops, this.props)) {
    //   this.renderRecords();
    // }
  }

  renderRecords = () => {
    const { timeRange, videoInfo, classes } = this.props;
    const { startTime, endTime } = timeRange;
    const { records } = videoInfo;
    function percentageS(x) {
      const range = endTime - startTime;
      const offset = x - startTime;
      if (offset > range) {
        return 1;
      }
      if (offset > 0) {
        return offset / range;
      } else {
        return 0;
      }
    }
    if (records) {
      const newRec = records.map(x => {
        return (
          <div
            key={x.start}
            className={classes.newRec}
            style={{
              height: '100%',
              width: `${(percentageS(x.end) - percentageS(x.start) - 0.0005) * 100}%`,
              left: `${percentageS(x.start) * 100}%`,
              float: 'left',
              position: 'absolute',
              zIndex: '1001',
              borderRadius: '4px'
            }}
          />
        );
      });
      return newRec;
      // this.setState({ recoding: newRec });
    }
  };

  // componentDidMount() {
  //   const { videoInfo } = this.props;
  //   const { records ,  } = videoInfo;
  //   if (records) {
  //     this.renderRecords();
  //   }
  // }

  render() {
    const { classes, videoInfo, openDrawer, timeRange, getPreview } = this.props;
    const { startTime, endTime } = timeRange;
    const { bookmark, id, itemDataSource, preview } = videoInfo;
    const { imgPop, left } = this.state;
    const recoding = this.renderRecords();
    let link = '';
    if (preview) {
      link = URL.createObjectURL(preview);
    }

    return (
      <div className={classes.progressBarCntainer}>
        <div
          className={classes.progressBar}
          onClick={e => {
            const offset = e.nativeEvent.offsetX + e.target.offsetLeft;
            if (offset > 15) {
              const percentage = offset / e.currentTarget.clientWidth;
              const time = (endTime - startTime) * percentage + startTime;
              getPreview(Math.floor(time), id);
              if (offset < 70) {
                this.setState({ imgPop: true, left: '150px' });
              } else {
                this.setState({ imgPop: true, left: `${offset - 10}px` });
              }
            }
          }}
          // onMouseOver={e => {
          //   const offset = e.nativeEvent.offsetX;
          //   const percentage = offset / e.currentTarget.clientWidth;
          //   const time = (endTime - startTime) * percentage + startTime;
          //   getPreview(Math.floor(time), id);
          // }}
          onMouseLeave={() => {
            setTimeout(() => {
              this.setState({ imgPop: false });
            }, 3000);
          }}
          onFocus={() => {}}
        >
          {imgPop && preview && (
            <div className={classes.imgPop} style={{ left }}>
              <img src={link} alt="preview" className={classes.img} />
            </div>
          )}
          <ToolTip title="View Bookmarks">
            <Bookmarks
              className={classes.toggleBut}
              onClick={() => {
                if (itemDataSource && itemDataSource.channelName) {
                  openDrawer(true, itemDataSource.channelName, id);
                }
              }}
            />
          </ToolTip>

          {recoding}
          {!_.isEmpty(bookmark) &&
            bookmark.map(x => {
              return this.addBookMark(x);
            })}
        </div>
        {/* {videoInfo.ts} */}
      </div>
    );
  }
}

export default withStyles(styles)(ControlSection);
