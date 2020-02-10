import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { DialogContent, DialogActions, FormControl, TextField } from '@material-ui/core';
import * as constant from 'commons/constants/commonConstant';
import msg from 'utils/messageCenter';
import { Button, DialogTitle } from 'components/common';
import { Dialog } from './UserManagementDialogPage';

const initialVerificationObject = {
  userId: {
    invalid: false,
    message: ''
  },
  userFullName: {
    invalid: false,
    message: ''
  },
  userEmail: {
    invalid: false,
    message: ''
  },
  userLabel: {
    invalid: false,
    message: ''
  },
  userPhone: {
    invalid: false,
    message: ''
  }
};

export default class DialogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      ...initialVerificationObject
    };
    // this.validator = new Validator(rules);
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      user: nextprops.user,
      ...initialVerificationObject
    });
  }

  // when input get foucs event, selecting input
  handleFocusEvent = prop => event => {
    event.target.select();
    this.setState({
      [prop]: {
        invalid: false,
        message: ''
      }
    });
  };

  // save values inputed
  handleUserInput = prop => event => {
    const { user } = this.state;
    const { changeUserIdtoLowerCase } = this.props;
    const newUser = Object.assign({}, user);
    newUser[prop] = event.target.value;
    this.setState({
      user: newUser
    });
    if (prop === 'userId') changeUserIdtoLowerCase(newUser);
  };

  // verification
  isValidUser = user => {
    let isValid = true;
    for (const key in user) {
      // console.log(user[key]);
      const inputValue = user[key].trim();
      if (inputValue === '') {
        isValid = false;
        this.setState({
          [key]: {
            invalid: true,
            message: constant.VALIDMSG_NOTNULL
          }
        });
      }
    }
    return isValid;
  };

  // submit update user
  handleUserSubmitData = () => {
    const { operationType, handleUserSubmit, user: propsUser } = this.props;
    const { user: stateUser } = this.state;
    const user = {
      userEmail: stateUser.userEmail || '',
      userFullName: stateUser.userFullName || '',
      userLabel: stateUser.userLabel || 'Label',
      userId: stateUser.userId || '',
      userPhone: stateUser.userPhone || ''
    };
    // verified user
    const isValid = this.isValidUser(user);
    if (!isValid) return;

    if (operationType === 'update') {
      user.userUuid = stateUser.userUuid;
      user.userName = stateUser.userName;
      user.userStatus = stateUser.userStatus;
      user.userLocked = stateUser.userLocked;
      user.userGroup = stateUser.userGroup;
    }
    // JIRA IVHFATOSAT-330
    // -start- add by ANKE (the operation type named 'update' then the user data need to check diff)
    if (_.isEqual(stateUser, propsUser.user) && operationType === 'update') {
      msg.warn(constant.VALIDMSG_NOTCHANGE, 'User Update');
    } else {
      handleUserSubmit(operationType, user);
    }
    // -end-
  };

  render() {
    const { openDialog, operationType, user, handleDialogClose } = this.props;
    const { userId, userFullName, userEmail, userPhone } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" onClick={handleDialogClose}>
          {operationType === 'create' ? 'Create User' : 'Update User'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              disabled={operationType === 'update' && true}
              error={userId.invalid}
              helperText={userId.message}
              label={I18n.t('security.userManagement.label.userId')}
              placeholder="user id"
              inputProps={{ maxLength: '50' }}
              onChange={this.handleUserInput('userId')}
              onFocus={this.handleFocusEvent('userId')}
              // value={operationType === "update" ? user.userId : ""}
              value={user.userId}
              margin="dense"
            />
            <TextField
              error={userFullName.invalid}
              helperText={userFullName.message}
              label={I18n.t('security.userManagement.label.fullName')}
              placeholder="full name"
              inputProps={{ maxLength: '50' }}
              onChange={this.handleUserInput('userFullName')}
              onFocus={this.handleFocusEvent('userFullName')}
              defaultValue={operationType === 'update' ? user.userFullName : ''}
              margin="dense"
            />
            <TextField
              error={userEmail.invalid}
              helperText={userEmail.message}
              label={I18n.t('security.userManagement.label.email')}
              placeholder="email"
              inputProps={{ maxLength: '50' }}
              onChange={this.handleUserInput('userEmail')}
              onFocus={this.handleFocusEvent('userEmail')}
              defaultValue={operationType === 'update' ? user.userEmail : ''}
              margin="dense"
            />
            <TextField
              error={userPhone.invalid}
              helperText={userPhone.message}
              label={I18n.t('security.userManagement.label.phone')}
              placeholder="phone"
              inputProps={{ maxLength: '50' }}
              onChange={this.handleUserInput('userPhone')}
              onFocus={this.handleFocusEvent('userPhone')}
              defaultValue={operationType === 'update' ? user.userPhone : ''}
              margin="dense"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleUserSubmitData()} color="primary">
            {I18n.t('security.userManagement.dialogButton.save')}
          </Button>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            {I18n.t('security.userManagement.dialogButton.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogPage.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  handleUserSubmit: PropTypes.func.isRequired
};
