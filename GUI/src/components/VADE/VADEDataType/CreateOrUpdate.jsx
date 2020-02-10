import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { TextField, DialogTitle, Button } from 'components/common';
import MenuItem from '@material-ui/core/MenuItem';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { I18n } from 'react-i18nify';

const initialVerificationObject = {
  isVerified: true,
  name: {
    invalid: false,
    message: ''
  },
  desc: {
    invalid: false,
    message: ''
  },
  labeled: {
    invalid: false,
    message: ''
  },
  entry: {
    invalid: false,
    message: ''
  }
};
class CreateOrUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultItem: {},
      ...initialVerificationObject
    };
  }

  componentWillReceiveProps(nextprops) {
    const { itemData } = this.props;
    if (
      (nextprops.operationType === 'detail' || nextprops.flag_create) &&
      nextprops.itemData &&
      nextprops.itemData !== itemData
    ) {
      this.setState({
        resultItem: nextprops.itemData
      });
    }
    if (nextprops.entryOfCreateFileType) {
      this.setState({
        resultItem: { entry: nextprops.entryOfCreateFileType }
      });
    }
  }

  handleInput = prop => event => {
    const { resultItem } = this.state;
    const val = event.target.value;
    if (prop === 'entry') {
      if (val !== resultItem.entry) {
        resultItem.labeled = '';
      }
      if (val !== 'dataset') {
        this.setState({
          isVerified: true,
          labeled: {
            invalid: false,
            message: ''
          }
        });
      }
    }
    resultItem[prop] = val;
    this.setState({
      resultItem,
      isVerified: true,
      [prop]: {
        invalid: false,
        message: ''
      }
    });
  };

  isValid = myNew => {
    for (const key in myNew) {
      const inputValue = myNew[key].trim();
      if (inputValue === '') {
        if (key !== 'labeled') {
          this.setState({
            isVerified: false,
            [key]: {
              invalid: true,
              message: VALIDMSG_NOTNULL
            }
          });
        } else if (key === 'labeled') {
          const { resultItem } = this.state;
          if (resultItem.entry === 'dataset') {
            this.setState({
              isVerified: false,
              [key]: {
                invalid: true,
                message: VALIDMSG_NOTNULL
              }
            });
          } else {
            this.setState({
              isVerified: true
            });
          }
        }
      }
    }
  };

  save = () => {
    const { handleSubmit } = this.props;
    const { resultItem } = this.state;
    const myResult = {
      labeled: resultItem.labeled || '',
      name: resultItem.name || '',
      desc: resultItem.desc || '',
      entry: resultItem.entry || ''
    };
    this.isValid(myResult);
    setTimeout(() => {
      const { isVerified } = this.state;
      if (!isVerified) return;
      if (myResult.labeled === 'true') {
        myResult.labeled = true;
      }
      if (myResult.labeled === 'false') {
        myResult.labeled = false;
      }
      myResult.category = 'data';
      handleSubmit(myResult);
    }, 0);
  };

  onClose = () => {
    const { closeDialog } = this.props;
    closeDialog();
    this.clean();
  };

  clean = () => {
    this.setState({
      resultItem: {},
      ...initialVerificationObject
    });
  };

  componentDidMount() {
    const { getChild } = this.props;
    getChild(this);
  }

  render() {
    const { openDialog, entryList, operationType } = this.props;
    const { name, desc, labeled, entry, resultItem } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {operationType === 'detail'
            ? I18n.t('vade.config.dataTypeDetails')
            : I18n.t('vade.config.createDataType')}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              disabled={operationType === 'detail' && true}
              error={name.invalid}
              helperText={name.message}
              label={I18n.t('vade.config.dataTypeName')}
              placeholder={I18n.t('vade.config.dataTypeName')}
              inputProps={{ maxLength: '50' }}
              value={!resultItem.name ? '' : resultItem.name}
              onChange={this.handleInput('name')}
              margin="dense"
            />
            <TextField
              disabled={operationType === 'detail' && true}
              error={desc.invalid}
              helperText={desc.message}
              label={I18n.t('vade.config.description')}
              placeholder={I18n.t('vade.config.description')}
              inputProps={{ maxLength: '50' }}
              value={!resultItem.desc ? '' : resultItem.desc}
              onChange={this.handleInput('desc')}
              margin="dense"
            />
            <TextField
              disabled={operationType === 'detail' && true}
              style={{
                margin: 0
              }}
              select
              error={entry.invalid}
              helperText={entry.message}
              label={I18n.t('vade.config.entry')}
              value={!resultItem.entry ? '' : resultItem.entry}
              onChange={this.handleInput('entry')}
            >
              {entryList &&
                entryList.map(option => (
                  <MenuItem key={option.uuid} value={option.entry}>
                    {option.entry}
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              disabled={operationType === 'detail' && true}
              style={{
                display: resultItem.entry === 'dataset' ? 'inherit' : 'none',
                margin: 0
              }}
              select
              error={labeled.invalid}
              helperText={labeled.message}
              label={I18n.t('vade.config.labeled')}
              value={!resultItem.labeled ? '' : resultItem.labeled}
              onChange={this.handleInput('labeled')}
              margin="normal"
            >
              {[['True', 'true'], ['False', 'false']].map(option => (
                <MenuItem key={option[1]} value={option[1]}>
                  {option[0]}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.save}
            color="primary"
            style={{ display: operationType === 'detail' ? 'none' : 'flex' }}
          >
            {I18n.t('global.button.save')}
          </Button>
          <Button onClick={this.onClose} color="primary" autoFocus>
            {operationType === 'detail'
              ? I18n.t('global.button.back')
              : I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

CreateOrUpdate.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};
export default CreateOrUpdate;
