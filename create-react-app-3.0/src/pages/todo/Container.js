import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'dva';
import { Input } from 'components/common';
import styles from './styles/Container.module.less';

const style = () => ({
  wrapper: {
    width: '400px',
    height: '500px',
    margin: '20px auto 0'
  }
});

function ToDo(props) {
  const { classes, dispatch, todo } = props;
  const { dataList } = todo;
  const [inputValue, setInputValue] = useState('');

  function handleChange(e) {
    const { value } = e.target;
    setInputValue(value);
  }

  function handleSubmit(e) {
    if (inputValue.trim() && e.keyCode === 13) {
      e.preventDefault();
      dataList.push({
        id: Math.random(),
        value: inputValue
      });
      setInputValue('');
      dispatch({
        type: 'todo/addToDo',
        payload: {
          dataList
        }
      });
    }
  }

  return (
    <div className={`${classes.wrapper} ${styles.wrapper}`}>
      <Input
        fullWidth
        onChange={handleChange}
        value={inputValue}
        onKeyDown={handleSubmit}
        placeholder="Input Something You Want"
      />
      {dataList.map(item => (
        <div key={item.id}>{item.value}</div>
      ))}
    </div>
  );
}

export default withStyles(style)(
  connect(({ todo, loading }) => ({
    todo,
    loading
  }))(ToDo)
);
