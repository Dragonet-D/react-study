import React, {useReducer, memo, useMemo, useState, useCallback} from "react";

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

  const config = useMemo(() => ({
    count
  }), [count]);

  const onButtonClick = useCallback(() => dispatchCount({type: 'add'}), []);

  function handleChange(e) {
    const { value } = e.target;
    setValue(value);
  }

  return  (
    <>
      <input type="text" onChange={handleChange} value={value}/>
      <div>{count}</div>
      <Child config={config} onButtonClick={onButtonClick}/>
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
