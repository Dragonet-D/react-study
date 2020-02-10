import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { ToolTip } from 'components/common';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { Textsms } from '@material-ui/icons';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  close: {
    // padding: theme.spacing(0.5)
  },
  item: {
    marginBottom: theme.spacing(0.5)
  },
  panel: {
    boxOrient: 'vertical',
    flexDirection: 'column-reverse',
    overflowY: 'auto'
  }
});
class LinearDeterminate extends React.Component {
  state = {
    completed: 0
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    if (completed === 100) {
      this.setState({ completed: 0 });
    } else {
      const diff = Math.random() * 10;
      this.setState({ completed: Math.min(completed + diff, 100) });
    }
  };

  render() {
    const { completed } = this.state;
    return (
      <div>
        <LinearProgress variant="determinate" value={completed} />
      </div>
    );
  }
}

class SnackBarItem extends React.Component {
  render() {
    const { messageInfo, classes } = this.props;
    return (
      <div className={classes.item}>
        <Paper
          className={classes.root}
          elevation={1}
          style={{ backgroundColor: '#3e5fb3', color: '#fff' }}
        >
          <Typography component="p" variant="subtitle2">
            {messageInfo.deviceName}
            {messageInfo.start && messageInfo.end && `(${messageInfo.start} - ${messageInfo.end})`}
            <br />
            {messageInfo.msg}
          </Typography>
        </Paper>
        <LinearDeterminate />
      </div>
    );
  }
}
const MySnackBarItem = withStyles(styles)(SnackBarItem);

class ProgressPanel extends React.Component {
  state = {
    open: false // check
  };

  render() {
    const { flagShowPanel, msgList, classes } = this.props;
    const { open } = this.state;
    return (
      <div style={{ display: flagShowPanel ? 'flex' : 'none' }} className={classes.panel}>
        {msgList &&
          msgList.length > 0 &&
          msgList.map(msg => {
            return <MySnackBarItem messageInfo={msg} open={open} key={msg.clippingId} />;
          })}
      </div>
    );
  }
}

const MyPanel = withStyles(styles)(ProgressPanel);

class ProgressSnackbars extends React.Component {
  state = {
    flagShowPanel: true,
    msgList: []
  };

  componentWillReceiveProps(nextProps) {
    const { messageCenter: props } = nextProps;
    const { messageCenter: preProps } = this.props;
    if (props.progressMsgs && !_.isEqual(props.progressMsgs, preProps.progressMsgs)) {
      this.setState({
        msgList: props.progressMsgs
      });
    }
  }

  handleShow = () => {
    this.setState(state => ({ flagShowPanel: !state.flagShowPanel }));
  };

  // componentDidMount() {
  //   sessionStorage.setItem('progressMsgs', {});
  // }

  render() {
    const { flagShowPanel, msgList } = this.state;
    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 1999,
          bottom: 0,
          left: 0
        }}
      >
        <MyPanel flagShowPanel={flagShowPanel} msgList={msgList} />
        <ToolTip
          title={!flagShowPanel ? 'Clipping Task' : ''}
          style={{ display: msgList.length > 0 ? 'inline-flex' : 'none' }}
        >
          <IconButton aria-label="Clipping Task" onClick={this.handleShow}>
            <Textsms
              style={{
                width: 33,
                height: 33
              }}
            />
          </IconButton>
        </ToolTip>
      </div>
    );
  }
}
export default connect(({ messageCenter, loading, global }) => ({
  messageCenter,
  loading,
  global
}))(ProgressSnackbars);
