import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import msg from 'utils/messageCenter';
import { TextField } from 'components/common';
import { objIndexOf } from './utils';

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
    float: 'left',
    padding: '8px 0px !important'
  }
});
class TimeInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      start: '',
      end: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const dateBegin = nextProps.period.start;
    const dateEnd = nextProps.period.end; // del while no date
    this.setState({
      start: dateBegin,
      end: dateEnd
    });
  }

  onFocus = () => {
    const { start, end } = this.state;
    const { index } = this.props;
    if (start !== '' || end !== '') {
      return;
    }
    this.setState(
      {
        start: '00:00',
        end: '23:59'
      },
      () => {
        this.onChangeTime('valType', index, 'start', '00:00');
        this.onChangeTime('valType', index, 'end', '23:59');
      }
    );
  };

  onBlurInput = (index, type) => {
    const { start, end } = this.state;
    const { onBlurTime } = this.props;
    const dateBegin = new Date(`1997-01-01 ${start}`);
    const dateEnd = new Date(`1997-01-01 ${end}`);
    const dateDiff = dateEnd.getTime() - dateBegin.getTime();
    if (dateDiff < 0) {
      msg.info('endTime should be later than startTime', '');
    }
    onBlurTime(index, type);
  };

  onChangeTime = (type, index, prop, val) => {
    const { onChangeTime } = this.props;
    if (type === 'valType') {
      onChangeTime(index, prop, val);
    } else {
      onChangeTime(index, prop, val.target.value);
    }
  };

  componentDidMount() {
    const { period } = this.props;
    const dateBegin = period.start;
    const dateEnd = period.end;
    this.setState({
      start: dateBegin,
      end: dateEnd
    });
  }

  render() {
    const { classes, index, date, errIndexList } = this.props;
    const { start, end } = this.state;
    return (
      <div style={{ float: 'left', marginBottom: 8 }}>
        <form className={classes.container} noValidate>
          <TextField
            type="time"
            error={objIndexOf(errIndexList, { date, index, type: 'start' }) >= 0}
            onChange={e => this.onChangeTime('eventType', index, 'start', e)}
            onFocus={this.onFocus}
            onBlur={() => this.onBlurInput(index, 'start')}
            value={start}
            style={{ float: 'left' }}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              step: 300 // 5 min
            }}
          />
        </form>
        <label className={classes.eleFloat}>to</label>
        <form className={classes.container} noValidate>
          <TextField
            type="time"
            error={objIndexOf(errIndexList, { date, index, type: 'end' }) >= 0}
            onChange={e => this.onChangeTime('eventType', index, 'end', e)}
            onBlur={() => this.onBlurInput(index, 'end')}
            onFocus={this.onFocus}
            value={end}
            style={{ float: 'left' }}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              step: 300 // 5 min
            }}
          />
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(TimeInput);
