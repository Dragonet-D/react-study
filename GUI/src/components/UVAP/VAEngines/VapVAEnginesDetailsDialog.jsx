import React from 'react';
import { Dialog, withStyles, DialogContent, DialogActions } from '@material-ui/core';
import { Button, DialogTitle, ListItemPreview } from 'components/common';
import { I18n } from 'react-i18nify';
// import { dateDisplayType } from 'utils/dateHelper';
import _ from 'lodash';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

const styles = () => ({});

class VapVAEnginesDetailsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { detailsDialogStatus, data, close, statusList, vaGatewayList } = this.props;
    const statusIndex = _.findIndex(statusList, { codeValue: _.get(data, 'status.name', '') });
    const statusName = statusIndex >= 0 ? statusList[statusIndex].codeDesc : '';
    const vaGatewayIndex = _.findIndex(vaGatewayList, { id: _.get(data, 'vaGatewayId', '') });
    const vaGatewayName = vaGatewayIndex >= 0 ? vaGatewayList[statusIndex].name : '';
    const dataSource = {
      [I18n.t('vap.dialog.engines.status')]: `${statusName} ${_.get(data, 'status', '').message}`,
      [I18n.t('vap.dialog.engines.diaplayName')]: _.get(data, 'name', ''),
      [I18n.t('vap.dialog.engines.vaGateway')]: vaGatewayName,
      [I18n.t('vap.dialog.engines.label')]: !_.isEmpty(_.get(data, 'labels', ''))
        ? _.get(data, 'labels', '').join(';')
        : '',
      [I18n.t('vap.dialog.engines.installerType')]: _.get(data, 'installerType', ''),
      [I18n.t('vap.dialog.engines.nextCheckTime')]: moment(_.get(data, 'nextCheckTime', '')).format(
        DATE_FORMAT
      ),
      [I18n.t('vap.dialog.engines.licenseKeyRequired')]: _.get(data, 'runRequirement', '')
        .licenseKeyRequired,
      [I18n.t('vap.dialog.engines.vendor')]: _.get(data, 'vendor', ''),
      [I18n.t('vap.dialog.engines.version')]: _.get(data, 'vendorAppInfo', '')
        ? _.get(data, 'vendorAppInfo', '').version
        : '',
      [I18n.t('vap.dialog.engines.description')]: _.get(data, 'vendorAppInfo', '')
        ? _.get(data, 'vendorAppInfo', '').description
        : ''
    };

    return (
      <Dialog
        open={detailsDialogStatus}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle>{I18n.t('vap.dialog.engines.detailsTitle')}</DialogTitle>

        <DialogContent>
          <ListItemPreview dataSource={dataSource} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={close}>
            {I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(VapVAEnginesDetailsDialog);
