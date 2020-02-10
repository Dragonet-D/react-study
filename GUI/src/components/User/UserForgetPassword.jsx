import React from 'react';
import { I18n } from 'react-i18nify';
import { routerRedux } from 'dva';
import { Dialog, DialogContent, DialogActions, FormControl, TextField } from '@material-ui/core';
import { Button, DialogTitle } from 'components/common';
import * as constant from 'commons/constants/commonConstant';

export default class FgtPswdPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      userId: '',
      useremail: {
        invalid: false,
        message: ''
      },
      userIdValid: {
        invalid: false,
        message: ''
      }
    };
  }

  // when input get foucs event, selecting input
  // control to show confirmPassword input according to case
  handleInputblurEvent = type => () => {
    const { userId, email } = this.state;
    const emailRule = '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$';
    if (type === 'userId') {
      if (userId === '') {
        this.setState({
          userIdValid: {
            invalid: true,
            message: constant.VALIDMSG_NOTNULL
          }
        });
      } else {
        this.setState({
          userIdValid: {
            invalid: false,
            message: ''
          }
        });
      }
    }

    if (type === 'email') {
      if (email === '') {
        this.setState({
          useremail: {
            invalid: true,
            message: constant.VALIDMSG_NOTNULL
          }
        });
      } else if (!email.match(emailRule)) {
        this.setState({
          useremail: {
            invalid: true,
            message: 'Incorrect email format'
          }
        });
      } else {
        this.setState({
          useremail: {
            invalid: false,
            message: ''
          }
        });
      }
    }
  };

  handleInputFocusEvent = type => () => {
    this.setState({
      [type]: {
        invalid: false,
        message: ''
      }
    });
  };

  // save values inputed
  handleInput = (type, event) => {
    this.setState(
      {
        [type]: event.target.value.trim()
      },
      () => {
        this.handleInputblurEvent(type)(event);
      }
    );
  };

  isValid = (userId, email) => {
    const { useremail, userIdValid } = this.state;
    let isVerified = true;
    if (!useremail.invalid && !userIdValid.invalid) {
      isVerified = true;
    } else {
      isVerified = false;
    }

    if (userId === '') {
      isVerified = false;
      this.setState({
        userIdValid: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    }

    if (email === '') {
      isVerified = false;
      this.setState({
        useremail: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    }

    return isVerified;
  };

  save = () => {
    const { dispatch } = this.props;
    const { email, userId } = this.state;
    const isVerified = this.isValid(userId, email);
    if (!isVerified) return;

    const formatemail = email.replace(/@/, '%40');
    const object = { formatemail, userId };
    dispatch({
      type: 'user/findBackPassword',
      payload: {
        object
      }
    });
    this.clean();
    dispatch(routerRedux.push('/user/login'));
  };

  handleDialogClose = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/user/login'));
  };

  clean = () => {
    this.setState({
      email: '',
      userId: '',
      useremail: {
        invalid: false,
        message: ''
      },
      userIdValid: {
        invalid: false,
        message: ''
      }
    });
  };

  render() {
    const { useremail, userIdValid } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{I18n.t('user.forgetPassword.title')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              required
              error={userIdValid.invalid}
              helperText={userIdValid.message}
              label={I18n.t('user.forgetPassword.label.userId')}
              placeholder={I18n.t('user.forgetPassword.placeholder.userId')}
              inputProps={{ maxLength: '50' }}
              onChange={event => this.handleInput('userId', event)}
              onFocus={this.handleInputFocusEvent('userIdValid')}
              onBlur={this.handleInputblurEvent('userId')}
              margin="dense"
            />
            <TextField
              required
              error={useremail.invalid}
              helperText={useremail.message}
              label={I18n.t('user.forgetPassword.label.email')}
              placeholder={I18n.t('user.forgetPassword.placeholder.email')}
              inputProps={{ maxLength: '50' }}
              onChange={event => this.handleInput('email', event)}
              onFocus={this.handleInputFocusEvent('useremail')}
              onBlur={this.handleInputblurEvent('email')}
              margin="dense"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.save} color="primary">
            {I18n.t('user.buttons.send')}
          </Button>
          <Button
            onClick={() => {
              this.handleDialogClose();
              this.clean();
            }}
            color="primary"
            autoFocus
          >
            {I18n.t('user.buttons.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
