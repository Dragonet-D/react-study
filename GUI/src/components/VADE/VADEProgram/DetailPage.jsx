import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { DialogTitle, Button, ListItemPreview } from 'components/common';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

const styles = theme => ({
  paramHead: {
    margin: 0,
    padding: '10px 0 10px',
    fontSize: 14,
    backgroundColor: theme.palette.primary.light
  },
  paramListBkColor: {
    backgroundColor: theme.palette.primary.light
  }
});
function DetailPage(props) {
  const { itemData, onClose, classes } = props;
  const dataSource = {
    [I18n.t('vade.config.programName')]: _.get(itemData, 'fileName', ''),
    [I18n.t('vade.config.description')]: _.get(itemData, 'fileDesc', ''),
    [I18n.t('vade.config.entry')]: _.get(itemData, 'entry', ''),
    [I18n.t('vade.config.taskType')]: _.get(itemData, 'taskTypeName', ''),
    [I18n.t('vade.config.commandTemplate')]: _.get(itemData, 'commandTemplate', '')
  };
  const paramData = {};
  if (itemData.parameters) {
    const arr = itemData.parameters;
    for (const k in arr) {
      paramData[arr[k].name] = arr[k].type;
    }
  }
  return (
    <Dialog fullWidth maxWidth="md" open>
      <DialogTitle>{I18n.t('vade.config.programDetails')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <ListItemPreview dataSource={dataSource} />
          <div className={classes.paramHead}>
            <Typography color="textSecondary" component="p" style={{ marginBottom: 10 }}>
              {I18n.t('vade.config.parameters')}
            </Typography>
            <ListItemPreview dataSource={paramData} />
          </div>
          <ListItemPreview
            dataSource={{
              [I18n.t('vade.config.file')]: _.get(itemData, 'fileRealName', ''),
              [I18n.t('vade.config.createBy')]: _.get(itemData, 'createUserId', ''),
              [I18n.t('vade.config.createDate')]: moment(_.get(itemData, 'uploadTime', '')).format(
                DATE_FORMAT
              )
            }}
          />
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
export default withStyles(styles)(DetailPage);
