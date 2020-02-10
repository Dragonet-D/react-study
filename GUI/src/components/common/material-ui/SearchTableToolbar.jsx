/**
 * @description support full field search toolbar
 * @author Lizzie 17-5-2019
 * @params  checkedIds:[optional]
 *handleGetDataByPage({searchMapObj})
 *fieldList : search field name show in dropdown{showTxt, fieldTxt, type(iptType or dropdownType)}
 *dataList: data of item of fieldList which type is dropdownType
 { data : showTxt ,type : (normal[default]/keyVal[id:'',val:''])}

 * @demo   <TableToolbar
 checkedIds={['344c43c23','34vy6h7']}
 handleGetDataByPage={(obj)=>{this.props.search(obj)}}
 fieldList={[["ProgramName", 'fileName', 'iptType'], ["Entry", 'entry', 'dropdownType'], ["Type", 'type', 'dropdownType']]}
 dataList={{
              'Entry': { data: [{uuid:'332r34',name:'test1'},{uuid:'d66763b',name:'test2'}], type: 'keyVal',id:'uuid',val:'name'  },
              'Type': { data: ['demo1','demo2'], type: 'normal'  }
            }}
 >
 * */
import React from 'react';
import PropTypes from 'prop-types';
import { AddCircleOutline } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';
import { DatePicker } from 'components/common';
import { getStartTime, getEndTime } from 'utils/dateHelper';
import { DATE_FORMAT_DATE_PICKER } from 'commons/constants/const';
import moment from 'moment';
import _ from 'lodash';
import TextField from './TextField';
import Chip from './Chip';
import ToolTip from './ToolTip';

const styles = theme => {
  return {
    tool_bar: {
      padding: 0,
      height: theme.spacing(7),
      minHeight: theme.spacing(7)
    },
    wrapper: {
      position: 'relative'
    },
    mask: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 2,
      left: 0,
      top: 0,
      background: 'transparent',
      cursor: 'not-allowed'
    },
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      // width: 420,
      float: 'left'
    },
    input: {
      marginLeft: 8,
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4
    },
    toolbarBG: {},
    toolbarLeft: {
      padding: 0
    },
    toolbarTitle: {
      fontSize: '16px'
    },
    textField: {
      width: 275,
      marginBottom: 8,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    chip: {
      height: 28,
      '&>div': {
        width: 24,
        height: 24,
        fontSize: 12
      }
    },
    normalChip: {
      color: theme.palette.text.secondary
    },
    fadeChip: {},
    select_content: {
      maxWidth: '200px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: 'block'
    },
    droplist_wrapper: {
      height: '250px',
      overflowY: 'scroll'
    }
  };
};

class TableToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchMapArr: [],
      open: false,
      currentType: '',
      iptVal: '',
      showType: 'iptType',
      fieldTxt: '',
      startTime: moment(getStartTime()),
      endTime: moment(getEndTime())
    };
    this.searchMapObj = {};
    this.searchMapObjLast = {};
  }

  // onChange of input
  handleSearchChange = event => {
    const { showType } = this.state;
    const regEn = /[`~!$%^&*()-+<>?{},;[\]]/im;
    const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (
      showType === 'iptType' &&
      (regEn.test(event.target.value) || regCn.test(event.target.value))
    ) {
      return;
    }
    this.setState({ iptVal: event.target.value });
  };

  handleRangeChange = props => val => {
    this.setState({ [props]: val });
  };

  // open search fields list
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  // close search fields list
  handleClose = (showTxt, fieldTxt, showType, event) => {
    if (event && this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
    if (showTxt) {
      this.setState({ currentType: showTxt, fieldTxt, iptVal: '', showType });
    }
  };

  addLable = () => {
    const { dataList, undeletableRange } = this.props;
    const { currentType, iptVal, fieldTxt, startTime, endTime } = this.state;
    const { searchMapArr } = this.state;
    // if is time range
    if (currentType === 'Range') {
      if (!startTime._isValid || !endTime._isValid) return;
      const temp = [];
      for (const k in searchMapArr) {
        if (searchMapArr[k].type !== 'From' && searchMapArr[k].type !== 'To') {
          temp.push(searchMapArr[k]);
        }
      }
      temp.push({
        val: moment(startTime).format(DATE_FORMAT_DATE_PICKER),
        type: 'From',
        fieldTxt: 'startTime',
        isAftSearch: false,
        undeletableRange
      });
      temp.push({
        val: moment(endTime).format(DATE_FORMAT_DATE_PICKER),
        type: 'To',
        fieldTxt: 'endTime',
        isAftSearch: false,
        undeletableRange
      });

      this.setState({ searchMapArr: temp, iptVal: '' });
      this.searchMapObj.startTime = startTime;
      this.searchMapObj.endTime = endTime;
    } else if (iptVal && currentType) {
      // if update, need to remove it firstly
      for (const k in searchMapArr) {
        if (searchMapArr[k].type === currentType) {
          searchMapArr.splice(k, 1);
        }
      }
      // if it's key-val dropdown list, show name on page but send id to backend.
      let valueOfKey = '';
      if (
        dataList[currentType] &&
        dataList[currentType].type &&
        dataList[currentType].type === 'keyVal'
      ) {
        const { id } = dataList[currentType];
        const { val } = dataList[currentType];
        valueOfKey = dataList[currentType].data.filter(item => item[id] === iptVal)[0][val];
      } else {
        valueOfKey = iptVal;
      }
      let type = '';
      // if currentType include '_',change to ' '
      if (currentType.indexOf('_') >= 0) {
        type = currentType.replace(/_/g, ' ');
      } else {
        type = currentType;
      }
      // searchMapArr : the data show on page
      searchMapArr.push({
        val: valueOfKey,
        type,
        fieldTxt,
        isAftSearch: false
      });
      // this.searchMapObj : the data send to backend
      this.searchMapObj[fieldTxt] = iptVal;
      this.setState({ searchMapArr, iptVal: '' });
    }
  };

  delLable = item => {
    if (item.type === 'Range') {
      this.searchMapObj.startTime = '';
      this.searchMapObj.endTime = '';
    } else {
      this.searchMapObj[item.fieldTxt] = '';
    }
    // remove item which val is '' in json
    const obj = {};
    for (const key in this.searchMapObj) {
      if (this.searchMapObj[key] !== '') {
        obj[key] = this.searchMapObj[key];
      }
    }
    this.searchMapObj = obj;
    this.setState(
      state => {
        const searchMapArr = [...state.searchMapArr];
        const chipToDelete = searchMapArr.indexOf(item);
        searchMapArr.splice(chipToDelete, 1);
        return { searchMapArr };
      },
      () => {
        this.onSearch();
      }
    );
  };

  format = string => {
    let keyHead = '';
    if (string.indexOf('_') >= 0) {
      keyHead = string.replace(/_/g, ' ');
      return keyHead.toString();
    } else {
      const charArray = string.split('');
      for (let i = 0; i < charArray.length; i++) {
        if (charArray[i] >= 'A' && charArray[i] <= 'Z') {
          if (charArray[i - 1] === 'I' && charArray[i] === 'D') {
            keyHead += charArray[i];
          } else {
            keyHead += ` ${charArray[i]}`;
          }
        } else {
          keyHead += charArray[i];
        }
      }
      return keyHead.toString().replace(',', '');
    }
  };

  onSearch = () => {
    const { handleGetDataByPage } = this.props;
    const { searchMapArr } = this.state;
    for (const k in searchMapArr) {
      searchMapArr[k].isAftSearch = true;
    }
    this.setState({ iptVal: '', searchMapArr });
    if (!_.isEqual(this.searchMapObj, this.searchMapObjLast)) {
      this.searchMapObjLast = Object.assign({}, this.searchMapObj);
      handleGetDataByPage(this.searchMapObj);
    }
  };

  clean() {
    this.setState({
      searchMapArr: []
    });
    this.searchMapObj = {};
    this.searchMapObjLast = {};
  }

  componentDidMount() {
    const { fieldList, getChild, getToolBarRef, undeletableRange } = this.props;
    if (getToolBarRef) {
      getToolBarRef(this);
    }
    if (getChild) {
      getChild(this);
    }
    if (fieldList && fieldList.length > 0) {
      this.setState({
        currentType: fieldList[0][0],
        fieldTxt: fieldList[0][1]
      });
      for (const i in fieldList) {
        if (fieldList[i][0] === 'Range') {
          const { startTime, endTime } = this.state;
          const { searchMapArr } = this.state;

          searchMapArr.push({
            val: moment(startTime).format(DATE_FORMAT_DATE_PICKER),
            type: 'From',
            fieldTxt: 'startTime',
            isAftSearch: false,
            undeletableRange
          });
          searchMapArr.push({
            val: moment(endTime).format(DATE_FORMAT_DATE_PICKER),
            type: 'To',
            fieldTxt: 'endTime',
            isAftSearch: false,
            undeletableRange
          });
          this.setState({ searchMapArr, iptVal: '' });
          this.searchMapObj.startTime = startTime;
          this.searchMapObj.endTime = endTime;
          this.onSearch();
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clean !== undefined && nextProps.clean) {
      this.clean();
      nextProps.searchClearClean();
    }
  }

  render() {
    const {
      dataList,
      fieldList,
      classes,
      disabled,
      checkedIds = [],
      children,
      isSearchButtonNeed
    } = this.props;
    const { searchMapArr, currentType, showType, open, iptVal, startTime, endTime } = this.state;
    const isFieldList = fieldList && fieldList.length;
    let CurComponent = '';
    if (showType === 'iptType') {
      CurComponent = (
        <InputBase
          className={classes.input}
          placeholder={this.format(currentType)}
          value={iptVal}
          onChange={this.handleSearchChange}
        />
      );
    }
    if (showType === 'dropdownType') {
      CurComponent = (
        <TextField
          select
          className={classes.textField}
          value={iptVal}
          onChange={this.handleSearchChange}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{`${this.format(currentType)}`}</InputAdornment>
            )
          }}
        >
          {dataList[currentType] &&
          dataList[currentType].type &&
          dataList[currentType].type === 'keyVal'
            ? dataList[currentType].data &&
              dataList[currentType].data.map(option => {
                const { id } = dataList[currentType];
                const { val } = dataList[currentType];
                return (
                  <MenuItem key={option[id]} value={option[id]}>
                    {option[val]}
                  </MenuItem>
                );
              })
            : dataList[currentType] &&
              dataList[currentType].data &&
              dataList[currentType].data.map(option => (
                // eslint-disable-next-line react/no-array-index-key
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
        </TextField>
      );
    }
    if (showType === 'rangeType') {
      CurComponent = (
        <React.Fragment>
          <DatePicker
            format={DATE_FORMAT_DATE_PICKER}
            maxDate={endTime}
            value={startTime}
            // onAccept={handleDateSubmit('startTime')}
            handleChange={this.handleRangeChange('startTime')}
          />
          <DatePicker
            format={DATE_FORMAT_DATE_PICKER}
            minDate={startTime}
            value={endTime}
            // onAccept={handleDateSubmit('endTime')}
            handleChange={this.handleRangeChange('endTime')}
          />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Toolbar
          className={classNames({ [classes.toolbarBG]: checkedIds.length > 0 }, classes.tool_bar)}
        >
          <div
            className={classNames(
              classes.toolbarLeft,
              {
                [classes.toolbarTitle]: checkedIds.length > 0
              },
              classes.wrapper
            )}
          >
            {disabled && <div className={classes.mask} />}
            {checkedIds.length > 0 ? (
              `${checkedIds.length} selected`
            ) : (
              <div>
                <Paper
                  className={classes.root}
                  elevation={1}
                  style={{ width: showType === 'rangeType' ? 520 : 420 }}
                >
                  <IconButton
                    className={classes.iconButton}
                    aria-label="Menu"
                    buttonRef={node => {
                      this.anchorEl = node;
                    }}
                    aria-owns={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleToggle}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Popper
                    open={open}
                    anchorEl={this.anchorEl}
                    transition
                    disablePortal
                    style={{ zIndex: 999 }}
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{
                          transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={e => this.handleClose('', e)}>
                            <MenuList>
                              {isFieldList &&
                                fieldList.map(item => {
                                  return (
                                    <MenuItem
                                      key={item[0]}
                                      onClick={e => this.handleClose(item[0], item[1], item[2], e)}
                                      value={item[0]}
                                    >
                                      {this.format(item[0])}
                                    </MenuItem>
                                  );
                                })}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                  {CurComponent}
                  <IconButton
                    className={classes.iconButton}
                    aria-label="Add"
                    onClick={this.addLable}
                  >
                    <AddCircleOutline />
                  </IconButton>
                  {isSearchButtonNeed && (
                    <>
                      <Divider className={classes.divider} />
                      <IconButton
                        className={classes.iconButton}
                        aria-label="Directions"
                        onClick={this.onSearch}
                      >
                        <SearchIcon />
                      </IconButton>
                    </>
                  )}
                </Paper>
                {children && children[1] ? children[1] : ''}
              </div>
            )}
          </div>
          {children && children[0] ? children[0] : children}
        </Toolbar>

        <div style={{ width: '100%' }}>
          {searchMapArr &&
            searchMapArr.map(item => (
              <Chip
                key={item.type}
                label={
                  <ToolTip title={`${item.type}: ${item.val}`}>
                    <span className={classes.select_content}>{`${item.type}: ${item.val}`}</span>
                  </ToolTip>
                }
                className={classNames(
                  { [classes.normalChip]: item.isAftSearch },
                  { [classes.fadeChip]: !item.isAftSearch },
                  classes.chip
                )}
                onDelete={() => {
                  if (!item.undeletableRange) this.delLable(item);
                }}
                undeletable={item.undeletableRange && item.undeletableRange.toString()}
              />
            ))}
        </div>
      </React.Fragment>
    );
  }
}

TableToolbar.defaultProps = {
  disabled: false,
  classes: {},
  dataList: {},
  isSearchButtonNeed: true
};

TableToolbar.propTypes = {
  handleGetDataByPage: PropTypes.func.isRequired,
  fieldList: PropTypes.array.isRequired,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  dataList: PropTypes.object,
  isSearchButtonNeed: PropTypes.bool
};

export default withStyles(styles)(TableToolbar);
