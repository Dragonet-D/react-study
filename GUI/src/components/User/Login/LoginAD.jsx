import React, { Component } from 'react';
import ClassNames from 'classnames';
import { I18n } from 'react-i18nify';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import { TextField, Input, SingleSelect } from 'components/common';
import { green } from '@material-ui/core/colors';
import { sha256 } from 'js-sha256';
import { Email, VpnKey, Domain, Clear } from '@material-ui/icons';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';

const styles = theme => ({
  iconStart: {
    marginRight: theme.spacing(1.5)
  },
  iconEnd: {
    marginRight: theme.spacing(1.5),
    marginLeft: theme.spacing(1.5)
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
  iconSuccess: {
    color: green[500]
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
    this.handleDomainChange = this.handleDomainChange.bind(this);

    this.state = {
      userName: '',
      password: '',
      domain: 'hostSg',
      domainInvalid: '',
      userNameInvalid: '',
      passwordInvalid: '',
      userNameInfo: ' ',
      passwordInfo: ' ',
      domainInfo: ' '
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
    } else if (type === 'Domain') {
      if (!value) {
        this.setState({
          domainInvalid: true,
          domainInfo: 'Please select'
        });
        return false;
      }

      this.setState({
        domainInvalid: false,
        domainInfo: ' '
      });

      return true;
    }

    if (!value) {
      this.setState({
        passwordInvalid: true,
        passwordInfo: VALIDMSG_NOTNULL
      });
      return false;
    }
    this.setState({
      passwordInvalid: false,
      passwordInfo: ' '
    });
    return true;
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

  handleDomainChange(domain) {
    this.setState({ domain });
    this.validateInput('Domain', domain);
  }

  handleClick() {
    let { userName, password, domain } = this.state;
    const { dispatch } = this.props;
    userName = userName.trim();
    password = password.trim();
    domain = domain.trim();
    const validateInput1 = this.validateInput('UserName', userName);
    const validateInput2 = this.validateInput('Password', password);
    const validateInput3 = this.validateInput('Domain', domain);
    // let accountId = 'default';
    const isValid = validateInput1 && validateInput2 && validateInput3;
    if (!isValid) {
      return;
    }
    dispatch({
      type: 'user/loginAD',
      payload: { userName, password: sha256(password), adName: domain }
    });
  }

  render() {
    const { classes, loading } = this.props;
    const {
      userNameInvalid,
      passwordInvalid,
      userNameInfo,
      passwordInfo,
      domain,
      domainInfo,
      domainInvalid
    } = this.state;

    const {
      effects: { 'user/loginAD': isLoading }
    } = loading;
    return (
      <form
        className={classes.loginForm}
        onKeyUp={this.getEnterKeyEvent}
        onSubmit={e => e.preventDefault()}
      >
        <FormControl fullWidth>
          <TextField
            autoComplete="off"
            type="text"
            name="userName"
            id="userName"
            autoFocus
            error={!!userNameInvalid}
            helperText={userNameInfo}
            placeholder={I18n.t('user.login.placeholder.domainUserId')}
            onChange={this.handleUserNameChange}
            InputProps={{
              startAdornment: (
                <InputAdornment className={classes.iconStart} position="start">
                  <Email className={ClassNames({ [classes.iconError]: userNameInvalid })} />
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
          <TextField
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

        <FormControl fullWidth className={classes.inputMargin} error={!!domainInvalid}>
          <SingleSelect
            displayEmpty
            value={domain}
            onSelect={this.handleDomainChange}
            selectOptions={['hostSg', 'SG_SPF', 'SG_SCDF', 'SG_ICA']}
            input={
              <Input
                name="domain"
                id="domain"
                startAdornment={
                  <InputAdornment className={classes.iconStart} position="start">
                    <Domain className={ClassNames({ [classes.iconError]: domainInvalid })} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment className={classes.iconEnd} position="end">
                    {domainInvalid === '' ? (
                      <span />
                    ) : domainInvalid === true ? (
                      <Clear className={classes.iconError} />
                    ) : (
                      ''
                    )}
                  </InputAdornment>
                }
              />
            }
          />
          <FormHelperText>{domainInfo}</FormHelperText>
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
              : I18n.t('user.login.button.loggingIn')}
          </Button>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles)(LoginForm);
