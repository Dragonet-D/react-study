import { memo, FC } from "react";
// import { isEqual } from 'radash'
import C from "./c";

interface Props {
  onClick: () => void;
  value: number[];
}

const B: FC<Props> = () => {
  console.log("B rerender");

  return (
    <div>
      B
      <C />
    </div>
  );
};

export default memo(B);
