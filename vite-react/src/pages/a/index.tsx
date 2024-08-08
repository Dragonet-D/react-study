import { useCallback, useMemo, useState } from "react";
import B from "./components/b";
import C from "./components/c";

const A = () => {
  const [state, setState] = useState(0);

  const onClick = useCallback(() => {}, []);
  // const onClick = () => {}

  // const value = [1, 2, 3]
  const value = useMemo(() => [1, 2], []);

  // const newProps = { a: "1" };

  return (
    <div>
      <button onClick={() => setState(state + 1)}>Click {state}</button>
      <B onClick={onClick} value={value} />
      <C />
    </div>
  );
};

export default A;
