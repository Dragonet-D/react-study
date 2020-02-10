import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { I18n } from 'react-i18nify';
import { Button, DialogTitle } from 'components/common';
import UserGroup from 'pages/Security/UserGroup';

function AssignGroupPage(props) {
  const { onClose, handleSubmit, itemData } = props;
  const [isTreeList, setIsTreeList] = useState(true);
  const [groupId, setGroupId] = useState({});
  function cancel() {
    onClose();
  }
  function save() {
    if (groupId) handleSubmit(groupId);
  }
  return (
    <Dialog fullWidth open maxWidth={isTreeList ? 'xs' : 'lg'}>
      <DialogTitle>{I18n.t('security.apiKey.assignGroup')}</DialogTitle>
      <DialogContent>
        <div>{`${I18n.t('security.apiKey.currentGroup')} : ${itemData.groupName || ''}`}</div>
        <UserGroup
          mode="fromApiKey"
          setIsTreeList={flag => setIsTreeList(flag)}
          setGroupId={id => setGroupId(id)}
          currentGroup={itemData.groupName || ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={save} color="primary">
          {I18n.t('global.button.assign')}
        </Button>
        <Button onClick={cancel} color="primary" autoFocus>
          {I18n.t('global.button.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default AssignGroupPage;
