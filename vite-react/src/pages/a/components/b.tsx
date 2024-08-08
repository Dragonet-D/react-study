import { memo, FC } from "react";
// import { isEqual } from 'radash'
import D from "./d";

interface Props {
  onClick: () => void;
  value: number[];
  newProps?: Record<string, string>
}

const B: FC<Props> = () => {
  console.log("B rerender");

  return (
    <div>
      B
      <D />
    </div>
  );
};

export default memo(B);
