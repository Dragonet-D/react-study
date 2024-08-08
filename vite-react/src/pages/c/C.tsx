import {FC, useState} from 'react';
import { c as _c } from '../../useCache'
import Child from "./Child";

interface Props {
}

const C: FC<Props> = () => {
  const $ = _c(6);
  const [count, setCount] = useState(0);
  let t0;
  if ($[0] !== count) {
    t0 = () => {
      setCount(count + 1);
    };
    $[0] = count;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const handleClick = t0;
  let t1;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = <Child />;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  let t2;
  if ($[3] !== handleClick || $[4] !== count) {
    t2 = (
        <div onClick={handleClick}>
          {count}
          {t1}
        </div>
    );
    $[3] = handleClick;
    $[4] = count;
    $[5] = t2;
  } else {
    t2 = $[5];
  }
  return t2;
}

export default C;