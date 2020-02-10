import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import AddBox from '@material-ui/icons/AddBox';
import IndeterminateCheckBox from '@material-ui/icons/IndeterminateCheckBox';
import { withStyles } from '@material-ui/core/styles';
import msg from 'utils/messageCenter';
import { VALIDMSG_NOTNULL } from 'commons/constants/commonConstant';
import { Permission, DialogTitle } from 'components/common';
import materialKeys from 'utils/materialKeys';
import C from 'classnames';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import TimeInput from './timeInput';
import { objIndexOf } from './utils';
import style from './VMSChannel.module.less';

const styles = () => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    float: 'left'
  },
  textField: {
    width: 200
  },
  eleFloat: {
    float: 'left'
  },
  nameLable: {
    width: '80px !important',
    float: 'left',
    margin: 0
  },
  nameIpt: {
    float: 'left',
    borderRadius: 5,
    border: 'none',
    margin: '4px 0',
    width: 250,
    height: 34,
    padding: 4
  }
});
class DayItem extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newsList: []
    };
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.period) {
      const { onChangeTime, onBlurTime } = this.props;
      const periodIptArr = nextprops.period.map((item, index) => {
        const key = `hello${index}`;
        return (
          <TimeInput
            key={key}
            onChangeTime={onChangeTime}
            period={item}
            index={index}
            errIndexList={nextprops.errIndexList}
            onBlurTime={onBlurTime}
            date={nextprops.idCon}
          />
        );
      });
      this.setState({ newsList: periodIptArr });
    }
  }

  componentDidMount() {
    const { onChangeTime, onBlurTime, errIndexList, idCon, period } = this.props;
    if (period && period.length > 0) {
      const periodIptArr = period.map((item, index) => {
        const key = `hello${index}`;
        return (
          <TimeInput
            key={key}
            onChangeTime={onChangeTime}
            period={item}
            index={index}
            errIndexList={errIndexList}
            onBlurTime={onBlurTime}
            date={idCon}
          />
        );
      });
      this.setState({ newsList: periodIptArr });
    }
  }

  handleAddPeriodItem = () => {
    const { handleAddPeriodItem, onChangeTime, onBlurTime, errIndexList, idCon } = this.props;
    handleAddPeriodItem();
    this.setState(state => ({
      newsList: state.newsList.concat(
        <TimeInput
          onChangeTime={onChangeTime}
          onBlurTime={onBlurTime}
          key={state.newsList.length}
          errIndexList={errIndexList}
          index={state.newsList.length}
          date={idCon}
        />
      )
    }));
  };

  handleDelPeriodItem = () => {
    const { newsList } = this.state;
    const { handleDelPeriodItem, delOne } = this.props;
    if (newsList.length <= 1) {
      return;
    }
    handleDelPeriodItem();
    newsList.splice(-1, 1);
    this.setState(
      {
        newsList
      },
      () => {
        delOne(newsList.length);
      }
    );
  };

  render() {
    const { idCon } = this.props;
    const { newsList } = this.state;
    return (
      <div className={style.dayItemCon}>
        <Typography
          color="textPrimary"
          variant="subtitle2"
          component="span"
          style={{ float: 'left', width: 100, padding: '8px 0', margin: 0, marginRight: 10 }}
        >
          {idCon}
        </Typography>

        <div
          id={idCon}
          style={{
            display: 'grid',
            float: 'left'
          }}
          className={style.periodItemCon}
        >
          {newsList}
        </div>
        <AddBox onClick={this.handleAddPeriodItem} style={{ marginLeft: 10, float: 'left' }} />
        <IndeterminateCheckBox
          onClick={this.handleDelPeriodItem}
          style={{ marginLeft: 10, float: 'left' }}
        />
      </div>
    );
  }
}
class StorageDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      scheduleItem: {
        name: '',
        weekPeriod: {
          Sunday: [{ start: '', end: '' }],
          Monday: [{ start: '', end: '' }],
          Tuesday: [{ start: '', end: '' }],
          Wednesday: [{ start: '', end: '' }],
          Thursday: [{ start: '', end: '' }],
          Friday: [{ start: '', end: '' }],
          Saturday: [{ start: '', end: '' }]
        }
      },
      errIndexList: []
    };
  }

  componentWillReceiveProps(nextprops) {
    const { scheduleItemData } = this.props;
    if (nextprops.scheduleItemData && nextprops.scheduleItemData !== scheduleItemData) {
      this.handleSetSchedule(nextprops.scheduleItemData);
    }
  }

  componentDidMount() {
    const { scheduleItemData } = this.props;
    this.handleSetSchedule(scheduleItemData);
  }

  handleSetSchedule = scheduleItemData => {
    if (scheduleItemData) {
      const schedule = Object.assign({}, scheduleItemData);
      const weekPeriodStr = schedule.weekPeriod;
      let weekPeriod = {};
      if (weekPeriodStr && schedule !== {}) {
        try {
          weekPeriod = JSON.parse(weekPeriodStr);
        } catch (e) {
          weekPeriod = weekPeriodStr;
        }
        schedule.weekPeriod = weekPeriod;
      } else {
        schedule.weekPeriod = {
          Sunday: [{ start: '', end: '' }],
          Monday: [{ start: '', end: '' }],
          Tuesday: [{ start: '', end: '' }],
          Wednesday: [{ start: '', end: '' }],
          Thursday: [{ start: '', end: '' }],
          Friday: [{ start: '', end: '' }],
          Saturday: [{ start: '', end: '' }]
        };
      }
      this.setState({ scheduleItem: schedule });
    }
  };
  handleAddPeriodItem = date => {
    const { scheduleItem } = this.state;
    scheduleItem.weekPeriod[date].push({ start: '', end: '' });
    this.setState({ scheduleItem });
  };

  handleDelPeriodItem = date => {
    try {
      const { scheduleItem } = this.state;
      scheduleItem.weekPeriod[date].splice(-1, 1);
      this.setState({ scheduleItem });
    } catch (e) {
      throw new Error('ERR del json', e);
    }
  };

  onChangeName = e => {
    const val = e.target.value;
    const { scheduleItem } = this.state;
    if (val.length > 20) {
      return;
    }
    scheduleItem.name = val;
    this.setState({
      scheduleItem
    });
  };

  onChangeTime = (date, index, type, val) => {
    try {
      if (!type) return;
      const { scheduleItem } = this.state;
      scheduleItem.weekPeriod[date][index][type] = val;
      this.setState({
        scheduleItem
      });
    } catch (e) {
      throw new Error('ERR change time period.', e);
    }
  };

  onBlurTime = (date, index) => {
    try {
      const { scheduleItem, errIndexList } = this.state;
      // start or end can not be empty
      const startTime = scheduleItem.weekPeriod[date][index].start;
      const endTime = scheduleItem.weekPeriod[date][index].end;
      const startIndex = objIndexOf(errIndexList, {
        date,
        index,
        type: 'start'
      });
      const endIndex = objIndexOf(errIndexList, {
        date,
        index,
        type: 'end'
      });
      // if start time is empty
      if (!startTime) {
        // if this one not exist in cur errorList
        if (startIndex < 0 && endTime) {
          errIndexList.push({ date, index, type: 'start' });
        }
      } else if (startIndex >= 0) {
        errIndexList.splice(startIndex, 1);
      }

      // if end time is empty
      if (!endTime) {
        if (endIndex < 0 && startTime) {
          errIndexList.push({ date, index, type: 'end' });
        }
      } else if (endIndex >= 0) {
        errIndexList.splice(endIndex, 1);
      }

      // if start and end time both are empty,don't show err
      if (!endTime && !startTime) {
        if (startIndex >= 0) {
          errIndexList.splice(startIndex, 1);
        }
        if (endIndex >= 0) {
          errIndexList.splice(endIndex, 1);
        }
        // console.log('both empty:', startIndex, endIndex, errIndexList);
      }

      // To verify cur time can't before last one
      let flagPopErr = false;
      if (scheduleItem.weekPeriod[date].length > 1) {
        for (const k in scheduleItem.weekPeriod[date]) {
          const curStart = new Date(
            `2000-01-01  ${scheduleItem.weekPeriod[date][k].start}`
          ).getTime();
          const curEnd = new Date(`2000-01-01  ${scheduleItem.weekPeriod[date][k].end}`).getTime();
          if (k > 0) {
            const lastStart = new Date(
              `2000-01-01  ${scheduleItem.weekPeriod[date][k - 1].start}`
            ).getTime();
            const lastEnd = new Date(
              `2000-01-01  ${scheduleItem.weekPeriod[date][k - 1].end}`
            ).getTime();
            if (lastStart && lastEnd && curStart && curEnd) {
              // console.log(lastStart, lastEnd, curStart, curEnd);
              const targetStartIndex = objIndexOf(errIndexList, {
                date,
                index: parseInt(k, 0),
                type: 'start'
              });
              const targetEndIndex = objIndexOf(errIndexList, {
                date,
                index: parseInt(k, 0),
                type: 'end'
              });
              if (curStart <= lastEnd || curStart <= lastStart) {
                if (targetStartIndex < 0) {
                  errIndexList.push({
                    date,
                    index: parseInt(k, 0),
                    type: 'start'
                  });
                }
                if (targetEndIndex < 0) {
                  errIndexList.push({
                    date,
                    index: parseInt(k, 0),
                    type: 'end'
                  });
                }
                flagPopErr = true;
              } else {
                if (targetStartIndex > -1) {
                  errIndexList.splice(targetStartIndex, 1);
                }
                if (targetEndIndex > -1) {
                  errIndexList.splice(targetEndIndex, 1);
                }
              }
            }
          }
        }
      }
      this.setState({ errIndexList });
      if (flagPopErr) msg.info('Can not set the storage plan to overlap', '');
    } catch (e) {
      // eslint-disable-next-line
      console.info(e);
    }
  };

  delOnePeriod = len => {
    const { errIndexList } = this.state;
    let i = 0;
    const newArr = [];
    for (const k in errIndexList) {
      i++;
      if (i < len) {
        newArr.push(errIndexList[k]);
      }
    }
    this.setState({ errIndexList: newArr });
  };

  handleSubmit = () => {
    const { scheduleItem, errIndexList } = this.state;
    const { handleSubmit } = this.props;
    // NOT NULL VALIDATION
    if (scheduleItem.weekPeriod) {
      let flag = false;
      for (const key in scheduleItem.weekPeriod) {
        for (const i in scheduleItem.weekPeriod[key][0]) {
          if (scheduleItem.weekPeriod[key][0][i] !== '') {
            flag = true;
          }
        }
      }
      if (!flag) {
        msg.warn('Can not set the storage plan to null', '');
        return;
      }
    }
    const schedule = {
      scheduleId: scheduleItem.scheduleId || '',
      name: scheduleItem.name || '',
      weekPeriod: scheduleItem.weekPeriod || ''
    };

    if (!schedule.name || schedule.name.trim() === '') {
      msg.info(`Name is the ${VALIDMSG_NOTNULL}`, '');
    } else if (errIndexList.length > 0) {
      msg.info('Please check error data', '');
    } else {
      handleSubmit(schedule);
    }
  };

  cancel = () => {
    const { closeDialog } = this.props;
    closeDialog();
    this.clean();
  };

  clean = () => {
    this.setState({
      scheduleItem: {
        weekPeriod: {
          Sunday: [{ start: '', end: '' }],
          Monday: [{ start: '', end: '' }],
          Tuesday: [{ start: '', end: '' }],
          Wednesday: [{ start: '', end: '' }],
          Thursday: [{ start: '', end: '' }],
          Friday: [{ start: '', end: '' }],
          Saturday: [{ start: '', end: '' }]
        }
      },
      errIndexList: []
    });
  };

  render() {
    const { openDialog, operationType, openDelConfirm, classes } = this.props;
    const { scheduleItem, errIndexList } = this.state;
    return (
      <Dialog fullWidth maxWidth="xs" open={openDialog}>
        <DialogTitle>
          {operationType === 'create'
            ? I18n.t('uvms.channel.addStoragePlan')
            : I18n.t('uvms.channel.updateSchedule')}
        </DialogTitle>
        <DialogContent
          style={{
            minHeight: 150
          }}
        >
          <div>
            <div style={{ overflow: 'hidden' }}>
              <div className={C(style.fltDroplist, style.shortFltDroplist)}>
                <Typography
                  color="textSecondary"
                  variant="subtitle1"
                  component="span"
                  className={classes.nameLable}
                >
                  {`${I18n.t('uvms.channel.name')} :`}
                </Typography>
                <input
                  style={{ backgroundColor: '#2c3a5a' }}
                  className={classes.nameIpt}
                  value={scheduleItem.name ? scheduleItem.name : ''}
                  onChange={this.onChangeName}
                />
              </div>
            </div>
            <div>
              <Typography color="textSecondary" variant="subtitle1" component="div">
                {I18n.t('uvms.channel.periodSelection')}
              </Typography>
              {[
                I18n.t('uvms.channel.sunday'),
                I18n.t('uvms.channel.monday'),
                I18n.t('uvms.channel.tuesday'),
                I18n.t('uvms.channel.wednesday'),
                I18n.t('uvms.channel.thursday'),
                I18n.t('uvms.channel.friday'),
                I18n.t('uvms.channel.saturday')
              ].map(item => {
                return (
                  <DayItem
                    key={item}
                    idCon={item}
                    onChangeTime={(index, prop, e) => this.onChangeTime(item, index, prop, e)}
                    onBlurTime={(index, prop, e) => this.onBlurTime(item, index, prop, e)}
                    handleAddPeriodItem={() => this.handleAddPeriodItem(item)}
                    handleDelPeriodItem={() => this.handleDelPeriodItem(item)}
                    period={
                      scheduleItem.weekPeriod && scheduleItem.weekPeriod[item]
                        ? scheduleItem.weekPeriod[item]
                        : []
                    }
                    errIndexList={errIndexList}
                    delOne={this.delOnePeriod}
                  />
                );
              })}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Permission materialKey={materialKeys['M5-3']}>
            <Button
              disabled={scheduleItem.scheduleReadOnly && scheduleItem.scheduleReadOnly}
              onClick={() => openDelConfirm('deleteSchedule', scheduleItem.scheduleId)}
              color="secondary"
              style={{ display: operationType === 'create' ? 'none' : 'flex' }}
            >
              {I18n.t('global.button.delete')}
            </Button>
          </Permission>
          <Permission
            materialKey={operationType === 'create' ? materialKeys['M4-117'] : materialKeys['M5-2']}
          >
            <Button
              onClick={this.handleSubmit}
              color="primary"
              disabled={scheduleItem.scheduleReadOnly && scheduleItem.scheduleReadOnly}
            >
              {I18n.t('global.button.save')}
            </Button>
          </Permission>
          <Button onClick={this.cancel} color="primary" autoFocus>
            {I18n.t('global.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles)(StorageDialog);
