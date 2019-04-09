import React, {useMemo, useState} from "react";

function Test() {
  const [color] = useState('pink');
  const style = useMemo(() => ({color}), [color]);

  console.log(style);
  return <div>123</div>
}

export default Test;