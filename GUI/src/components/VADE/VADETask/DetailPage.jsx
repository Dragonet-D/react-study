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
    [I18n.t('vade.config.taskName')]: _.get(itemData, 'name', ''),
    [I18n.t('vade.config.description')]: _.get(itemData, 'desc', ''),
    [I18n.t('vade.config.status')]: _.get(itemData, 'taskStatus', ''),
    [I18n.t('vade.config.taskCategory')]: _.get(itemData, 'category', ''),
    [I18n.t('vade.config.taskType')]: _.get(itemData, 'taskTypeName', ''),
    [I18n.t('vade.config.program')]: _.get(itemData, 'programName', ''),
    [I18n.t('vade.config.commandTemplate')]: _.get(itemData, 'commandTemplate', ''),
    [I18n.t('vade.config.parameters')]: _.get(itemData, 'commandStr', ''),
    [I18n.t('vade.config.outputDataName')]: _.get(itemData, 'outputDataName', ''),
    [I18n.t('vade.config.outputDataDesc')]: _.get(itemData, 'outputDataDesc', ''),
    [I18n.t('vade.config.submittedBy')]: _.get(itemData, 'createUserId', ''),
    [I18n.t('vade.config.submittedDate')]: moment(_.get(itemData, 'createTime', '')).format(
      DATE_FORMAT
    ),
    [I18n.t('vade.config.startTime')]: moment(_.get(itemData, 'startTime', '')).format(DATE_FORMAT),
    [I18n.t('vade.config.endTime')]: moment(_.get(itemData, 'endTime', '')).format(DATE_FORMAT)
  };
  return (
    <Dialog fullWidth maxWidth="md" open>
      <DialogTitle>{I18n.t('vade.config.taskDetails')}</DialogTitle>
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
