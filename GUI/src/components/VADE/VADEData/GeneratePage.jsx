import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { TextField, DialogTitle, Button } from 'components/common';
import { I18n } from 'react-i18nify';
import * as constant from 'commons/constants/commonConstant';

export const initialVerificationObject = {
  isVerified: true,
  modelPath: {
    invalid: false,
    message: ''
  }
};
class GeneratePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultItem: {},
      ...initialVerificationObject
    };
  }

  handleFocusEvent = prop => () => {
    this.setState({
      isVerified: true,
      [prop]: {
        invalid: false,
        message: ''
      }
    });
  };

  handleInput = prop => event => {
    const { resultItem } = this.state;
    resultItem[prop] = event.target.value;
    this.setState({
      resultItem
    });
  };

  isValid = myResult => {
    for (const key in myResult) {
      const inputValue = myResult[key].trim();
      if (inputValue === '') {
        this.setState({
          isVerified: false,
          [key]: {
            invalid: true,
            message: constant.VALIDMSG_NOTNULL
          }
        });
      }
    }
  };

  save = () => {
    const { resultItem, isVerified } = this.state;
    const { handleSubmit } = this.props;
    const myResult = {
      modelPath: resultItem.modelPath || ''
    };
    this.isValid(myResult);
    setTimeout(() => {
      if (!isVerified) return;
      handleSubmit(myResult);
      this.clean();
    }, 0);
  };

  clean = () => {
    // console.log('-----clean upload');
    this.setState({
      resultItem: [],
      ...initialVerificationObject
    });
  };

  onClose = () => {
    const { closeDialog } = this.props;
    closeDialog();
    this.clean();
  };

  render() {
    const { openDialog, analyticName, modelName } = this.props;
    const { modelPath, resultItem } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{I18n.t('vade.config.addModel')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              value={analyticName}
              disabled
              label={I18n.t('vade.config.sourceFile')}
              placeholder={I18n.t('vade.config.sourceFile')}
              margin="dense"
            />
            <TextField
              value={modelName}
              disabled
              label={I18n.t('vade.config.targetFile')}
              placeholder={I18n.t('vade.config.targetFile')}
              margin="dense"
            />
            <TextField
              error={modelPath.invalid}
              helperText={modelPath.message}
              value={!resultItem.modelPath ? '' : resultItem.modelPath}
              label={I18n.t('vade.config.location')}
              placeholder={I18n.t('vade.config.location')}
              inputProps={{
                maxLength: '50'
              }}
              onChange={this.handleInput('modelPath')}
              onFocus={this.handleFocusEvent('modelPath')}
              margin="dense"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.save} color="primary">
            {I18n.t('global.button.save')}
          </Button>
          <Button onClick={this.onClose} color="primary" autoFocus>
            {I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

GeneratePage.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};
export default GeneratePage;
