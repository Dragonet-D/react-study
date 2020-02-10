import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import { TextField, ToolTip, DialogTitle, Button } from 'components/common';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import { withStyles } from '@material-ui/core/styles';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { PlaylistAdd } from '@material-ui/icons';

const initialVerificationObject = {
  isVerified: true,
  name: {
    invalid: false
  },
  desc: {
    invalid: false
  },
  commandStr: {
    invalid: false
  },
  taskTypeId: {
    invalid: false
  },
  taskTypeName: {
    invalid: false
  },
  outputDataName: {
    invalid: false
  },
  outputDataDesc: {
    invalid: false
  },
  category: {
    invalid: false
  },
  programId: {
    invalid: false
  }
};
const styles = () => ({
  myInput: {
    width: 292,
    height: 34,
    padding: 4,
    margin: 4
  },
  shortDropDown: {
    width: 284
  },
  fullWidFlt: {
    width: '100%'
  },
  newTab: {
    padding: 10,
    backgroundColor: '#23304f',
    float: 'left',
    marginLeft: 205,
    width: 290
  },
  formLabelWid: {
    width: 181
  }
});
class AddOrUpdateDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      resultItem: [],
      taskTypeList: [],
      programFileData: [],
      ...initialVerificationObject
    };
    this.proTypeItem = {};
  }

  componentWillReceiveProps(nextProps) {
    const { itemData, taskTypeList } = this.props;
    const { resultItem } = this.state;
    if (
      nextProps.itemData !== itemData &&
      nextProps.operationType !== 'create' &&
      !nextProps.flag_openCreate
    ) {
      const resultItem = Object.assign({}, nextProps.itemData);
      if (nextProps.itemData.category) {
        const taskTypeList = nextProps.taskTypeList.filter(
          item => item.category === nextProps.itemData.category
        );
        this.setState({
          taskTypeList
        });
      }
      if (nextProps.programFileData) {
        const programFileData = nextProps.programFileData.filter(
          item => item.taskTypeId === nextProps.itemData.taskTypeId
        );
        const programItemData = programFileData.filter(
          item => item.uuid === nextProps.itemData.programId
        )[0];
        if (programItemData) {
          try {
            if (programItemData.parameters) {
              if (typeof programItemData.parameters === 'string') {
                programItemData.parameters = JSON.parse(programItemData.parameters);
              }
              if (typeof programItemData.parameters === 'object') {
                programItemData.parameters = programItemData.parameters;
              }
              this.proTypeItem = programItemData;
            }
            // resultItem.commandTemplate = itemData.commandTemplate;
            // let defaultObj = {}
            if (nextProps.itemData.commandStr && nextProps.itemData.commandStr !== 'undefined') {
              let paramArr = [];
              if (typeof nextProps.itemData.commandStr === 'string') {
                paramArr = JSON.parse(nextProps.itemData.commandStr);
              }
              if (typeof nextProps.itemData.commandStr === 'object') {
                paramArr = nextProps.itemData.commandStr;
              }
              resultItem.commandStr = paramArr;
            }
          } catch (e) {
            // console.log('Err json parse : ', e);
          }
        } else {
          this.proTypeItem = {};
        }
        this.setState({
          programFileData
        });
      }
      this.setState({
        resultItem
      });
    }
    if (nextProps.taskTypeList && nextProps.taskTypeList !== taskTypeList) {
      if (resultItem.category) {
        const taskTypeList = nextProps.taskTypeList.filter(
          item => item.category === resultItem.category
        );
        this.setState({
          taskTypeList
        });
      }
    }
  }

  handleInput = (prop, sprop) => event => {
    const { taskTypeList } = this.props;
    const { resultItem } = this.state;
    const val = event.target.value;
    if (prop === 'category') {
      if (val !== resultItem.category) {
        // clean data
        resultItem.taskTypeId = '';
        resultItem.programId = '';
        resultItem.commandTemplate = '';
        resultItem.commandStr = '';
        this.proTypeItem = {};
      }
      // resultItem[prop] = val;
      if (taskTypeList) {
        this.setState({
          taskTypeList: taskTypeList.filter(item => item.category === val)
        });
      }
    }
    if (prop === 'taskTypeId') {
      const { programFileData: pFileData } = this.props;
      if (pFileData) {
        const programFileData = pFileData.filter(item => item.taskTypeId === val);
        if (val !== resultItem.taskTypeId) {
          resultItem.programId = '';
          resultItem.commandTemplate = '';
          resultItem.commandStr = '';
          this.proTypeItem = {};
        }
        this.setState({
          programFileData
        });
      }
    }
    if (prop === 'programId') {
      const { programFileData } = this.state;
      const itemData = programFileData.filter(item => item.uuid === event.target.value)[0];
      if (itemData) {
        try {
          resultItem.commandTemplate = itemData.commandTemplate;
          const defaultObj = {};
          if (itemData.parameters && itemData.parameters !== 'undefined') {
            let paramArr = [];
            if (typeof itemData.parameters === 'string') {
              paramArr = JSON.parse(itemData.parameters);
            }
            if (typeof itemData.parameters === 'object') {
              paramArr = itemData.parameters;
            }
            itemData.parameters = paramArr;
            this.proTypeItem = itemData;
            for (const k in paramArr) {
              const prop = paramArr[k].name;
              defaultObj[prop] = '';
            }
            resultItem.commandStr = defaultObj;
          }
        } catch (e) {
          // console.log('Err json parse : ', e);
        }
      } else {
        this.proTypeItem = {};
      }
      resultItem[prop] = event.target.value;
    }
    if (prop === 'commandStr') {
      const commandStrObj = resultItem.commandStr ? resultItem.commandStr : {};
      commandStrObj[sprop] = event.target.value;
      resultItem.commandStr = commandStrObj;
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

  isValid = myNew => {
    // eslint-disable-next-line vars-on-top
    for (const key in myNew) {
      let inputValue = '';
      if (key === 'parameters' || key === 'commandStr') {
        inputValue = myNew[key];
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
    const { resultItem } = this.state;
    const { operationType, handleSubmit, itemData } = this.props;
    const myNew = {
      name: resultItem.name || '',
      desc: resultItem.desc || '',
      category: resultItem.category || '',
      taskTypeId: resultItem.taskTypeId || '',
      programId: resultItem.programId || '',
      commandTemplate: resultItem.commandTemplate || '',
      outputDataName: resultItem.outputDataName || '',
      outputDataDesc: resultItem.outputDataDesc || ''
    };
    if (resultItem.commandStr) {
      myNew.commandStr = resultItem.commandStr || '';
    }
    this.isValid(myNew);
    setTimeout(() => {
      const { isVerified } = this.state;
      if (!isVerified) return;
      if (operationType === 'update') {
        myNew.uuid = itemData.uuid;
      }
      handleSubmit(myNew);
    }, 0);
  };

  clean() {
    this.proTypeItem = {};
    this.setState({
      resultItem: [],
      taskTypeList: [],
      programFileData: [],
      ...initialVerificationObject
    });
  }

  onClose = () => {
    const { closeDialog } = this.props;
    closeDialog();
    this.clean();
  };

  componentDidMount() {
    const { getChild } = this.props;
    getChild(this);
  }

  render() {
    const { openDialog, operationType, datasetFileData, openCreateTaskTypeDialog } = this.props;
    const {
      resultItem,
      programFileData,
      taskTypeList,
      name,
      desc,
      commandStr,
      taskTypeId,
      // taskTypeName,
      outputDataName,
      outputDataDesc,
      category,
      programId
    } = this.state;
    return (
      <Dialog fullWidth maxWidth="md" open={openDialog}>
        <DialogTitle>
          <Typography color="textSecondary" variant="h6">
            {(() => {
              const con1 = operationType === 'update';
              const con2 = operationType === 'create';
              const updateTask = I18n.t('vade.config.updateTask');
              const createTask = I18n.t('vade.config.createTask');
              const taskDetails = I18n.t('vade.config.taskDetails');
              return con1 ? updateTask : con2 ? createTask : taskDetails;
            })()}
          </Typography>
        </DialogTitle>
        <DialogContent style={{ minHeight: 400 }}>
          <FormControl fullWidth>
            <TextField
              disabled
              style={{ display: operationType === 'detail' ? 'flex' : 'none' }}
              label={I18n.t('vade.config.taskStatus')}
              placeholder={I18n.t('vade.config.taskStatus')}
              value={resultItem.taskStatus ? resultItem.taskStatus : ''}
              margin="dense"
            />
            <TextField
              disabled={operationType === 'detail' && true}
              error={name.invalid}
              helperText={name.invalid ? VALIDMSG_NOTNULL : ''}
              label={I18n.t('vade.config.name')}
              placeholder={I18n.t('vade.config.name')}
              inputProps={{ maxLength: '50' }}
              value={resultItem.name ? resultItem.name : ''}
              onChange={this.handleInput('name')}
              margin="dense"
            />
            <TextField
              disabled={operationType === 'detail' && true}
              error={desc.invalid}
              helperText={desc.invalid ? VALIDMSG_NOTNULL : ''}
              label={I18n.t('vade.config.description')}
              placeholder={I18n.t('vade.config.description')}
              inputProps={{ maxLength: '50' }}
              value={resultItem.desc ? resultItem.desc : ''}
              onChange={this.handleInput('desc')}
              margin="dense"
            />
            <div>
              <TextField
                select
                disabled={operationType === 'detail' && true}
                style={{ width: '32%' }}
                label={I18n.t('vade.config.taskCategory')}
                error={category.invalid}
                value={resultItem.category ? resultItem.category : ''}
                onChange={this.handleInput('category')}
                helperText={category.invalid ? VALIDMSG_NOTNULL : ''}
                margin="dense"
              >
                {['training', 'prediction', 'evaluation'].map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                disabled={operationType === 'detail' || !resultItem.category}
                style={{ width: '33%', marginLeft: 8 }}
                label={I18n.t('vade.config.taskType')}
                value={resultItem.taskTypeId ? resultItem.taskTypeId : ''}
                error={taskTypeId.invalid}
                onChange={this.handleInput('taskTypeId')}
                helperText={taskTypeId.invalid ? VALIDMSG_NOTNULL : ''}
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <ToolTip
                      title="Create Task Type"
                      style={{
                        display: operationType === 'create' ? 'inline-flex' : 'none',
                        margin: 0
                      }}
                    >
                      <IconButton
                        aria-label="Create Task Type"
                        style={{ padding: 1 }}
                        disabled={operationType === 'detail' && true}
                        onClick={() => {
                          openCreateTaskTypeDialog(resultItem.category);
                        }}
                      >
                        <PlaylistAdd />
                      </IconButton>
                    </ToolTip>
                  )
                }}
              >
                {taskTypeList.map(option => (
                  <MenuItem key={option.uuid} value={option.uuid}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                style={{ width: '33%', marginLeft: 8 }}
                label={I18n.t('vade.config.program')}
                value={resultItem.programId ? resultItem.programId : ''}
                error={programId.invalid}
                disabled={operationType === 'detail' || !resultItem.taskTypeId}
                onChange={this.handleInput('programId')}
                helperText={programId.invalid ? VALIDMSG_NOTNULL : ''}
                margin="dense"
              >
                {programFileData.map(option => (
                  <MenuItem key={option.uuid} value={option.uuid}>
                    {option.fileName}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <TextField
              disabled
              style={{
                display:
                  (resultItem.category && resultItem.programId) || operationType === 'detail'
                    ? 'flex'
                    : 'none'
              }}
              label={I18n.t('vade.config.commandTemplate')}
              placeholder={I18n.t('vade.config.commandTemplate')}
              multiline
              rowsMax="6"
              value={resultItem.commandTemplate ? resultItem.commandTemplate : ''}
              margin="dense"
            />
            <div style={{ backgroundColor: '#2f3b58' }}>
              {this.proTypeItem &&
                this.proTypeItem.parameters &&
                this.proTypeItem.parameters.map(item =>
                  item.type && item.type === 'Text' ? (
                    <TextField
                      style={{
                        display: 'flex'
                      }}
                      key={item.name}
                      disabled={operationType === 'detail' && true}
                      error={commandStr.invalid}
                      helperText={commandStr.invalid ? VALIDMSG_NOTNULL : ''}
                      label={item.name}
                      placeholder={item.name}
                      inputProps={{ maxLength: '50' }}
                      value={
                        resultItem.commandStr && resultItem.commandStr[item.name]
                          ? resultItem.commandStr[item.name]
                          : ''
                      }
                      onChange={this.handleInput('commandStr', item.name)}
                      margin="normal"
                    />
                  ) : (
                    <FormControl
                      key={item.name}
                      disabled={operationType === 'detail' && true}
                      error={commandStr.invalid}
                      margin="dense"
                      style={{
                        display: resultItem.category ? 'flex' : 'none'
                      }}
                    >
                      <InputLabel htmlFor="name-fileTypeId">{item.name}</InputLabel>
                      <Select
                        disabled={operationType === 'detail' && true}
                        value={
                          resultItem.commandStr && resultItem.commandStr[item.name]
                            ? resultItem.commandStr[item.name]
                            : ''
                        }
                        onChange={this.handleInput('commandStr', item.name)}
                      >
                        {item.type === 'Program'
                          ? programFileData &&
                            programFileData.map(option => (
                              <MenuItem key={option.uuid} value={option.uuid}>
                                {option.fileName}
                              </MenuItem>
                            ))
                          : datasetFileData &&
                            datasetFileData
                              .filter(i => i.entry === item.type)
                              .map(option => (
                                <MenuItem key={option.uuid} value={option.uuid}>
                                  {option.fileName}
                                </MenuItem>
                              ))}
                        {/* {item.type === 'Data' &&
                          datasetFileData &&
                          datasetFileData
                            .filter(i => i.entry === item.type)
                            .map(option => (
                              <MenuItem key={option.uuid} value={option.uuid}>
                                {option.fileName}
                              </MenuItem>
                            ))} */}
                      </Select>
                      <FormHelperText>{commandStr.invalid ? VALIDMSG_NOTNULL : ''}</FormHelperText>
                    </FormControl>
                  )
                )}
            </div>
            <TextField
              disabled
              style={{ display: operationType === 'detail' ? 'flex' : 'none' }}
              label={I18n.t('vade.config.createTime')}
              placeholder={I18n.t('vade.config.createTime')}
              value={resultItem.createTime ? resultItem.createTime : ''}
              margin="dense"
            />
            <TextField
              disabled
              style={{ display: operationType === 'detail' ? 'flex' : 'none' }}
              label={I18n.t('vade.config.startTime')}
              placeholder={I18n.t('vade.config.startTime')}
              value={resultItem.startTime ? resultItem.startTime : ''}
              margin="dense"
            />
            <TextField
              disabled
              style={{ display: operationType === 'detail' ? 'flex' : 'none' }}
              label={I18n.t('vade.config.endTime')}
              placeholder={I18n.t('vade.config.endTime')}
              value={resultItem.endTime ? resultItem.endTime : ''}
              margin="dense"
            />

            <TextField
              disabled={operationType === 'detail' && true}
              error={outputDataName.invalid}
              helperText={outputDataName.invalid ? VALIDMSG_NOTNULL : ''}
              label={I18n.t('vade.config.outputDataName')}
              placeholder={I18n.t('vade.config.outputDataName')}
              inputProps={{ maxLength: '50' }}
              value={resultItem.outputDataName ? resultItem.outputDataName : ''}
              onChange={this.handleInput('outputDataName')}
              margin="dense"
            />
            <TextField
              disabled={operationType === 'detail' && true}
              error={outputDataDesc.invalid}
              helperText={outputDataDesc.invalid ? VALIDMSG_NOTNULL : ''}
              label={I18n.t('vade.config.outputDataDescription')}
              placeholder={I18n.t('vade.config.outputDataDescription')}
              inputProps={{ maxLength: '50' }}
              value={resultItem.outputDataDesc ? resultItem.outputDataDesc : ''}
              onChange={this.handleInput('outputDataDesc')}
              margin="dense"
            />
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
export default withStyles(styles)(AddOrUpdateDialog);
