import React, { useState } from 'react';
import { Button } from 'antd';

const B = () => {
  const [a, setA] = useState(0);

  const handleTest = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setA(a + 1);
        console.log('fc', a);
      }, 1000);
    }
  };

  return <Button onClick={handleTest}>test fc</Button>;
};

export default B;
