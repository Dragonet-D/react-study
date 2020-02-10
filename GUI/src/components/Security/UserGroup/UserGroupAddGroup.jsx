/* eslint-disable indent */
import React, { Component } from 'react';
import { I18n } from 'react-i18nify';
import { withStyles } from '@material-ui/core/styles';
import { MenuItem, FormControl, Button, Grid } from '@material-ui/core/';
import { TextField } from 'components/common';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';

const styles = {
  textField: {
    marginLeft: '20px',
    marginRight: '20px',
    width: 380
  },
  menu: {
    width: 380
  },
  tabMargin: {
    marginTop: '20px'
  },
  buttonBottom: {
    marginBottom: '12px'
  }
};

class addGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newGroup: {
        groupDescription: '',
        groupId: '',
        groupName: '',
        parentId: '',
        userId: '',
        adName: ''
      },
      currentSelectGroupId: '',
      adName: '',
      invalid: {
        groupName: false,
        groupDescription: false,
        parentId: false,
        adName: false
      },
      nameMessage: '',
      parentMessage: '',
      descriptionMessage: ''
    };
  }

  textFieldChange = name => event => {
    const { newGroup, invalid } = this.state;
    const { userId, changeCurrentGroupId } = this.props;
    const data = Object.assign({}, newGroup, {
      [name]: event.target.value,
      userId
    });
    if (event.target.value !== '') {
      const newinvalid = Object.assign({}, invalid, {
        [name]: false
      });
      this.setState({
        invalid: newinvalid
      });
      if (name === 'groupName') {
        this.setState({
          nameMessage: ''
        });
      }
      if (name === 'groupDescription') {
        this.setState({
          descriptionMessage: ''
        });
      }
      if (name === 'parentId') {
        this.setState({
          parentMessage: ''
        });
      }
    }
    if (name === 'parentId') {
      const newDetail = newGroup;
      newDetail.parentId = event.target.value;
      this.setState({
        currentSelectGroupId: event.target.value,
        newGroup: newDetail
      });
      changeCurrentGroupId(event.target.value);
    }
    if (name === 'adName') {
      const newDetail = newGroup;
      newDetail.adName = event.target.value;
      this.setState({
        adName: event.target.value,
        newGroup: newDetail
      });
    }
    this.setState({
      newGroup: data
    });
  };

  cancelBtn = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  saveBtn = () => {
    const { newGroup, invalid } = this.state;
    const { groupList, userGroupId, handleSave } = this.props;
    const { groupDescription, groupName, parentId } = newGroup;
    const parentGroupItem = groupList.filter(item => item.groupId === userGroupId);
    if (groupName === '') {
      invalid.groupName = true;
      this.setState({
        invalid,
        nameMessage: VALIDMSG_NOTNULL
      });
    } else {
      invalid.groupName = false;
      this.setState({
        invalid,
        parentMessage: ''
      });
    }
    if (groupDescription === '') {
      invalid.groupDescription = true;
      this.setState({
        invalid,
        descriptionMessage: VALIDMSG_NOTNULL
      });
    } else {
      invalid.groupDescription = false;
      this.setState({
        invalid,
        parentMessage: ''
      });
    }
    if (parentId === undefined || parentId === '') {
      invalid.parentId = true;
      this.setState({
        invalid,
        parentMessage: 'Please select the parent group in the group tree'
      });
    } else if (parentGroupItem.length === 0) {
      invalid.parentId = true;
      this.setState({
        invalid,
        parentMessage: 'You are not allowed to add the new group to this parent group'
      });
    } else {
      invalid.parentId = false;
      this.setState({
        invalid,
        parentMessage: ''
      });
    }
    if (parentId && parentId !== '' && groupDescription !== '' && groupName !== '') {
      // if (adName !== '' && !invalid.parentId) {
      //   dispatch({
      //     type: 'securityUserGroup/getDomainList',
      //     payload: { obj: newGroup }
      //   });
      // } else {
      handleSave({
        parentGroupName: parentGroupItem[0].groupName,
        ...newGroup
      });
      // }
    }
  };

  clearGroup = () => {
    const data = {
      groupName: '',
      description: '',
      parentGroup: ''
    };
    this.setState({
      newGroup: data
    });
  };

  componentWillReceiveProps(nextProps) {
    const { newGroup, currentSelectGroupId } = this.state;
    if (nextProps.userGroupId !== currentSelectGroupId) {
      const newDetail = newGroup;
      newDetail.parentId = nextProps.userGroupId;
      const { parentId } = newDetail;
      const { invalid } = this.state;
      const parentGroupItem = nextProps.groupList.filter(
        item => item.groupId === nextProps.userGroupId
      );
      if (parentId === undefined || parentId === '') {
        invalid.parentId = true;
        this.setState({
          invalid,
          parentMessage: 'Please Select the parent group in the group tree'
        });
      } else if (parentGroupItem.length === 0) {
        invalid.parentId = true;
        this.setState({
          invalid,
          parentMessage: 'You are not allowed to add the new group to this parent group'
        });
      } else {
        invalid.parentId = false;
        this.setState({
          invalid,
          parentMessage: ''
        });
      }
      this.setState({
        currentSelectGroupId: nextProps.userGroupId,
        newGroup: newDetail
      });
    }
  }

  componentDidMount() {
    const { newGroup } = this.state;
    const { userGroupId } = this.props;
    const newDetail = { ...newGroup };
    newDetail.parentId = userGroupId;
    this.setState({
      currentSelectGroupId: userGroupId,
      newGroup: newDetail
    });
  }

  render() {
    const { classes, groupList, userGroupId, domainList } = this.props;
    const {
      newGroup,
      invalid,
      nameMessage,
      parentMessage,
      descriptionMessage,
      adName
    } = this.state;
    let parentGroupName = '';
    if (userGroupId === undefined) {
      parentGroupName = I18n.t('security.userGroup.content.noParent');
    } else {
      const parentGroupItem = groupList.filter(item => item.groupId === userGroupId);
      if (parentGroupItem.length > 0) {
        parentGroupName = parentGroupItem[0].groupName;
      } else if (parentGroupItem.length === 0) {
        parentGroupName = I18n.t('security.userGroup.content.notAllowed');
      }
    }
    return (
      <div>
        <FormControl fullWidth>
          <TextField
            error={invalid.groupName}
            helperText={nameMessage}
            label={I18n.t('security.userGroup.label.groupName')}
            className={classes.textField}
            onChange={this.textFieldChange('groupName')}
            margin="normal"
            multiline
            value={newGroup.groupName}
            inputProps={{
              maxLength: '50'
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            error={invalid.groupDescription}
            helperText={descriptionMessage}
            label={I18n.t('security.userGroup.label.groupDescription')}
            multiline
            value={newGroup.groupDescription}
            onChange={this.textFieldChange('groupDescription')}
            className={classes.textField}
            margin="normal"
            inputProps={{
              maxLength: '200'
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            error={invalid.parentId}
            helperText={parentMessage}
            // disabled
            label={I18n.t('security.userGroup.label.parentGroup')}
            value={parentGroupName}
            className={classes.textField}
            margin="normal"
            inputProps={{
              maxLength: '50'
            }}
          />
        </FormControl>

        <FormControl
          fullWidth
          style={{
            display:
              !invalid.parentId && userGroupId === 'a0001' && parentGroupName !== '--Not Allowed--'
                ? 'flex'
                : 'none'
          }}
        >
          <TextField
            select
            label={I18n.t('security.userGroup.label.domainName')}
            className={classes.textField}
            value={adName || I18n.t('security.userGroup.content.pleaseSelect')}
            onChange={this.textFieldChange('adName')}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {domainList && domainList.length > 0
              ? domainList.map(option => (
                  // eslint-disable-next-line react/jsx-indent
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))
              : ''}
          </TextField>
        </FormControl>

        <Grid container spacing={8} className={classes.tabMargin}>
          <Grid item className={classes.buttonBottom}>
            <Button color="primary" onClick={this.saveBtn}>
              {I18n.t('security.userGroup.button.save')}
            </Button>
          </Grid>

          <Grid item className={classes.buttonTop}>
            <Button color="primary" onClick={this.cancelBtn}>
              {I18n.t('security.userGroup.button.cancel')}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(addGroup);
