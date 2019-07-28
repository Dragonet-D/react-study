import React, {useReducer, memo, useMemo, useState, useCallback, useRef} from "react";

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
  return (
    <div>
      <span>{config.count}</span>
      <button onClick={add}>test</button>
    </div>
  )
});

export default HooksOptimization;
