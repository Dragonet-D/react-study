import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import { Button, DialogTitle } from 'components/common';
import { getUserIdentify } from 'utils/getUserInformation';
import store from '@/index';

const noTimeoutList = ['/uvms/liveView', '/uvms/playback', '/'];

export default class SessionTimeout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      countdown: 30
    };
  }

  componentDidMount() {
    const { history } = this.props;
    this.sessionTimeoutInterval = window._env_.SESSION_EXPIRED_TIME * 60 * 1000;
    // this.sessionTimeoutInterval = 6000;

    // listen router
    history.listen(this.handleRouterChangeEvent);
    window.addEventListener('load', this.handleRouterChangeEvent, false);
  }

  componentWillUnmount() {
    this.startTime = new Date().getTime();
    document.removeEventListener('mousemove', this.handleSessionTimeoutEvent, true);
    if (this.interval) {
      clearInterval(this.interval);
    }

    window.removeEventListener('load', this.handleRouterChangeEvent, false);
  }

  render() {
    const { countdown, open } = this.state;

    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Session</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {'Session has expired, please choose " '}
            <WordFontWeight word="Logout" />
            {' " or " '}
            <WordFontWeight word="Continue" />
            {' "'}
            <br />
            {'You will be auto logout in '}
            <WordColor color="red" word={countdown} />
            {' seconds'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.hanldeComfirmLogout()} color="primary">
            Logout
          </Button>
          <Button onClick={this.handleComfirmPageContinue} color="primary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleRouterChangeEvent = r => {
    const pathname = r.pathname || window.location.pathname || '';
    const isExisting = noTimeoutList.includes(pathname);
    this.startTime = new Date().getTime();
    document.removeEventListener('mousemove', this.handleSessionTimeoutEvent, true);
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (!isExisting) {
      document.addEventListener('mousemove', this.handleSessionTimeoutEvent, true);
      this.interval = setInterval(this.intervalCallback, 1000);
    }
  };

  intervalCallback = () => {
    const { isValid } = getUserIdentify();
    const { open } = this.state;
    if (isValid) {
      // console.log(this.props.isValid);
      const currentTime = new Date().getTime();
      // console.log(currentTime - this.startTime);
      if (currentTime - this.startTime > this.sessionTimeoutInterval && !open) {
        this.setState({
          open: true,
          countdown: 30
        });
      }
    } else {
      this.setState({
        open: false,
        countdown: 30
      });
    }

    // countdown
    if (open) {
      let { countdown } = this.state;
      countdown -= 1;
      if (countdown === 0) {
        this.logout();
      }
      if (countdown > 0) {
        this.setState({
          countdown
        });
      }
    }
  };

  handleSessionTimeoutEvent = () => {
    this.startTime = new Date().getTime();
  };

  logout() {
    const user = getUserIdentify();
    const auditUuid = user && user.auditLogId;
    const userId = user && user.userInfo && user.userInfo.userId;
    if (auditUuid) {
      store.dispatch({
        type: 'global/logout',
        payload: {
          auditUuid,
          userId
        }
      });
    }
    this.setState({
      open: false
    });
  }

  hanldeComfirmLogout = () => {
    this.logout();
  };

  handleComfirmPageContinue = () => {
    this.startTime = new Date().getTime();
    store.dispatch({
      type: 'global/updateSession'
    });
    this.setState({
      open: false
    });
  };
}

function WordFontWeight({ word }) {
  return <span style={{ fontWeight: 'bold' }}>{word}</span>;
}

function WordColor({ color, word }) {
  return <span style={{ color }}>{word}</span>;
}
