import React, { Component } from 'react';
import { connect } from 'dva';
import { I18n } from 'react-i18nify';
import * as constant from 'commons/constants/commonConstant';
import { Dialog, DialogContent, DialogActions, FormControl, TextField } from '@material-ui/core';
import { Button, DialogTitle } from 'components/common';
import { INITIAL_VERIFICATION_OBJECT as initialVerificationObject } from './utils';

class PwdChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpwd: '',
      newpwd: '',
      confirmpwd: '',
      ...initialVerificationObject
    };

    this.handleOnclickUpdate = this.handleOnclickUpdate.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getPasswordPolicy'
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, isClose, openChangePwdDialog, handleChangePwdDialogClose } = this.props;
    if (nextProps.isClose !== isClose && nextProps.isClose) {
      handleChangePwdDialogClose();
    }
    if (nextProps.openChangePwdDialog !== openChangePwdDialog && nextProps.openChangePwdDialog) {
      dispatch({
        type: 'global/getPasswordPolicy'
      });
    }
  }

  isValid = (oldpwd, newpwd, confirmpwd) => {
    const { invalidOldPwd, invalidNewPwd, invalidConfirmPwd } = this.state;
    let isVerified = true;
    if (!invalidOldPwd.invalid && !invalidNewPwd.invalid && !invalidConfirmPwd.invalid) {
      isVerified = true;
    } else {
      isVerified = false;
    }
    if (oldpwd.trim() === '') {
      isVerified = false;
      this.setState({
        invalidOldPwd: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    }
    if (newpwd.trim() === '') {
      isVerified = false;
      this.setState({
        invalidNewPwd: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    }
    if (confirmpwd.trim() === '') {
      isVerified = false;
      this.setState({
        invalidConfirmPwd: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    }
    if (oldpwd.trim() !== '' && newpwd.trim() !== '' && newpwd.trim() === oldpwd.trim()) {
      isVerified = false;
      this.setState({
        invalidNewPwd: {
          invalid: true,
          message: 'New Password should not be same as Old Password'
        }
      });
    }
    if (confirmpwd.trim() !== '' && newpwd.trim() !== '' && confirmpwd.trim() !== newpwd.trim()) {
      isVerified = false;
      this.setState({
        invalidConfirmPwd: {
          invalid: true,
          message: ' Confirm New Password should be same as New Password'
        }
      });
    }

    return isVerified;
  };

  handleOnclickUpdate() {
    const { dispatch } = this.props;
    const { oldpwd, newpwd, confirmpwd } = this.state;
    const isVerified = this.isValid(oldpwd, newpwd, confirmpwd);
    if (!isVerified) return;
    dispatch({
      type: 'global/updatePassword',
      payload: {
        oldpwd,
        newpwd
      }
    });
  }

  handleFocusEvent = prop => () => {
    this.setState({
      [prop]: {
        invalid: false,
        message: ''
      }
    });
  };

  handleOnblurEvent = prop => () => {
    const { detailList } = this.props;
    const { oldpwd, newpwd, confirmpwd } = this.state;
    const ComparePassword = JSON.parse(detailList || false);

    if (prop === 'oldpwd') {
      if (oldpwd.trim() === '') {
        this.setState({
          invalidOldPwd: {
            invalid: true,
            message: constant.VALIDMSG_NOTNULL
          }
        });
      } else {
        this.setState({
          invalidOldPwd: {
            invalid: false,
            message: ''
          }
        });
      }
    }

    if (prop === 'newpwd') {
      if (newpwd.trim() === '') {
        this.setState({
          invalidNewPwd: {
            invalid: true,
            message: constant.VALIDMSG_NOTNULL
          }
        });
      } else if (newpwd.trim() !== '') {
        const messageInfo = this.getPwdPolicyMessage({ value: newpwd, policy: ComparePassword });

        if (!messageInfo.verification) {
          this.setState({
            invalidNewPwd: {
              invalid: true,
              message: messageInfo.message
            }
          });
        } else {
          this.setState({
            invalidNewPwd: {
              invalid: false,
              message: ''
            }
          });
        }
      }
    }

    if (prop === 'confirmpwd') {
      if (confirmpwd.trim() === '') {
        this.setState({
          invalidConfirmPwd: {
            invalid: true,
            message: constant.VALIDMSG_NOTNULL
          }
        });
      } else if (confirmpwd.trim() !== '') {
        const messageInfo = this.getPwdPolicyMessage({
          value: confirmpwd,
          policy: ComparePassword
        });

        if (!messageInfo.verification) {
          this.setState({
            invalidConfirmPwd: {
              invalid: true,
              message: messageInfo.message
            }
          });
        } else {
          this.setState({
            invalidConfirmPwd: {
              invalid: false,
              message: ''
            }
          });
        }
      }
    }
  };

  getPwdPolicyMessage({ value, policy }) {
    const oneUpperCaseRegex = /[A-Z]+/;
    const oneLowerCaseRegex = /[a-z]+/;
    const oneNumRegex = /[0-9]+/;
    const OneSpecialRegex = /\W+/;

    const messageInfo = {
      verification: true,
      message: `The password length cannot be less than ${policy.minLength} characters and more than 12 characters`
    };

    const composite = [];

    // config policy
    if (policy.oneUpperCase === 'Y') {
      composite.push(' uppercase letters');
    }

    if (policy.oneLowerCase === 'Y') {
      composite.push(' lowercase letters');
    }

    if (policy.oneNumber === 'Y') {
      composite.push(' numbers');
    }

    if (policy.oneSpecial === 'Y') {
      composite.push(' special characters');
    }

    // verification
    if (value.length < policy.minLength) {
      messageInfo.verification = false;
      // messageInfo.message = messageInfo.message + " and less than " + policy.minLength + " characters";
    } else if (policy.oneUpperCase === 'Y' && oneUpperCaseRegex.test(value) === false) {
      messageInfo.verification = false;
    } else if (policy.oneLowerCase === 'Y' && oneLowerCaseRegex.test(value) === false) {
      messageInfo.verification = false;
    } else if (policy.oneNumber === 'Y' && oneNumRegex.test(value) === false) {
      messageInfo.verification = false;
    } else if (policy.oneSpecial === 'Y' && OneSpecialRegex.test(value) === false) {
      messageInfo.verification = false;
    } else if (value.length > 12) {
      messageInfo.verification = false;
    }

    if (composite.length > 0) {
      messageInfo.message = `${
        messageInfo.message
      }, password must contain one or more${composite.join(',')}`;
    }

    return messageInfo;
  }

  // save values inputed
  handleGetInputValue = prop => event => {
    this.setState(
      {
        [prop]: event.target.value
      },
      () => {
        this.handleOnblurEvent(prop)(event);
      }
    );
  };

  cleanInvalid = () => {
    this.setState({
      invalidOldPwd: {
        invalid: false,
        message: ''
      },
      invalidNewPwd: {
        invalid: false,
        message: ''
      },
      invalidConfirmPwd: {
        invalid: false,
        message: ''
      }
    });
  };

  cleanInput = () => {
    this.setState({
      oldpwd: '',
      newpwd: '',
      confirmpwd: ''
    });
  };

  handleCancelClickEvent = () => {
    const { handleChangePwdDialogClose, clearSession } = this.props;
    handleChangePwdDialogClose();
    this.cleanInvalid();
    this.cleanInput();
    if (clearSession) {
      clearSession();
    }
  };

  render() {
    // console.log('prps:',this.props);
    const { openChangePwdDialog } = this.props;
    const {
      invalidOldPwd,
      invalidNewPwd,
      invalidConfirmPwd,
      oldpwd,
      newpwd,
      confirmpwd
    } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openChangePwdDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{I18n.t('user.changePassword.title')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              label={I18n.t('user.changePassword.label.oldPassword')}
              placeholder={I18n.t('user.changePassword.placeholder.oldPassword')}
              margin="dense"
              inputProps={{ maxLength: '50' }}
              type="password"
              required
              onChange={this.handleGetInputValue('oldpwd')}
              error={invalidOldPwd.invalid}
              helperText={invalidOldPwd.message}
              onFocus={this.handleFocusEvent('invalidOldPwd')}
              value={oldpwd || ''}
              // defaultValue={oldpwd}
              onBlur={this.handleOnblurEvent('oldpwd')}
            />
            <TextField
              label={I18n.t('user.changePassword.label.newPassword')}
              placeholder={I18n.t('user.changePassword.placeholder.newPassword')}
              margin="dense"
              type="password"
              required
              onChange={this.handleGetInputValue('newpwd')}
              error={invalidNewPwd.invalid}
              helperText={invalidNewPwd.message}
              onFocus={this.handleFocusEvent('invalidNewPwd')}
              value={newpwd || ''}
              onBlur={this.handleOnblurEvent('newpwd')}
              inputProps={{
                maxLength: 12
              }}
            />
            <TextField
              label={I18n.t('user.changePassword.label.passwordConfirm')}
              placeholder={I18n.t('user.changePassword.placeholder.passwordConfirm')}
              type="password"
              margin="dense"
              required
              onChange={this.handleGetInputValue('confirmpwd')}
              error={invalidConfirmPwd.invalid}
              helperText={invalidConfirmPwd.message}
              onFocus={this.handleFocusEvent('invalidConfirmPwd')}
              value={confirmpwd || ''}
              onBlur={this.handleOnblurEvent('confirmpwd')}
              inputProps={{
                maxLength: 12
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.handleOnclickUpdate}>
            {I18n.t('user.buttons.update')}
          </Button>
          <Button color="primary" onClick={this.handleCancelClickEvent}>
            {I18n.t('user.buttons.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = ({ global }) => {
  return {
    detailList: global.passwordPolicy,
    isClose: global.dialogStatus.passwordDialogIsClose
  };
};

export default connect(mapStateToProps)(PwdChange);
