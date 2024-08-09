import { FC, useCallback, useState } from 'react';
import C from './C.tsx';

interface Props {
}

const Index: FC<Props> = () => {
  const [count, setCount] = useState(0);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const handleClick = () => {
  }

  return (
      <div>
        <button
          onClick={() => {
            setCount(count + 1);
            setA(a + 1);
          }}
        >{count}</button>
        <C onClick={handleClick} count={count} a={a} b={b} />
      </div>
  )
}

export default Index;