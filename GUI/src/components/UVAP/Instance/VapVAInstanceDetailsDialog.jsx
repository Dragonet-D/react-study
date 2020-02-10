import React from 'react';
import { Dialog, withStyles, DialogContent, DialogActions } from '@material-ui/core';
import { Button, DialogTitle, ListItemPreview } from 'components/common';
import { I18n } from 'react-i18nify';
// import { dateDisplayType } from 'utils/dateHelper';

const styles = () => ({});

class VapVAInstanceDetailsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { detailsDialogStatus, data, close } = this.props;
    return (
      <Dialog
        open={detailsDialogStatus}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle>{I18n.t('vap.dialog.instance.common.detailsTitle')}</DialogTitle>

        <DialogContent>
          <ListItemPreview dataSource={data} />
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

export default withStyles(styles)(VapVAInstanceDetailsDialog);
