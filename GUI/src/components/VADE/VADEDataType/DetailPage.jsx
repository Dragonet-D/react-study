import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { DialogTitle, Button, ListItemPreview } from 'components/common';
import { I18n } from 'react-i18nify';
import _ from 'lodash';

function DetailPage(props) {
  const { itemData, onClose } = props;
  const dataSource = {
    [I18n.t('vade.config.dataTypeName')]: _.get(itemData, 'name', ''),
    [I18n.t('vade.config.description')]: _.get(itemData, 'desc', ''),
    [I18n.t('vade.config.entry')]: _.get(itemData, 'entry', '')
  };
  return (
    <Dialog fullWidth maxWidth="xs" open>
      <DialogTitle>{I18n.t('vade.config.dataTypeDetails')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <ListItemPreview dataSource={dataSource} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" autoFocus>
          {I18n.t('global.button.back')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default DetailPage;
