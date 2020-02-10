import React from 'react';
import { Button } from '@material-ui/core/';
import { Permission } from 'components/common';

export default class Actionview extends React.Component {
  handleSyncUpDevices = () => {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'securitySyncUpVMSInformation/syncUpDevices',
      payload: {
        userId
      }
    });
  };

  handleSyncUpChannels = () => {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'securitySyncUpVMSInformation/syncUpChannels',
      payload: {
        userId
      }
    });
  };

  render() {
    return (
      <div className="mycontainer">
        <div className="btncontent">
          <span style={{ fontSize: 18 }}>Sync Up Devices :</span>
          <Permission materialKey="M4-125">
            <Button
              style={{ marginLeft: 63 }}
              color="default"
              size="small"
              variant="contained"
              onClick={this.handleSyncUpDevices}
            >
              Sync Up
            </Button>
          </Permission>
        </div>
        <div className="btncontent">
          <span style={{ fontSize: 18 }}>Sync Up Channels :</span>
          <Permission materialKey="M4-126">
            <Button
              style={{ marginLeft: 50 }}
              color="default"
              size="small"
              variant="contained"
              onClick={this.handleSyncUpChannels}
            >
              Sync Up
            </Button>
          </Permission>
        </div>
      </div>
    );
  }
}
