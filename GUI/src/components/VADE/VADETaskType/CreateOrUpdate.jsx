import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { TextField, DialogTitle, Button } from 'components/common';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { I18n } from 'react-i18nify';

const initialVerificationObject = {
  isVerified: true,
  category: {
    invalid: false,
    message: ''
  },
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
  type: {
    invalid: false,
    message: ''
  },
  commandTemplate: {
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
    const { categoryOfCreateTaskType } = this.props;
    if (nextprops.operationType === 'detail' && nextprops.itemData) {
      this.setState({
        resultItem: nextprops.itemData
      });
    }
    if (nextprops.categoryOfCreateTaskType !== categoryOfCreateTaskType) {
      this.setState({
        resultItem: { category: nextprops.categoryOfCreateTaskType }
      });
    }
  }

  handleInput = prop => event => {
    const { resultItem } = this.state;
    resultItem[prop] = event.target.value;
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
        this.setState({
          isVerified: false,
          [key]: {
            invalid: true,
            message: VALIDMSG_NOTNULL
          }
        });
      }
    }
  };

  save = () => {
    const { handleSubmit } = this.props;
    const { resultItem } = this.state;
    const myResult = {
      category: resultItem.category || '',
      name: resultItem.name || '',
      desc: resultItem.desc || ''
      // commandTemplate: this.state.resultItem.commandTemplate || "",
    };
    this.isValid(myResult);
    setTimeout(() => {
      const { isVerified } = this.state;
      if (!isVerified) return;
      handleSubmit(myResult);
    }, 0);
  };

  onClose = () => {
    const { closeDialog } = this.props;
    closeDialog();
    this.clean();
  };

  clean() {
    this.setState({
      resultItem: {},
      ...initialVerificationObject
    });
  }

  componentDidMount() {
    const { getChild } = this.props;
    getChild(this);
  }

  render() {
    const { openDialog, operationType } = this.props;
    const {
      category,
      name,
      desc,
      // commandTemplate,
      resultItem
    } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-desc"
      >
        <DialogTitle id="alert-dialog-title">
          {operationType === 'detail'
            ? I18n.t('vade.config.taskTypeDetails')
            : I18n.t('vade.config.createTaskType')}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <FormControl error={category.invalid}>
              <InputLabel disabled={operationType === 'detail'}>Task Type Category</InputLabel>
              <Select
                disabled={operationType === 'detail'}
                value={resultItem.category === undefined ? '' : resultItem.category}
                onChange={this.handleInput('category')}
              >
                <MenuItem value="training">training</MenuItem>
                <MenuItem value="prediction">prediction</MenuItem>
                <MenuItem value="evaluation">evaluation</MenuItem>
              </Select>
              <FormHelperText style={{ display: category.message ? 'inline' : 'none' }}>
                {category.message}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={operationType === 'detail' && true}
              error={name.invalid}
              helperText={name.message}
              label={I18n.t('vade.config.taskTypeName')}
              placeholder={I18n.t('vade.config.taskTypeName')}
              value={resultItem.name === undefined ? '' : resultItem.name}
              inputProps={{ maxLength: '50' }}
              onChange={this.handleInput('name')}
              margin="dense"
            />

            <TextField
              disabled={operationType === 'detail' && true}
              error={desc.invalid}
              helperText={desc.message}
              label={I18n.t('vade.config.taskTypeDescription')}
              placeholder={I18n.t('vade.config.taskTypeDescription')}
              inputProps={{ maxLength: '50' }}
              value={resultItem.desc === undefined ? '' : resultItem.desc}
              onChange={this.handleInput('desc')}
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

CreateOrUpdate.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};
export default CreateOrUpdate;
