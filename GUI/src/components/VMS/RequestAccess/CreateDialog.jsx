import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Switch from '@material-ui/core/Switch';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormHelperText from '@material-ui/core/FormHelperText';
import classNames from 'classnames';
import { I18n } from 'react-i18nify';
import Checkbox from '@material-ui/core/Checkbox';
import _ from 'lodash';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { DialogTitle, MapSketch } from 'components/common';
import {
  TabRow,
  TabCell,
  Tab
} from 'components/Security/RoleManagement/RoleManagementCollapseTable';
import Typography from '@material-ui/core/Typography';

const MainSwitch = withStyles(theme => {
  return {
    switchBase: {
      color: theme.palette.primary.main,
      '&$checked': {
        color: theme.palette.primary.main
      },
      '&$checked + $track': {
        backgroundColor: theme.palette.primary.main
      }
    },
    checked: {},
    track: {}
  };
})(Switch);

const styles = () => ({
  panelRoot: {
    boxShadow: 'none',
    borderTop: '1px solid #60667b',
    borderBottom: '1px solid #60667b'
  },
  panelRootSeleted: {
    boxShadow:
      '0px 1px 10px 0px rgba(0,0,0,0.2), 0px 1px 10px 0px rgba(0,0,0,0.14), 0px 2px 10px -1px rgba(0,0,0,0.12)'
    // border: '1px dashed red'
  },
  summaryRoot: {
    height: 50,
    minHeight: 40,
    padding: 0,
    '&$summaryExpanded': {
      minHeight: 50,
      borderRight: '2px solid #2587d8',
      borderLeft: '2px solid #2587d8'
    }
  },
  summaryExpanded: {},
  detailRoot: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  tabRowSize: {
    paddingRight: 32
  },
  headTitle: {
    fontWeight: 'bold',
    paddingRight: 32
  },
  Radio: {
    paddingTop: 0,
    paddingBottom: 0
  },
  expandIcon: {
    color: '#2587d8'
  },
  expansionPanelExpanded: {
    marginBottom: 16,
    '&:first-child': {
      marginTop: 16
    }
  },
  tipsStyle: {
    color: '#f44336'
  },
  paper: {
    height: '400px'
  }
});
class AddDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isSearch: false,
      searchInputBlank: false,
      requestReason: '',
      requestReasonError: false,
      requestReasonMessage: '',
      checkedId: [],
      requestGroupError: false,
      itemData: {},
      mapOpen: false,
      permissionCheck: new Set(),
      permissionStringError: false,
      permissionStringMessage: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const { itemData } = this.state;
    if (_.isEqual(nextProps.itemData, itemData)) return;
    if (nextProps.itemData) {
      this.setState({
        requestReason: nextProps.itemData.requestReason,
        checkedId: nextProps.itemData.requestGroupId,
        itemData: nextProps.itemData
      });
    }
  }

  handleGroupSelected = event => {
    event.stopPropagation();
    const { checked } = event.target;
    const { checkedId } = this.state;
    const chechboxValue = event.target.value;
    // const groupName = event.target.name;
    // const valueIndex = checkedId.indexOf(chechboxValue);
    if (checked && checkedId !== chechboxValue) {
      this.setState({ checkedId: chechboxValue, requestGroupError: false });
      // setcurrentSelectedGroupName(groupName);
    }
  };

  isSelectedGroup = id => {
    const { checkedId } = this.state;
    return checkedId.indexOf(id) !== -1;
  };

  handleGroupModuleSelected = event => {
    const { checkedId } = this.state;
    event.stopPropagation();
    const { checked } = event.target;
    const chechboxValue = event.target.value;
    // const groupName = event.target.name;
    // const valueIndex = checkedId.indexOf(chechboxValue);
    if (checked && checkedId !== chechboxValue) {
      this.setState({ checkedId: chechboxValue, requestGroupError: false });
      // setcurrentSelectedGroupName(groupName);
    }
  };

  onChangeOfReason = event => {
    this.setState({
      requestReasonError: false,
      requestReasonMessage: '',
      requestReason: event.target.value
    });
  };

  save = () => {
    const { handleSubmit, permissionList } = this.props;
    const { requestReason, checkedId, permissionCheck } = this.state;
    let permissionString = [];
    permissionList.forEach(e => {
      if (permissionCheck.has(e.featureUuid)) {
        permissionString.push(e.featureUuid);
      }
    });
    permissionString = permissionString.join(',');
    // valid requestReason not null
    let validFlag = false;
    if (!requestReason || requestReason.trim().length < 1) {
      this.setState({
        requestReasonError: true,
        requestReasonMessage: VALIDMSG_NOTNULL
      });
      validFlag = true;
    }
    // valid permission not null
    if (!permissionString || permissionString.trim().length < 1) {
      this.setState({
        permissionStringError: true,
        permissionStringMessage: VALIDMSG_NOTNULL
      });
      validFlag = true;
    }
    // valid requestGroup not null
    if (checkedId.length < 1) {
      this.setState({
        requestGroupError: true
      });
      validFlag = true;
    }
    if (validFlag) {
      return;
    }
    handleSubmit({ requestReason, checkedId, permissionString });
  };

  componentDidMount() {
    const { itemData, operateType } = this.props;
    const { permissionCheck } = this.state;
    if (operateType !== 'create' && itemData.accessPermission) {
      itemData.accessPermission.forEach(x => {
        permissionCheck.add(x);
      });
    }
    if (itemData && !_.isEqual(itemData, {})) {
      this.setState({
        requestReason: itemData.requestReason,
        checkedId: itemData.requestGroupId,
        itemData,
        permissionCheck
      });
    }
  }

  handleChange = x => {
    const { permissionCheck } = this.state;
    const { permissionList } = this.props;
    if (permissionCheck.has(x.featureUuid)) {
      permissionList.forEach(e => {
        if (e.releationship === x.featureUuid) {
          permissionCheck.delete(e.featureUuid);
        }
      });
      permissionCheck.delete(x.featureUuid);
    } else {
      permissionCheck.add(x.releationship);
      permissionCheck.add(x.featureUuid);
    }
    this.setState({ permissionCheck });
  };

  render() {
    const {
      classes,
      itemData,
      openDialog,
      closeDialog,
      groupData,
      checkedId,
      isVisibility,
      operateType,
      channelData,
      permissionList
    } = this.props;
    const {
      isSearch,
      searchInputBlank,
      requestReasonMessage,
      requestReasonError,
      requestGroupError,
      mapOpen,
      requestReason,
      permissionCheck,
      permissionStringError,
      permissionStringMessage
    } = this.state;

    return (
      <Dialog fullWidth maxWidth="md" open={openDialog}>
        <DialogTitle>
          {operateType === 'create'
            ? I18n.t('uvms.requestAccess.createDialog.titleRA')
            : I18n.t('uvms.requestAccess.createDialog.titleUR')}
        </DialogTitle>

        <DialogContent style={{ minHeight: 350 }}>
          <TextField
            error={requestReasonError}
            helperText={requestReasonMessage}
            required
            placeholder={I18n.t('uvms.requestAccess.createDialog.requestReason')}
            label={I18n.t('uvms.requestAccess.createDialog.requestReason')}
            value={requestReason}
            margin="normal"
            fullWidth
            onChange={this.onChangeOfReason}
            inputProps={{
              maxLength: '255'
            }}
          />
          <div style={{ display: operateType === 'create' ? 'none' : 'block' }}>
            <div style={{ display: 'flex' }}>
              <FormHelperText style={{ marginTop: 17, fontSize: 15 }}>
                {I18n.t('uvms.requestAccess.createDialog.currentGroup')}
              </FormHelperText>
              <Radio disabled checked />
              <span style={{ marginTop: 15 }}>
                {(itemData && itemData.requestGroupName) ||
                  I18n.t('uvms.requestAccess.createDialog.error')}
              </span>
            </div>
          </div>
          <div>
            <div>
              <Typography color="textSecondary" variant="h6" component="span">
                {I18n.t('uvms.requestAccess.createDialog.requestPermission')}
              </Typography>
            </div>
            <div style={{ color: '#f44336' }} hidden={!permissionStringError}>
              {permissionStringMessage}
            </div>
            {permissionList.map(x => {
              return (
                <FormControlLabel
                  value="end"
                  control={
                    <Checkbox
                      checked={permissionCheck.has(x.featureUuid)}
                      onChange={() => {
                        this.handleChange(x);
                      }}
                      value={x.featureDesc}
                      inputProps={{
                        'aria-label': 'primary checkbox'
                      }}
                    />
                  }
                  key={x.featureUuid}
                  label={x.featureDesc}
                  labelPlacement="end"
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="textSecondary" variant="h6" component="span">
              {I18n.t('uvms.requestAccess.createDialog.requestArea')}
            </Typography>
            <FormControlLabel
              style={{ marginLeft: '20px' }}
              control={
                <MainSwitch
                  checked={mapOpen}
                  onChange={() => {
                    this.setState({ mapOpen: !mapOpen });
                  }}
                  value="checkedA"
                />
              }
            />
          </div>

          <div>
            <Collapse in={mapOpen}>
              <Paper elevation={4} className={classes.paper}>
                <div style={{ height: '100%' }}>
                  <MapSketch
                    channelData={channelData}
                    getMapInformation={e => {
                      console.log(e);
                    }}
                  />
                </div>
              </Paper>
            </Collapse>
          </div>
          <div style={{ marginTop: 10, marginBottom: 5 }}>
            <Typography color="textSecondary" variant="h6" component="span">
              {I18n.t('uvms.requestAccess.createDialog.reuqestForm')}
            </Typography>
            <Typography color="error" variant="caption" component="div">
              {requestGroupError ? VALIDMSG_NOTNULL : ''}
            </Typography>
          </div>
          {/* <div className={classes.tipsStyle}>{requestGroupError ? VALIDMSG_NOTNULL : ''}</div> */}

          <TabRow>
            <TabCell>{}</TabCell>
            <TabCell title={I18n.t('uvms.requestAccess.createDialog.groupName')}>
              {I18n.t('uvms.requestAccess.createDialog.groupName')}
            </TabCell>
            <TabCell title={I18n.t('uvms.requestAccess.createDialog.description')}>
              {I18n.t('uvms.requestAccess.createDialog.description')}
            </TabCell>
          </TabRow>
          {!isSearch || (isSearch && searchInputBlank) ? (
            <TableRoot
              groupList={groupData}
              handleGroupSelected={this.handleGroupSelected}
              isSelectedGroup={this.isSelectedGroup}
              checkedId={checkedId}
              handleGroupModuleSelected={this.handleGroupModuleSelected}
              classes={classes}
              isVisibility={isVisibility}
            />
          ) : (
            <SearchTable
              item={groupData}
              handleGroupSelected={this.handleGroupSelected}
              isSelectedGroup={this.isSelectedGroup}
              checkedId={checkedId}
              handleGroupModuleSelected={this.handleGroupModuleSelected}
              classes={classes}
              isVisibility={isVisibility}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.save} color="primary">
            {I18n.t('uvms.requestAccess.button.save')}
          </Button>
          <Button onClick={closeDialog} color="primary" autoFocus>
            {I18n.t('uvms.requestAccess.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles)(AddDialog);
function SearchTable({
  item,
  classes,
  handleGroupSelected,
  handleGroupModuleSelected,
  isSelectedGroup,
  checkedId,
  isVisibility
}) {
  return (
    <div>
      {item.map(temp => (
        <SearchTableItem
          key={temp.groupId}
          item={temp}
          handleGroupSelected={handleGroupSelected}
          isSelectedGroup={isSelectedGroup}
          checkedId={checkedId}
          handleGroupModuleSelected={handleGroupModuleSelected}
          classes={classes}
          isVisibility={isVisibility}
        />
      ))}
    </div>
  );
}
class TableRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: ''
    };
  }

  handleExpansionPanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { expanded } = this.state;
    const {
      groupList,
      classes,
      handleGroupSelected,
      handleGroupModuleSelected,
      isSelectedGroup,
      checkedId,
      index,
      showDeatil,
      operationType,
      isVisibility
    } = this.props;
    return (
      <div>
        {groupList.map(item => {
          const hasSelected = isSelectedGroup(item.groupId);
          if (item.children && item.children.length > 0) {
            return (
              <ExpansionPanel
                key={item.groupId}
                classes={{
                  root: classNames({
                    [classes.panelRootSeleted]: expanded === item.groupId,
                    [classes.panelRoot]: !(expanded === item.groupId)
                  }),
                  expanded: classes.expansionPanelExpanded
                }}
                expanded={expanded === item.groupId}
                onChange={this.handleExpansionPanelChange(item.groupId)}
                style={{
                  background:
                    expanded === item.groupId
                      ? `rgba(33,150,243,.${Number(item.levelId + 1)})`
                      : 'rgba(0,0,0,0)'
                }}
              >
                <ExpansionPanelSummary
                  classes={{
                    root: classes.summaryRoot,
                    expanded: classes.summaryExpanded
                  }}
                  expandIcon={
                    <ExpandMore
                      className={classNames({
                        [classes.expandIcon]: expanded === item.groupId
                      })}
                    />
                  }
                >
                  <Tab>
                    <TabRow>
                      <TabCell className={classes.Radio}>
                        <Radio
                          disabled={!item.canApproval}
                          color="primary"
                          checked={hasSelected}
                          onClick={event => handleGroupModuleSelected(event)}
                          value={item.groupId}
                          style={{ paddingLeft: 70 * item.levelId }}
                          inputProps={{ name: item.groupName }}
                        />
                      </TabCell>
                      <TabCell title={item.groupName}>{item.groupName}</TabCell>
                      <TabCell title={item.groupDescription}>{item.groupDescription}</TabCell>
                    </TabRow>
                  </Tab>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails key={item.groupId} classes={{ root: classes.detailRoot }}>
                  <TableRoot
                    groupList={item.children}
                    classes={classes}
                    handleGroupSelected={handleGroupSelected}
                    isSelectedGroup={isSelectedGroup}
                    checkedId={checkedId}
                    handleGroupModuleSelected={handleGroupModuleSelected}
                    index={index}
                    showDeatil={showDeatil}
                    operationType={operationType}
                    isVisibility={isVisibility}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          } else {
            return (
              <TabRow key={item.groupId} className={classes.tabRowSize}>
                <TabCell className={classes.Radio}>
                  <Radio
                    color="primary"
                    checked={hasSelected}
                    onClick={event => handleGroupSelected(event)}
                    value={item.groupId}
                    disabled={!item.canApproval}
                    style={{ paddingLeft: 70 * item.levelId }}
                    id="radio"
                    inputProps={{ name: item.groupName }}
                  />
                </TabCell>
                <TabCell title={item.groupName}>{item.groupName}</TabCell>
                <TabCell title={item.groupDescription}>{item.groupDescription}</TabCell>
              </TabRow>
            );
          }
        })}
      </div>
    );
  }
}

class SearchTableItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    };
  }

  handleExpansionPanelChange = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  };

  render() {
    const { expanded } = this.state;
    const {
      item,
      classes,
      handleGroupSelected,
      handleGroupModuleSelected,
      isSelectedGroup,
      checkedId,
      index,
      showDeatil,
      isVisibility
    } = this.props;
    const hasSelected = isSelectedGroup(item.groupId);
    const isOpen = isVisibility[item.fullPath];
    return (
      <div
        className={classNames({ [classes.expansionPanelExpanded]: expanded })}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {item.children && item.children.length > 0 ? (
          <ExpansionPanel
            key={item.groupId}
            classes={{
              root: classNames({
                [classes.panelRootSeleted]: expanded,
                [classes.panelRoot]: !expanded
              })
            }}
            expanded={expanded}
            onChange={this.handleExpansionPanelChange}
            style={{
              background: expanded
                ? `rgba(33,150,243,.${Number(item.levelId + 1)})`
                : 'rgba(0,0,0,0)'
            }}
          >
            <ExpansionPanelSummary
              classes={{
                root: classes.summaryRoot,
                expanded: classes.summaryExpanded
              }}
              expandIcon={<ExpandMore className={classNames({ [classes.expandIcon]: expanded })} />}
            >
              <Tab>
                <TabRow>
                  <TabCell className={classes.Radio}>
                    <Radio
                      color="primary"
                      checked={hasSelected}
                      onClick={event => handleGroupModuleSelected(event)}
                      value={item.groupId}
                      disabled={!item.canApproval}
                      style={{ paddingLeft: 20 * item.levelId }}
                    />
                  </TabCell>
                  <TabCell title={item.groupName}>{item.groupName}</TabCell>
                  <TabCell title={item.groupDescription}>{item.groupDescription}</TabCell>
                </TabRow>
              </Tab>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails key={item.groupId} classes={{ root: classes.detailRoot }}>
              <SearchTable
                item={item.children}
                classes={classes}
                handleGroupSelected={handleGroupSelected}
                isSelectedGroup={isSelectedGroup}
                checkedId={checkedId}
                handleGroupModuleSelected={handleGroupModuleSelected}
                index={index}
                showDeatil={showDeatil}
                isVisibility={isVisibility}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ) : (
          <TabRow key={item.groupId} className={classes.tabRowSize}>
            <TabCell className={classes.Radio}>
              <Radio
                color="primary"
                checked={hasSelected}
                onClick={event => handleGroupSelected(event)}
                value={item.groupId}
                disabled={!item.canApproval}
                style={{ paddingLeft: 20 * item.levelId }}
              />
            </TabCell>
            <TabCell title={item.groupName}>{item.groupName}</TabCell>
            <TabCell title={item.groupDescription}>{item.groupDescription}</TabCell>
          </TabRow>
        )}
      </div>
    );
  }
}
