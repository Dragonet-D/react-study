import React from 'react';
import { Dialog, withStyles, DialogContent, DialogActions } from '@material-ui/core';
import { Button, DialogTitle, ListItemPreview } from 'components/common';
import { I18n } from 'react-i18nify';
// import { dateDisplayType } from 'utils/dateHelper';
import _ from 'lodash';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: '90%',
    marginTop: '16px',
    marginBottom: '8px'
  },
  menu: {
    width: 200
  },
  radio_Dataset: {
    marginLeft: '30px'
  },
  radio_License: {
    marginLeft: '30px'
  },
  label_dataset: {
    marginLeft: '10px'
  },
  label_license: {
    marginLeft: '10px'
  },
  h6: {
    marginTop: '30px'
  }
});

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { isOpenUserDetailDialog, data, classes, closeUserDetailDialog } = this.props;
    const dataSource = {
      [I18n.t('security.userManagement.label.userId')]: _.get(data, 'userId', ''),
      [I18n.t('security.userManagement.label.fullName')]: _.get(data, 'userFullName', ''),
      [I18n.t('security.userManagement.label.adUser')]:
        _.get(data, 'adUser', '') === 'Y' ? 'Yes' : 'No',
      [I18n.t('security.userManagement.label.email')]: _.get(data, 'userEmail', ''),
      [I18n.t('security.userManagement.label.phone')]: _.get(data, 'userPhone', ''),
      [I18n.t('security.userManagement.label.createdBy')]: _.get(data, 'createdId', ''),
      [I18n.t('security.userManagement.label.createdDate')]: moment(
        _.get(data, 'createdDate', '')
      ).format(DATE_FORMAT),
      [I18n.t('security.userManagement.label.lastUpdatedBy')]: _.get(data, 'lastUpdatedId', ''),
      [I18n.t('security.userManagement.label.lastUpdatedDate')]: moment(
        _.get(data, 'lastUpdatedDate', '')
      ).format(DATE_FORMAT)
    };

    return (
      <Dialog
        className={classes.dialogRoot}
        open={isOpenUserDetailDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
      >
        <DialogTitle>{I18n.t('security.userManagement.title.userDetail')}</DialogTitle>

        <DialogContent>
          <ListItemPreview dataSource={dataSource} />
          {/* <TextField
            label={I18n.t('security.userManagement.label.userId')}
            disabled
            value={data.userId ? data.userId : ''}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.fullName')}
            disabled
            value={data.userFullName ? data.userFullName : ''}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.adUser')}
            disabled
            value={data.adUser === 'Y' ? 'Yes' : 'No'}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.email')}
            disabled
            value={data.userEmail ? data.userEmail : ''}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.phone')}
            disabled
            value={data.userPhone ? data.userPhone : ''}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.createdBy')}
            disabled
            value={data.createdId ? data.createdId : ''}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.createdDate')}
            disabled
            value={data.createdDate ? dateDisplayType(data.createdDate) : ''}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.lastUpdatedBy')}
            disabled
            value={data.lastUpdatedId ? data.lastUpdatedId : ''}
            className={classes.textField}
          />
          <TextField
            label={I18n.t('security.userManagement.label.lastUpdatedDate')}
            disabled
            value={data.lastUpdatedDate ? dateDisplayType(data.lastUpdatedDate) : ''}
            className={classes.textField}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeUserDetailDialog}>
            {I18n.t('security.userManagement.dialogButton.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(UserDetails);
