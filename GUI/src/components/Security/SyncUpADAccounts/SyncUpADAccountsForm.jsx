import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, FormControl, Button, Grid } from '@material-ui/core/';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';

const styles = {
  textField: {
    marginRight: '20px',
    width: 280
  },
  menu: {
    width: 200
  },
  tabMargin: {
    marginTop: '20px'
  },
  buttonBottom: {
    marginBottom: '12px',
    marginTop: '20px'
  }
};

class syncForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalid: {
        userId: false,
        password: false
      },
      userIdMessage: '',
      passwordMessage: '',
      syncInfo: {
        domainName: '',
        userId: '',
        password: ''
      },
      flagShowMsg: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { syncInfo } = this.state;
    if (nextProps.domainInfo.domainName !== syncInfo.domainName) {
      const newSyncInfo = Object.assign({}, syncInfo, {
        domainName: nextProps.domainInfo.domainName
      });
      this.setState({
        syncInfo: newSyncInfo
      });
    }
  }

  textFieldChange = name => event => {
    const { invalid, syncInfo } = this.state;
    const newSyncInfo = Object.assign({}, syncInfo, {
      [name]: event.target.value
    });
    this.setState({
      syncInfo: newSyncInfo
    });
    if (event.target.value !== '') {
      const newinvalid = Object.assign({}, invalid, {
        [name]: false
      });
      this.setState({
        invalid: newinvalid
      });

      if (name === 'userId') {
        this.setState({
          userIdMessage: ''
        });
      }
      if (name === 'password') {
        this.setState({
          passwordMessage: ''
        });
      }
    }
  };

  handleSync = () => {
    const { syncInfo, invalid } = this.state;
    const { password, userId, domainName } = syncInfo;
    const { handleSync } = this.props;
    this.setState({ flagShowMsg: true });
    if (userId === '') {
      invalid.userId = true;
      this.setState({
        invalid,
        userIdMessage: VALIDMSG_NOTNULL
      });
    }
    if (password === '') {
      invalid.password = true;
      this.setState({
        invalid,
        passwordMessage: VALIDMSG_NOTNULL
      });
    }
    if (domainName !== '' && userId !== '' && password !== '') {
      handleSync(syncInfo);
    }
  };

  render() {
    const { classes, domainInfo, updatedNum, createdNum, isSuccess } = this.props;
    const { invalid, userIdMessage, passwordMessage, syncInfo, flagShowMsg } = this.state;
    return (
      <div>
        <FormControl fullWidth>
          <TextField
            disabled
            label="Domain Name"
            className={classes.textField}
            margin="normal"
            value={domainInfo.domainName !== undefined ? domainInfo.domainName : ''}
            InputProps={{
              readOnly: true,
              maxLength: '50'
            }}
          />
        </FormControl>
        <FormControl
          fullWidth
          style={{ display: isSuccess ? 'none' : domainInfo.domainName ? 'block' : 'none' }}
        >
          <TextField
            error={invalid.userId}
            helperText={userIdMessage}
            label="User ID*"
            className={classes.textField}
            onChange={this.textFieldChange('userId')}
            margin="normal"
            value={syncInfo.userId}
            InputProps={{
              maxLength: '50'
            }}
          />
        </FormControl>
        <FormControl
          fullWidth
          style={{ display: isSuccess ? 'none' : domainInfo.domainName ? 'block' : 'none' }}
        >
          <TextField
            error={invalid.password}
            helperText={passwordMessage}
            label="Password*"
            type="password"
            value={syncInfo.password}
            onChange={this.textFieldChange('password')}
            className={classes.textField}
            margin="normal"
            InputProps={{
              maxLength: '50'
            }}
          />
        </FormControl>
        <p
          style={{
            display: flagShowMsg && createdNum !== '' && updatedNum !== '' ? 'block' : 'none',
            marginTop: '1rem',
            color: 'rgb(0,230,118)'
          }}
        >
          {`Total created ${createdNum} users, updated ${updatedNum} users`}
        </p>
        <Grid
          container
          spacing={8}
          style={{ display: isSuccess ? 'none' : domainInfo.domainName ? 'block' : 'none' }}
        >
          <Grid item className={classes.buttonBottom}>
            <Button color="primary" onClick={this.handleSync}>
              Sync Up
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(syncForm);
