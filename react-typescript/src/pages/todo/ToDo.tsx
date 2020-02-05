import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import styles from './ToDo.module.less';

interface IProps {
  value?: string
  onSave: (text: string) => void
}

interface IState {
  name: string;
}

class ToDo extends React.Component<IProps, IState> {
  constructor(props: IProps, context?: any) {
    super(props, context);
    this.state = {
      name: props.value || ''
    };
  }

  public handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  public handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value.trim()
    if (e.which === 13) {
      this.props.onSave(text)
      this.setState({
        name: ''
      })
    }
  }

  public render() {
    const { name } = this.state;
    return (
      <div className={`${styles.wrapper} aaa`}>
        <TextField
            label='todo'
            value={name}
            onChange={this.handleChange}
            onKeyDown={this.handleEnter}
        />
      </div>
    );
  }
}

export default ToDo;
