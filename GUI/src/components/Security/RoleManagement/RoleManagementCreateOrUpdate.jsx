/* eslint-disable indent */
/*
 * @Author: An Ke
 * @Date: 2019-02-14 17:45:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-05-13 16:36:33
 */
import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import {
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
  withStyles
} from '@material-ui/core';
import { Button, DialogTitle } from 'components/common';
import * as constant from 'commons/constants/commonConstant';
import msg from 'utils/messageCenter';

const styles = () => ({
  root: {}
});

const initialVerificationObject = {
  isVerified: true,
  roleName: {
    invalid: false,
    message: ''
  },
  roleDesc: {
    invalid: false,
    message: ''
  }
};

class DialogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noChangeMessage: '',
      ...initialVerificationObject
    };
  }

  componentWillReceiveProps(nextprops) {
    const { openDialog } = this.props;
    if (nextprops.openDialog !== openDialog && !nextprops.openDialog) {
      this.clean();
    }
  }

  // when input get foucs event, selecting input
  // control to show confirmPassword input according to case
  handleFocusEvent = prop => () => {
    // event.target.select();
    this.setState({
      [prop]: {
        invalid: false,
        message: ''
      }
    });
  };

  handleBlurEvent = prop => () => {
    const { role } = this.props;
    if (role[prop] === undefined || role[prop] === null || role[prop] === '') {
      this.setState({
        [prop]: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    } else {
      this.setState({
        [prop]: {
          invalid: false,
          message: ''
        }
      });
    }
  };

  // save values inputed

  // verification

  isValid = (name, desc) => {
    let isVerified = true;

    if (name.trim() === '') {
      isVerified = false;
      this.setState({
        roleName: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    }

    if (desc.trim() === '') {
      isVerified = false;
      this.setState({
        roleDesc: {
          invalid: true,
          message: constant.VALIDMSG_NOTNULL
        }
      });
    }
    return isVerified;
  };

  save = () => {
    const { operationType, handleRoleSubmit, isCheakedAdminister, role, oldRole } = this.props;
    // verified
    const isVerified = this.isValid(role.roleName, role.roleDesc);
    if (!isVerified) return;
    if (
      operationType === 'update' &&
      role.roleDesc === oldRole.roleDesc &&
      role.roleName === oldRole.roleName
    ) {
      msg.warn(constant.VALIDMSG_NOTCHANGE, 'Update Role');
    } else {
      const isAdmin = isCheakedAdminister ? 'Y' : 'N';
      handleRoleSubmit(operationType, role.roleName, role.roleDesc, isAdmin);
    }
  };

  onClose = () => {
    const { handleDialogClose } = this.props;
    this.clean();
    handleDialogClose();
  };

  clean = () => {
    this.setState({
      ...initialVerificationObject
    });
  };

  render() {
    const { openDialog, operationType, role, handleChangeRole } = this.props;
    const { roleName, roleDesc, noChangeMessage } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth={operationType === 'create' ? 'xs' : 'xs'}
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {operationType === 'create'
            ? I18n.t('security.roleManagement.title.createRole')
            : operationType === 'update'
            ? I18n.t('security.roleManagement.title.updateRole')
            : I18n.t('security.roleManagement.title.roleDetails')}
        </DialogTitle>
        <DialogContent>
          <div style={{ display: operationType === 'create' ? 'block' : 'none' }}>
            <FormControl fullWidth>
              <TextField
                disabled={operationType !== 'create'}
                error={roleName.invalid}
                helperText={roleName.message}
                label={I18n.t('security.roleManagement.label.name')}
                placeholder={I18n.t('security.roleManagement.placeholder.roleName')}
                inputProps={{ maxLength: '50' }}
                onChange={e => handleChangeRole('roleName', e.target.value)}
                onFocus={this.handleFocusEvent('roleName')}
                onBlur={this.handleBlurEvent('roleName')}
                value={role.roleName !== undefined && role.roleName !== null ? role.roleName : ''}
                margin="dense"
                style={{ width: '100%' }}
              />

              <TextField
                disabled={operationType === 'detail' && true}
                error={roleDesc.invalid}
                helperText={roleDesc.message}
                label={I18n.t('security.roleManagement.label.description')}
                placeholder={I18n.t('security.roleManagement.placeholder.roleDescription')}
                inputProps={{ maxLength: '50' }}
                onChange={e => handleChangeRole('roleDesc', e.target.value)}
                onFocus={this.handleFocusEvent('roleDesc')}
                onBlur={this.handleBlurEvent('roleDesc')}
                value={role.roleDesc !== undefined && role.roleDesc !== null ? role.roleDesc : ''}
                margin="dense"
                style={{ width: '100%' }}
              />
            </FormControl>
          </div>

          <div style={{ display: operationType !== 'create' ? 'block' : 'none' }}>
            <FormControl style={{ marginRight: 20 }} fullWidth>
              <TextField
                disabled={operationType === 'detail' && true}
                error={roleName.invalid}
                helperText={roleName.message || noChangeMessage}
                required
                label={I18n.t('security.roleManagement.label.name')}
                placeholder={I18n.t('security.roleManagement.placeholder.roleName')}
                inputProps={{ maxLength: '50' }}
                onChange={e => handleChangeRole('roleName', e.target.value)}
                onFocus={this.handleFocusEvent('roleName')}
                onBlur={this.handleBlurEvent('roleName')}
                value={role.roleName !== undefined && role.roleName !== null ? role.roleName : ''}
                margin="dense"
                style={{ width: '100%' }}
              />
            </FormControl>
            <FormControl style={{ marginRight: 20 }} fullWidth>
              <TextField
                disabled={operationType === 'detail' && true}
                error={roleDesc.invalid}
                helperText={roleDesc.message || noChangeMessage}
                label={I18n.t('security.roleManagement.label.description')}
                placeholder={I18n.t('security.roleManagement.placeholder.roleDescription')}
                // multiline
                inputProps={{ maxLength: '50' }}
                onChange={e => handleChangeRole('roleDesc', e.target.value)}
                onFocus={this.handleFocusEvent('roleDesc')}
                onBlur={this.handleBlurEvent('roleDesc')}
                value={role.roleDesc !== undefined && role.roleDesc !== null ? role.roleDesc : ''}
                margin="dense"
                style={{ width: '100%' }}
              />

              {/* <FormLabel component="legend">Channel Type</FormLabel> */}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          {/* Fixed for JIRA MMI-118, by Arwen on 10-01-2019  Start */}
          <Button
            onClick={this.save}
            color="primary"
            style={{ display: operationType === 'detail' ? 'none' : 'block' }}
          >
            {/* Fixed for JIRA MMI-118, by Arwen on 10-01-2019  End */}
            {/* Added (Fixed) for JIRA MMI-116, by Chen Yu Long on 09-01-2019  Start */}
            {operationType === 'create'
              ? I18n.t('security.roleManagement.button.save')
              : I18n.t('security.roleManagement.button.update')}
            {/* Added (Fixed) for JIRA MMI-116, by Chen Yu Long on 09-01-2019  end */}
          </Button>
          <Button onClick={this.onClose} color="primary" autoFocus>
            {I18n.t('security.roleManagement.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogPage);

DialogPage.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  role: PropTypes.object.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  handleRoleSubmit: PropTypes.func.isRequired
};
