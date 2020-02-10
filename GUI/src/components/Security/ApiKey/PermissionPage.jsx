import React from 'react';
import { Button, IVHTable, DialogTitle } from 'components/common';
import { I18n } from 'react-i18nify';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

function AssignRolePage(props) {
  const { dataSource, onClose } = props;

  const columns = [
    {
      title: I18n.t('security.apikey.resourceId'),
      dataIndex: 'resourceId'
    },
    {
      title: I18n.t('security.apikey.level'),
      dataIndex: 'level'
    }
  ];

  function cancel() {
    onClose();
  }

  return (
    <Dialog fullWidth open>
      <DialogTitle>{I18n.t('security.apiKey.featureList')}</DialogTitle>
      <DialogContent>
        <IVHTable
          dataSource={dataSource || []}
          columns={columns}
          rowKey="resourceId"
          tableMaxHeight="calc(100% - 98px)"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} color="primary" autoFocus>
          {I18n.t('global.button.back')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default AssignRolePage;
