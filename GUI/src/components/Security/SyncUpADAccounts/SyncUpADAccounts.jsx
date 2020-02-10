import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SyncForm from './SyncUpADAccountsForm';

const styles = () => ({
  menu: {
    width: 200
  },
  textField: {
    marginRight: '20px',
    width: 280
  },
  buttonBottom: {
    marginBottom: '12px'
  }
});

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      domainInfo: {},
      createdNum: '',
      updatedNum: ''
    };
  }

  componentWillUnmount() {
    this.setState({
      domainInfo: {},
      createdNum: '',
      updatedNum: ''
    });
  }

  componentWillReceiveProps(nextProps) {
    const { domainInfo, updatedNum, createdNum } = this.state;
    if (nextProps.domainInfo !== domainInfo) {
      this.setState({
        domainInfo: nextProps.domainInfo
      });
    }
    if (nextProps.updatedNum !== updatedNum) {
      this.setState({
        updatedNum: nextProps.updatedNum
      });
    }
    if (nextProps.createdNum !== createdNum) {
      this.setState({
        createdNum: nextProps.createdNum
      });
    }
  }

  handleSync = syncInfo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'securitySyncUpADAccounts/updateDomainInformation',
      payload: {
        userId: syncInfo.userId,
        domainName: syncInfo.domainName,
        pass: syncInfo.password
      }
    });
  };

  render() {
    const { isSuccess, isPermission } = this.props;
    const { domainInfo, updatedNum, createdNum } = this.state;
    return (
      <div className="mycontainer">
        {isPermission ? (
          <div style={{ padding: '40px' }}>
            {/* <h4>Sync Up the AD Accounts</h4> */}
            <SyncForm
              domainInfo={domainInfo}
              updatedNum={updatedNum}
              createdNum={createdNum}
              isSuccess={isSuccess}
              handleSync={syncInfo => this.handleSync(syncInfo)}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

Overview.propTypes = {
  domainInfo: PropTypes.object.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  isPermission: PropTypes.bool.isRequired,
  createdNum: PropTypes.string.isRequired,
  updatedNum: PropTypes.string.isRequired
};

export default withStyles(styles)(Overview);
