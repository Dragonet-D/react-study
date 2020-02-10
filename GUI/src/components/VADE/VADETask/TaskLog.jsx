/* eslint-disable no-console */
import React from 'react';
import getUrls from 'utils/urls/index';
import { I18n } from 'react-i18nify';
import { DialogTitle, Button } from 'components/common';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

let websocketUrl = '';
async function initWebsocket() {
  const urls = getUrls.websocket;
  websocketUrl = urls.livelog;
}
class TaskLog extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { taskInfo } = this.props;
    if (nextProps.taskInfo !== taskInfo && nextProps.taskInfo.flag && nextProps.taskInfo.taskId) {
      const wsUrl = websocketUrl.url + nextProps.taskInfo.taskId;
      this.estabConnectWithWS(wsUrl);
    }
  }

  estabConnectWithWS(wsUrl) {
    if (this.ws) {
      this.ws.close();
    }
    const ws = new WebSocket(wsUrl);
    this.ws = ws;
    // eslint-disable-next-line func-names
    ws.onopen = function() {
      // eslint-disable-next-line no-console
      console.log('connect success');
    };
    ws.onmessage = msgs => {
      try {
        console.log('msgArr', msgs.data);
        document.getElementById('message').innerHTML += `${msgs.data} <br/>`;
      } catch (e) {
        console.log('receive wrong msg');
      }
    };
    ws.onclose = () => {
      console.log('ws connect close');
    };
  }

  onClose = () => {
    const { closeDialog } = this.props;
    closeDialog();
    this.ws.close();
  };

  componentDidMount() {
    initWebsocket();
    window.onbeforeunload = () => {
      if (this.ws) {
        this.ws.close();
      }
    };
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {
      return null;
    };
  }

  render() {
    const { openDialog, taskInfo } = this.props;
    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Live Log [${taskInfo.name}]`}</DialogTitle>
        <DialogContent style={{ minHeight: 400 }}>
          <div
            id="message"
            style={{
              width: '100%',
              wordWrap: 'break-word',
              wordBreak: 'normal'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary" autoFocus>
            {I18n.t('global.button.back')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default TaskLog;
