import React, {useReducer, memo, useMemo, useState, useCallback, useRef} from "react";
import { Button } from 'antd';

function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1;
    default:
      return state;
  }
}

function HooksOptimization() {
  const [count, dispatchCount] = useReducer(countReducer,0);
  const [value, setValue] = useState("");
  const countRef = useRef(); // {current: ''} 每次返回同一个对象
  countRef.current = count;

  const config = useMemo(() => ({
    count
  }), [count]);

  // const onButtonClick = useCallback(() => dispatchCount({type: 'add'}), []);

  const onButtonClick = useMemo(() => () => dispatchCount({type: 'add'}), []);

  function handleChange(e) {
    const { value } = e.target;
    setValue(value);
  }

  const handleAlertButtonClick = useCallback(() => (
    setTimeout(() => {
      alert(countRef.current);
    }, 2000)
  ), []);

  const testUseMemo = useMemo(() => [1, 2, 3], []);
  console.log(testUseMemo);

  return  (
    <>
      <input type="text" onChange={handleChange} value={value}/>
      <div>{count}</div>
      <Child config={config} onButtonClick={onButtonClick}/>
      <button onClick={handleAlertButtonClick}>alert count</button>
    </>
  )
}

const Child = memo(function Child({config, onButtonClick}) {
  console.log('child render');

  function add() {
    onButtonClick()
  }

  const handleTest = useCallback(() => {
    fetch('/api/aaaa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        submitdata: '1$1}2$3}3$2}4$2}5$3}6$1}7$2}8$3}9$2}10$2}11$2}12$2}13$2}14$1}15$2}16$2}17$1}18$1'
      })
    });
  }, []);

  return (
    <div>
      <span>{config.count}</span>
      <button onClick={add}>test</button>
      <Button onClick={handleTest}>Test</Button>
    </div>
  )
});

export default HooksOptimization;
