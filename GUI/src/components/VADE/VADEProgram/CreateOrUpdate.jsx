import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { TextField as MyTextField, ToolTip, DialogTitle, Button } from 'components/common';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import { FolderOpen, PlaylistAdd } from '@material-ui/icons';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { I18n } from 'react-i18nify';
import msg from 'utils/messageCenter';
import Resumable from 'libs/resumablejs';
import getUrls from 'utils/urls/index';
import store from '@/index';

const urls = getUrls.vade;
const initialVerificationType = {
  isVerified: true,
  taskTypeId: {
    invalid: false
  },
  commandTemplate: {
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
  parameters: {
    invalid: false
  },
  description: {
    invalid: false
  },
  entry: {
    invalid: false
  }
};
const styles = theme => ({
  paramHead: {
    margin: 0,
    padding: '20px 0 10px',
    fontSize: 14,
    color: theme.palette.primary,
    backgroundColor: theme.palette.primary.light
  },
  paramListBkColor: {
    backgroundColor: theme.palette.primary.light //  '#2f3b58'
  },
  dialogTitleTxt: {
    color: theme.palette.text.primary
  }
});

class AddOrUpdateDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      resultItem: [],
      tempParamObj: {},
      parameterList: [],
      taskTypeList: [],
      ...initialVerificationType
    };
    this.ReactResumableJsComponent = null;
    this.r = null;
    this.uploadId = '';
  }

  componentWillReceiveProps(nextProps) {
    const { taskTypeList, resultItem } = this.state;
    if (nextProps.operationType === 'detail' && !nextProps.flag_openCreate) {
      const resultItem = nextProps.itemData;
      resultItem.file = { name: nextProps.itemData.fileRealName };
      this.setState({
        resultItem
      });
    }
    if (nextProps.taskTypeList !== taskTypeList) {
      let { taskTypeList } = nextProps;
      if (resultItem.entry) {
        taskTypeList = nextProps.taskTypeList.filter(item => item.category === resultItem.entry);
      }
      this.setState({ taskTypeList });
    }
  }

  handleInput = (prop, itemProp, isDataEntry) => event => {
    const { resultItem } = this.state;
    const { taskTypeList } = this.props;
    if (prop === 'entry') {
      // filter program list
      if (event.target.value !== resultItem.entry) {
        resultItem.taskTypeId = '';
      }
      const newTaskTypeList = taskTypeList.filter(item => item.category === event.target.value);
      this.setState({ taskTypeList: newTaskTypeList });
    }
    if (prop === 'parameters') {
      const parameterObj = resultItem.parameters ? resultItem.parameters : {};
      if (parameterObj[itemProp] === 'Data' && isDataEntry) {
        const { tempParamObj } = this.state;
        tempParamObj[itemProp] = event.target.value;
        this.setState({ tempParamObj });
      } else {
        parameterObj[itemProp] = event.target.value;
      }
      resultItem.parameters = parameterObj;
    } else if (prop === 'file') {
      const file = event.target.files[0];
      if (file !== '' && event.target.value) {
        const a = event.target.files[0];
        resultItem[prop] = a;
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

  validFormat = () => {
    const { resultItem } = this.state;
    const str = resultItem.commandTemplate;
    if (!str) {
      return;
    }
    const reg = /\$\{(.*?)\}/g;
    const result = str.match(reg);
    if (result) {
      const arr = result.map(item => item.replace('${', '').replace('}', ''));
      const parameterList = new Set(arr);
      this.setState({
        parameterList: [...parameterList],
        tempParamObj: {}
      });
    }
  };

  isValid = myNew => {
    for (const key in myNew) {
      let inputValue = '';
      if (key === 'file') {
        inputValue = myNew[key];
      } else if (key === 'parameters') {
        const { parameterList } = this.state;
        inputValue = myNew[key];
        let index = 0;
        let flag = false;
        for (const k in inputValue) {
          index++;
          if (inputValue[k].type === 'Data') {
            flag = true;
          }
        }
        if (index < parameterList.length || flag) {
          this.setState({
            isVerified: false,
            [key]: {
              invalid: true
            }
          });
        }
      } else {
        inputValue = myNew[key].trim();
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
    const { resultItem, parameterList, tempParamObj } = this.state;
    const { userId } = this.props;
    const myResult = {
      taskTypeId: resultItem.taskTypeId || '',
      // file: resultItem.file || '',
      fileName: resultItem.fileName || '',
      fileDesc: resultItem.fileDesc || '',
      entry: resultItem.entry || '',
      commandTemplate: resultItem.commandTemplate || ''
    };
    if (resultItem.commandTemplate) {
      if (parameterList.length > 0) {
        // if exists parameters,must fill in all 'parameters'
        // or needn't send this param 'parameters'
        myResult.parameters = Object.assign({}, resultItem.parameters);
        const paramJson = Object.assign(myResult.parameters, tempParamObj);
        const paramArr = [];
        for (const key in paramJson) {
          paramArr.push({ name: key, type: paramJson[key] });
        }
        myResult.parameters = paramArr;
      }
    }
    this.isValid({ ...myResult, file: resultItem.file || '' });
    // handleSubmit(myResult);
    myResult.parameters = JSON.stringify(myResult.parameters);
    setTimeout(() => {
      const { isVerified } = this.state;
      if (!isVerified) return;
      const identifier = `${resultItem.file.fileName}${new Date().getTime()}`;
      this.r.opts.query = { createUserId: userId, resumableIdentifier: identifier };
      this.r.opts.postData = {
        createUserId: userId,
        category: 'program',
        resumableIdentifier: identifier,
        ...myResult
      };
      this.r.upload();
      this.uploadId = new Date().getTime();
      store.dispatch({
        type: 'messageCenter/addProgressBar',
        payload: {
          deviceName: resultItem.file.fileName,
          msg: 'Upload Program In Progress..',
          clippingId: this.uploadId
        }
      });
      this.handleCloseDialog();
    }, 0);
  };

  clean() {
    this.setState({
      resultItem: [],
      tempParamObj: {},
      parameterList: [],
      ...initialVerificationType
    });
    // this.proTypeItem = {};
  }

  handleCloseDialog = () => {
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
        msg.success('Upload Program Successful', 'VADE Program');
        handleSubmit();
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: this.uploadId
        });
      });
      this.r.on('fileError', () => {
        msg.error('Upload Program Failure', 'VADE Program');
        store.dispatch({
          type: 'messageCenter/delProgressBar',
          id: this.uploadId
        });
      });
    }, 0);
  }

  render() {
    const {
      classes,
      operationType,
      dataEntryList,
      programEntryList,
      openCreateTaskTypeDialog
    } = this.props;
    const {
      resultItem,
      taskTypeId,
      commandTemplate,
      file,
      fileName,
      fileDesc,
      entry,
      parameters, // valid msg
      parameterList,
      tempParamObj,
      taskTypeList
    } = this.state;
    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-desc"
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitleTxt}>
          {operationType === 'detail'
            ? I18n.t('vade.config.taskTypeDetails')
            : I18n.t('vade.config.createProgram')}
        </DialogTitle>
        <DialogContent
          style={{
            minHeight: 200
          }}
        >
          <FormControl fullWidth>
            <MyTextField
              disabled={operationType === 'detail' && true}
              error={fileName.invalid}
              helperText={fileName.invalid ? VALIDMSG_NOTNULL : ''}
              label={I18n.t('vade.config.name')}
              placeholder={I18n.t('vade.config.name')}
              inputProps={{ maxLength: '50' }}
              value={resultItem.fileName ? resultItem.fileName : ''}
              onChange={this.handleInput('fileName')}
              margin="dense"
            />
            <MyTextField
              disabled={operationType === 'detail' && true}
              error={fileDesc.invalid}
              helperText={fileDesc.invalid ? VALIDMSG_NOTNULL : ''}
              label={I18n.t('vade.config.description')}
              placeholder={I18n.t('vade.config.description')}
              inputProps={{ maxLength: '50' }}
              value={resultItem.fileDesc ? resultItem.fileDesc : ''}
              onChange={this.handleInput('fileDesc')}
              margin="dense"
            />
            <div>
              <MyTextField
                inputProps={{
                  maxLength: '255'
                }}
                error={entry.invalid}
                disabled={operationType === 'detail' && true}
                select
                label={I18n.t('vade.config.entry')}
                style={{
                  width: '35%'
                }}
                value={resultItem.entry ? resultItem.entry : ''}
                onChange={this.handleInput('entry')}
                helperText={entry.invalid ? VALIDMSG_NOTNULL : ''}
                margin="dense"
              >
                {programEntryList &&
                  programEntryList.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
              </MyTextField>
              <MyTextField
                id="standard-select-pro"
                style={{
                  marginLeft: 8,
                  width: '64%'
                }}
                className={classes.dialogTitleTxt}
                disabled={operationType === 'detail' || !resultItem.entry}
                error={taskTypeId.invalid}
                select
                label={I18n.t('vade.config.taskType')}
                value={resultItem.taskTypeId ? resultItem.taskTypeId : ''}
                onChange={this.handleInput('taskTypeId')}
                helperText={taskTypeId.invalid ? VALIDMSG_NOTNULL : ''}
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <ToolTip
                      title={I18n.t('vade.config.createTaskType')}
                      style={{
                        display: operationType === 'create' ? 'inline-flex' : 'none',
                        margin: 0
                      }}
                    >
                      <IconButton
                        aria-label={I18n.t('vade.config.createTaskType')}
                        style={{
                          padding: 1,
                          display: operationType === 'create' ? 'inline-flex' : 'none'
                        }}
                        disabled={operationType === 'detail' && true}
                        onClick={() => {
                          openCreateTaskTypeDialog(resultItem.entry);
                        }}
                      >
                        <PlaylistAdd />
                      </IconButton>
                    </ToolTip>
                  )
                }}
              >
                {taskTypeList &&
                  taskTypeList.map(option => (
                    <MenuItem key={option.uuid} value={option.uuid}>
                      {option.name}
                    </MenuItem>
                  ))}
              </MyTextField>
            </div>
            <TextField
              disabled={operationType === 'detail' && true}
              error={commandTemplate.invalid}
              helperText={commandTemplate.invalid ? VALIDMSG_NOTNULL : ''}
              label={I18n.t('vade.config.commandTemplate')}
              placeholder={I18n.t('vade.config.commandTemplate')}
              multiline
              value={resultItem.commandTemplate ? resultItem.commandTemplate : ''}
              onChange={this.handleInput('commandTemplate')}
              onBlur={this.validFormat}
              margin="dense"
            />
            {resultItem.commandTemplate && parameterList && parameterList.length > 0 ? (
              <p
                style={{
                  display: operationType !== 'detail' ? 'flex' : 'none'
                }}
                className={classes.paramHead}
              >
                {I18n.t('vade.config.pleaseSelectParametersType')}
              </p>
            ) : (
              ''
            )}
            {operationType !== 'detail' &&
              resultItem.commandTemplate &&
              parameterList &&
              parameterList.length > 0 &&
              parameterList.map(item => (
                <div key={item}>
                  <FormControl
                    error={
                      parameters.invalid &&
                      (!resultItem.parameters ||
                        !resultItem.parameters[item] ||
                        resultItem.parameters[item] === '')
                    }
                    className={classes.paramListBkColor}
                    style={{
                      width:
                        resultItem.parameters &&
                        resultItem.parameters[item] &&
                        resultItem.parameters[item] === 'Data'
                          ? '50%'
                          : '100%'
                    }}
                  >
                    <InputLabel htmlFor="name-taskTypeId">{item}</InputLabel>
                    <Select
                      disabled={operationType === 'detail' && true}
                      value={
                        resultItem.parameters && resultItem.parameters[item]
                          ? resultItem.parameters[item]
                          : ''
                      }
                      onChange={this.handleInput('parameters', item)}
                    >
                      {['Text', 'Data', 'Program'].map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    error={
                      parameters.invalid &&
                      (!tempParamObj || !tempParamObj[item] || tempParamObj[item] === 'Data')
                    }
                    className={classes.paramListBkColor}
                    style={{
                      display:
                        resultItem.parameters &&
                        resultItem.parameters[item] &&
                        resultItem.parameters[item] === 'Data'
                          ? 'inline-flex'
                          : 'none',
                      width: '50%',
                      paddingLeft: 10
                    }}
                  >
                    <InputLabel style={{ paddingLeft: 10 }} htmlFor="name-taskTypeId">
                      {I18n.t('vade.config.dataEntry')}
                    </InputLabel>
                    <Select
                      disabled={operationType === 'detail' && true}
                      value={tempParamObj && tempParamObj[item] ? tempParamObj[item] : ''}
                      onChange={this.handleInput('parameters', item, true)}
                    >
                      {dataEntryList.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <FormHelperText>{parameters.message}</FormHelperText> */}
                  </FormControl>
                </div>
              ))}

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
                style={{ display: 'none' }}
                id="uploadFileIpt"
                multiple
                onChange={this.handleInput('file')}
                type="file"
              />
              <FormHelperText>{file.invalid ? VALIDMSG_NOTNULL : ''}</FormHelperText>
            </FormControl>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.save}
            color="secondary"
            style={{ display: operationType === 'detail' ? 'none' : 'block' }}
          >
            {I18n.t('global.button.save')}
          </Button>
          <Button onClick={this.handleCloseDialog} color="secondary" autoFocus>
            {operationType === 'detail'
              ? I18n.t('global.button.back')
              : I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
// export default withStyles(styles)(AddOrUpdateDialog);
export default withStyles(styles)(AddOrUpdateDialog);
