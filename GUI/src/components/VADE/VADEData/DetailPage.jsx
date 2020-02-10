import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { DialogTitle, Button, ListItemPreview } from 'components/common';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

function DetailPage(props) {
  const { itemData, onClose } = props;
  const dataSource = {
    [I18n.t('vade.config.dataName')]: _.get(itemData, 'fileName', ''),
    [I18n.t('vade.config.entry')]: _.get(itemData, 'entry', ''),
    [I18n.t('vade.config.dataType')]: _.get(itemData, 'fileTypeName', ''),
    [I18n.t('vade.config.description')]: _.get(itemData, 'fileDesc', ''),
    [I18n.t('vade.config.fileRealName')]: _.get(itemData, 'fileRealName', ''),
    [I18n.t('vade.config.generatedBy')]: _.get(itemData, 'generateBy', ''),
    [I18n.t('vade.config.createdBy')]: _.get(itemData, 'createUserId', ''),
    [I18n.t('vade.config.createdDate')]: moment(_.get(itemData, 'createTime', '')).format(
      DATE_FORMAT
    )
  };
  return (
    <Dialog fullWidth maxWidth="xs" open>
      <DialogTitle>{I18n.t('vade.config.dataDetails')}</DialogTitle>
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
