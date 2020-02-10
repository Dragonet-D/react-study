import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import { Loading } from 'components/Loading';
// import { Th as TableTh, Cell as TableCell } from 'components/common/material-ui/CellWithTooltip';
import {
  Dialog,
  DialogContent,
  DialogActions,
  // Table,
  // TableHead,
  // TableRow,
  // TableBody,
  // Radio,
  withStyles
} from '@material-ui/core';
import { Button, DialogTitle, IVHTable } from 'components/common';

const styles = theme => {
  return {
    no_padding: {
      padding: 0,
      textAlign: 'center'
    },
    loading: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1
    },
    dialogRoot: {
      minHeight: theme.spacing(50)
    }
  };
};

class UserRolesDialog extends React.Component {
  columns = [
    {
      title: I18n.t('security.userManagement.roleTable.name'),
      dataIndex: 'roleName'
    },
    {
      title: I18n.t('security.userManagement.roleTable.description'),
      dataIndex: 'roleDesc'
    }
  ];

  render() {
    const {
      handleCloseUserRolesDialog,
      openUserRolesDialog,
      userRoles,
      handleRoleSelected,
      selectedRadioRoles,
      handleSaveUserRoles,
      classes,
      loading
    } = this.props;
    const isRadio = true;
    return (
      <Dialog
        className={classes.dialogRoot}
        fullWidth
        maxWidth="md"
        open={openUserRolesDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {loading && (
          <div className={classes.loading}>
            <Loading size="small" />
          </div>
        )}
        <DialogTitle id="alert-dialog-title">
          {I18n.t('security.userManagement.title.assignRole')}
        </DialogTitle>

        <DialogContent>
          {/* ---------------------Table------------------------*/}
          {/* <Table>
            <TableHead>
              <TableRow>
                <TableTh>{I18n.t('security.userManagement.roleTable.option')}</TableTh>
                <TableTh>{I18n.t('security.userManagement.roleTable.name')}</TableTh>
                <TableTh>{I18n.t('security.userManagement.roleTable.description')}</TableTh>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRoles.map(item => {
                return (
                  <TableRow key={item.roleId} hover>
                    <TableCell className={classes.no_padding}>
                      <Radio
                        color="primary"
                        checked={selectedRadioRoles === item.roleId}
                        onChange={event => handleRoleSelected(event)}
                        value={item.roleId}
                      />
                    </TableCell>
                    <TableCell className={classes.no_padding_text} title={item.roleName}>
                      {item.roleName}
                    </TableCell>
                    <TableCell className={classes.no_padding_text} title={item.roleDesc}>
                      {item.roleDesc}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table> */}
          <IVHTable
            keyId="roleId"
            tableMaxHeight="calc(100% - 56px)"
            columns={this.columns}
            dataSource={userRoles}
            isRadio={isRadio}
            handleRoleSelected={handleRoleSelected}
            selectedRadio={selectedRadioRoles}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleSaveUserRoles()} color="primary">
            {I18n.t('security.userManagement.dialogButton.save')}
          </Button>
          <Button onClick={handleCloseUserRolesDialog} color="primary" autoFocus>
            {I18n.t('security.userManagement.dialogButton.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
UserRolesDialog.propTypes = {
  handleCloseUserRolesDialog: PropTypes.func.isRequired,
  openUserRolesDialog: PropTypes.bool.isRequired,
  userRoles: PropTypes.array.isRequired,
  // handleRoleSelected: PropTypes.func.isRequired,
  handleSaveUserRoles: PropTypes.func.isRequired
};

export default withStyles(styles)(UserRolesDialog);
