import React, { Component, Fragment } from 'react';
import ClassNames from 'classnames';
import { I18n } from 'react-i18nify';
import { withStyles, Button, FormControl, InputAdornment } from '@material-ui/core';
import { TextField as Input } from 'components/common';
import { Person, VpnKey, Clear } from '@material-ui/icons';
import { sha256 } from 'js-sha256';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';

const styles = theme => ({
  iconStart: {
    marginRight: theme.spacing(1)
  },
  iconEnd: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  inputMargin: {
    marginTop: theme.spacing(0.5)
  },
  submitButton: {
    textTransform: 'none'
  },
  iconError: {
    color: theme.palette.error.main
  },
  forgetPwd: {
    display: 'block',
    marginBottom: theme.spacing(0.5),
    textAlign: 'center',
    fontSize: theme.typography.fontSize * 0.857
  },
  loginForm: {
    padding: theme.spacing(1.25)
  }
});

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.state = {
      userName: '',
      password: '',
      userNameInvalid: '',
      passwordInvalid: '',
      userNameInfo: ' ',
      passwordInfo: ' '
    };
  }

  getEnterKeyEvent = event => {
    if (event.key === 'Enter') {
      this.handleClick();
    }
  };

  validateInput(type, value) {
    if (type === 'UserName') {
      if (!value) {
        this.setState({
          userNameInvalid: true,
          userNameInfo: VALIDMSG_NOTNULL
        });
        return false;
      }

      this.setState({
        userNameInvalid: false,
        userNameInfo: ' '
      });
      return true;
    }
    // Add for JIRA-UMMI/MMI-338  by Chen Yu Long on 03/26/2019 start
    if (type === 'Password') {
      if (!value) {
        this.setState({
          passwordInvalid: true,
          passwordInfo: VALIDMSG_NOTNULL
        });
        return false;
      } else {
        this.setState({
          passwordInvalid: false,
          passwordInfo: ' '
        });
        return true;
      }
    }

    // Add for JIRA-UMMI/MMI-338 by Chen Yu Long on 03/26/2019 end
  }

  handleUserNameChange(e) {
    const userName = e.target.value.trim();
    this.setState({ userName });
    this.validateInput('UserName', userName);
  }

  handlePasswordChange(e) {
    const password = e.target.value.trim();
    this.setState({ password });
    this.validateInput('Password', password);
  }

  handleClick() {
    let { userName, password } = this.state;
    const { dispatch } = this.props;
    userName = userName.trim();
    password = password.trim();
    const validateInput1 = this.validateInput('UserName', userName);
    const validateInput2 = this.validateInput('Password', password);
    const isValid = validateInput1 && validateInput2;

    if (!isValid) {
      return;
    }
    dispatch({
      type: 'user/login',
      payload: {
        userName,
        password: sha256(password)
      }
    });
  }

  render() {
    const { classes, loading } = this.props;
    const { userNameInvalid, passwordInvalid, userNameInfo, passwordInfo } = this.state;
    const {
      effects: { 'user/login': isLoading }
    } = loading;

    return (
      <Fragment>
        <form
          className={classes.loginForm}
          onKeyUp={this.getEnterKeyEvent}
          onSubmit={e => e.preventDefault()}
        >
          <FormControl fullWidth>
            <Input
              type="text"
              autoComplete="off"
              name="userName"
              id="userName"
              autoFocus
              error={!!userNameInvalid}
              helperText={userNameInfo}
              placeholder={I18n.t('user.login.placeholder.userName')}
              onChange={this.handleUserNameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment className={classes.iconStart} position="start">
                    <Person className={ClassNames({ [classes.iconError]: userNameInvalid })} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment className={classes.iconEnd} position="end">
                    {userNameInvalid === '' ? (
                      <span />
                    ) : userNameInvalid === true ? (
                      <Clear className={classes.iconError} />
                    ) : (
                      ''
                    )}
                  </InputAdornment>
                )
              }}
            />
          </FormControl>

          <FormControl fullWidth className={classes.inputMargin}>
            <Input
              autoComplete="off"
              type="password"
              name="password"
              id="password"
              placeholder={I18n.t('user.login.placeholder.password')}
              error={!!passwordInvalid}
              helperText={passwordInfo}
              onChange={this.handlePasswordChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment className={classes.iconStart} position="start">
                    <VpnKey className={ClassNames({ [classes.iconError]: passwordInvalid })} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment className={classes.iconEnd} position="end">
                    {passwordInvalid === '' ? (
                      <span />
                    ) : passwordInvalid === true ? (
                      <Clear className={classes.iconError} />
                    ) : (
                      ''
                    )}
                  </InputAdornment>
                )
              }}
            />
          </FormControl>

          <FormControl fullWidth className={classes.inputMargin}>
            <Button
              id="btnSignIn"
              variant="contained"
              size="medium"
              onClick={this.handleClick}
              className={classes.submitButton}
              disabled={isLoading}
            >
              {!isLoading
                ? I18n.t('user.login.button.signIn')
                : I18n.t('user.login.placeholder.loggingIn')}
            </Button>
          </FormControl>
        </form>
        <a href="/user/find-back-password" className={classes.forgetPwd}>
          {I18n.t('user.login.content.forgetPassword')}
        </a>
      </Fragment>
    );
  }
}

export default withStyles(styles)(LoginForm);
