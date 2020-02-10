import React, { Component } from 'react';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import { Dialog, DialogContent, DialogActions, FormControl, TextField } from '@material-ui/core';
import { Button, DialogTitle } from 'components/common';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { INITIAL_PROFILE_VERIFICATION_OBJECT as initialVerificationObject } from './utils';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      ...initialVerificationObject
    };

    this.handleOnclickUpdate = this.handleOnclickUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, isClose, handleChangeProfileDialogClose } = this.props;
    if (nextProps.isClose !== isClose && nextProps.isClose) {
      handleChangeProfileDialogClose();
      dispatch({
        type: 'global/closeProfileDialog',
        payload: {
          data: false
        }
      });
    }
    this.setState({
      userInfo: nextProps.userInfo
    });
  }

  handleOnclickUpdate() {
    const { userId, dispatch } = this.props;
    const { userInfo, isVerified } = this.state;
    if (isVerified) {
      userInfo.lastUpdatedId = userId;
      dispatch({
        type: 'global/updateUserInformation',
        payload: {
          info: userInfo
        }
      });
    }
  }

  handleFocusEvent = prop => () => {
    this.setState({
      isVerified: true,
      [prop]: {
        invalid: false,
        message: ''
      }
    });
  };

  handleOnblurEvent = prop => event => {
    if (event.target.value === '') {
      this.setState({
        isVerified: false,
        [prop]: {
          invalid: true,
          message: VALIDMSG_NOTNULL
        }
      });
    } else if (
      event.target.value !== '' &&
      prop === 'invalidUserPhone' &&
      String(event.target.value).length !== 8
    ) {
      this.setState({
        isVerified: false,
        [prop]: {
          invalid: true,
          message: 'Length must be 8 character'
        }
      });
    } else if (event.target.value !== '') {
      this.setState({
        isVerified: true,
        [prop]: {
          invalid: false,
          message: ''
        }
      });
    }
  };

  // save values inputed
  handleGetInputValue = prop => event => {
    const { userInfo } = this.state;
    const newUserInfo = Object.assign({}, userInfo);
    newUserInfo[prop] = event.target.value;
    this.setState({
      userInfo: newUserInfo
    });
  };

  cleanInvalid = () => {
    this.setState({
      invalidUserFullName: {
        invalid: false,
        message: ''
      },
      invalidUserPhone: {
        invalid: false,
        message: ''
      }
    });
  };

  cleanInput = () => {
    this.setState({
      userInfo: {}
    });
  };

  render() {
    const { handleChangeProfileDialogClose, openChangeProfileDialog } = this.props;
    const { invalidUserPhone, invalidUserFullName, userInfo } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openChangeProfileDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{I18n.t('user.updateUserProfile.title')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              label={I18n.t('user.updateUserProfile.label.fullName')}
              placeholder={I18n.t('user.updateUserProfile.placeholder.fullName')}
              margin="dense"
              inputProps={{ maxLength: '50' }}
              required
              onChange={this.handleGetInputValue('userFullName')}
              error={invalidUserFullName.invalid}
              helperText={invalidUserFullName.message}
              onFocus={this.handleFocusEvent('invalidUserFullName')}
              value={userInfo.userFullName || ''}
              onBlur={this.handleOnblurEvent('invalidUserFullName')}
            />
            <TextField
              label={I18n.t('user.updateUserProfile.label.phone')}
              placeholder={I18n.t('user.updateUserProfile.placeholder.phone')}
              margin="dense"
              required
              onChange={this.handleGetInputValue('userPhone')}
              error={invalidUserPhone.invalid}
              helperText={invalidUserPhone.message}
              onFocus={this.handleFocusEvent('invalidUserPhone')}
              value={userInfo.userPhone || ''}
              onBlur={this.handleOnblurEvent('invalidUserPhone')}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleOnclickUpdate}>
            {I18n.t('user.buttons.update')}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              handleChangeProfileDialogClose();
              this.cleanInvalid();
              this.cleanInput();
            }}
          >
            {I18n.t('user.buttons.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToPorps = ({ global }) => {
  return {
    userId: global.userId,
    userInfo: global.userInfo,
    isClose: global.dialogStatus.profileDialogIsClose
  };
};

export default connect(mapStateToPorps)(UserProfile);
