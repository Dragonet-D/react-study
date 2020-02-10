import React from 'react';
// import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { TextField, ToolTip, DialogTitle, Button } from 'components/common';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import _ from 'lodash';
import FolderOpen from '@material-ui/icons/FolderOpen';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import { I18n } from 'react-i18nify';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import msg from 'utils/messageCenter';
import Resumable from 'libs/resumablejs';
// import ReactResumableJs from 'libs/ReactResumableJs';
import getUrls from 'utils/urls/index';
import store from '@/index';

const urls = getUrls.vade;

const initialVerificationObject = {
  isVerified: true,
  executable: {
    invalid: false
  },
  fileTypeId: {
    invalid: false
  },
  file: {
    invalid: false
  },
  fileName: {
    invalid: false
  },
  fileDesc: {
    invalid: false
  },
  entry: {
    invalid: false
  }
};
class CreateOrUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultItem: {},
      fileTypeList: [],
      // postData: {},
      ...initialVerificationObject
    };
    this.ReactResumableJsComponent = null;
    this.r = null;
    this.uploadId = '';
  }

  componentWillReceiveProps(nextProps) {
    const { resultItem } = this.state;
    const { fileTypeList } = this.props;
    if (resultItem.entry && !_.isEqual(nextProps.fileTypeList, fileTypeList)) {
      const list = nextProps.fileTypeList.filter(item => item.entry === resultItem.entry);
      this.setState({
        fileTypeList: list
      });
    }
    if (nextProps.operationType === 'detail') {
      resultItem.fileName = nextProps.itemData.fileName;
      resultItem.fileDesc = nextProps.itemData.fileDesc;
      resultItem.entry = nextProps.itemData.entry;
      resultItem.fileTypeId = nextProps.itemData.fileTypeId;
      resultItem.file = { name: nextProps.itemData.fileRealName };
      const list = nextProps.fileTypeList.filter(item => item.entry === nextProps.itemData.entry);
      this.setState({
        resultItem,
        fileTypeList: list
      });
    } else if (!nextProps.flag_openCreate) {
      // this.clean();
    }
  }

  handleInput = prop => event => {
    const { resultItem } = this.state;
    const { fileTypeList } = this.props;
    if (prop === 'entry') {
      // filter data type list
      if (event.target.value !== resultItem.entry) {
        resultItem.fileTypeId = '';
      }
      const list = fileTypeList.filter(item => item.entry === event.target.value);
      this.setState({ fileTypeList: list });
    }
    if (prop === 'file') {
      const file = event.target.files[0];
      if (file !== '') {
        const val = event.target.files[0];
        resultItem[prop] = val;
      }
    } else {
      resultItem[prop] = event.target.value;
    }
    this.setState({
      resultItem,
      isVerified: true,
      [prop]: {
        invalid: false
      }
    });
  };

  isValid = myResult => {
    for (const key in myResult) {
      let inputValue = '';
      if (key !== 'file') {
        inputValue = myResult[key].trim();
      } else {
        inputValue = myResult[key];
      }
      if (inputValue === '') {
        this.setState({
          isVerified: false,
          [key]: {
            invalid: true
          }
        });
      }
    }
  };

  save = () => {
    const { resultItem } = this.state;
    // const { handleSubmit } = this.props;
    const { userId } = this.props;
    const myResult = {
      fileName: resultItem.fileName || '',
      fileDesc: resultItem.fileDesc || '',
      fileTypeId: resultItem.fileTypeId || '',
      // file: resultItem.file || '',
      entry: resultItem.entry || ''
    };
    this.isValid({ ...myResult, file: resultItem.file || '' });
    setTimeout(() => {
      const { isVerified } = this.state;
      if (!isVerified) return;
      const identifier = `${resultItem.file.fileName}${new Date().getTime()}`;
      this.r.opts.query = { createUserId: userId, resumableIdentifier: identifier };
      this.r.opts.postData = {
        createUserId: userId,
        category: 'data',
        resumableIdentifier: identifier,
        ...myResult
      };
      this.r.upload();
      this.onClose();
      this.uploadId = new Date().getTime();
      store.dispatch({
        type: 'messageCenter/addProgressBar',
        payload: {
          deviceName: resultItem.file.fileName,
          msg: 'Upload Data In Progress..',
          clippingId: this.uploadId
        }
      });
      // handleSubmit(myResult);
    }, 0);
  };

  clean = () => {
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

  componentDidMount() {
    const { getChild, handleSubmit } = this.props;
    getChild(this);
    setTimeout(() => {
      this.r = new Resumable({
        target: urls.uploadFileBlock.url,
        query: {},
        simultaneousUploads: 3,
        chunkSize: 5 * 1024 * 1024
      });

      if (!document.getElementById('uploadFileIpt')) return;
      this.r.assignBrowse(document.getElementById('uploadFileIpt'));
      this.r.on('fileAdded', file => {
        const { resultItem } = this.state;
        resultItem.file = file;
        this.setState({ resultItem });
      });
      this.r.on('fileSuccess', () => {
        msg.success('Upload Data Successful', 'VADE Data');
        handleSubmit();
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: this.uploadId
        });
      });
      this.r.on('fileError', () => {
        msg.error('Upload Data Failure', 'VADE Data');
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: this.uploadId
        });
      });
    }, 0);
  }

  render() {
    const { operationType, entryList, openCreateFileTypeDialog } = this.props;
    const { file, fileTypeId, fileName, fileDesc, resultItem, entry, fileTypeList } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="xs"
        open
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {operationType === 'detail'
            ? I18n.t('vade.config.dataDetails')
            : I18n.t('vade.config.createData')}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              error={entry.invalid}
              disabled={operationType === 'detail' && true}
              select
              label={I18n.t('vade.config.entry')}
              value={resultItem.entry ? resultItem.entry : ''}
              onChange={this.handleInput('entry')}
              helperText={entry.invalid ? VALIDMSG_NOTNULL : ''}
              margin="dense"
            >
              {entryList &&
                entryList
                  .map(item => item.entry)
                  .map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
              error={fileTypeId.invalid}
              disabled={operationType === 'detail' || !resultItem.entry}
              helperText={fileTypeId.invalid ? VALIDMSG_NOTNULL : ''}
              select
              label={I18n.t('vade.config.dataType')}
              value={resultItem.fileTypeId === undefined ? '' : resultItem.fileTypeId}
              onChange={this.handleInput('fileTypeId')}
              margin="dense"
              InputProps={{
                endAdornment: (
                  <ToolTip
                    title={I18n.t('vade.config.createDataType')}
                    style={{ display: operationType === 'create' ? 'inline-flex' : 'none' }}
                  >
                    <div style={{ display: 'flex' }}>
                      <IconButton
                        aria-label={I18n.t('vade.config.createDataType')}
                        style={{
                          padding: 3,
                          display: operationType === 'detail' ? 'none' : 'inherit'
                        }}
                        disabled={operationType === 'detail' || !resultItem.entry}
                        onClick={() => openCreateFileTypeDialog(resultItem.entry)}
                      >
                        <PlaylistAdd />
                      </IconButton>
                    </div>
                  </ToolTip>
                )
              }}
            >
              {fileTypeList &&
                fileTypeList.map(option => (
                  <MenuItem key={option.uuid} value={option.uuid}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              error={fileName.invalid}
              disabled={operationType === 'detail' && true}
              helperText={fileName.invalid ? VALIDMSG_NOTNULL : ''}
              value={!resultItem.fileName ? '' : resultItem.fileName}
              label={I18n.t('vade.config.name')}
              placeholder={I18n.t('vade.config.name')}
              inputProps={{
                maxLength: '50'
              }}
              onChange={this.handleInput('fileName')}
              margin="dense"
            />
            <TextField
              error={fileDesc.invalid}
              disabled={operationType === 'detail' && true}
              helperText={fileDesc.invalid ? VALIDMSG_NOTNULL : ''}
              value={!resultItem.fileDesc ? '' : resultItem.fileDesc}
              label={I18n.t('vade.config.description')}
              placeholder={I18n.t('vade.config.description')}
              inputProps={{
                maxLength: '50'
              }}
              onChange={this.handleInput('fileDesc')}
              margin="dense"
            />
            <FormControl error={file.invalid}>
              <InputLabel disabled={operationType === 'detail' && true}>
                {I18n.t('vade.config.chooseFiles')}
              </InputLabel>
              <Input
                disabled={operationType === 'detail' && true}
                placeholder={I18n.t('vade.config.chooseFiles')}
                value={!resultItem.file ? '' : resultItem.file.fileName}
                onChange={this.handleInput('file')}
                endAdornment={
                  <InputAdornment
                    position="end"
                    style={{
                      display: operationType === 'detail' ? 'none' : 'inherit'
                    }}
                  >
                    <IconButton aria-label={I18n.t('vade.config.chooseFiles')}>
                      <label htmlFor="uploadFileIpt">
                        <FolderOpen />
                      </label>
                    </IconButton>
                  </InputAdornment>
                }
              />
              <input
                className="fileipt"
                id="uploadFileIpt"
                onChange={this.handleInput('file')}
                type="file"
                style={{ display: 'none' }}
              />
              <FormHelperText>{file.invalid ? VALIDMSG_NOTNULL : ''}</FormHelperText>
            </FormControl>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.save}
            color="primary"
            style={{ display: operationType === 'detail' ? 'none' : 'block' }}
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

/* CreateOrUpdate.propTypes = {
  closeDialog: PropTypes.func.isRequired
  // handleSubmit: PropTypes.func.isRequired
}; */

export default CreateOrUpdate;
