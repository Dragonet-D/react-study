import {Input} from 'antd';
import * as React from 'react';

interface IProps {
  userName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameEditComponent = (props: IProps) => {
  const {userName, onChange} = props
  return <Input type='text' value={userName} onChange={onChange} />;
};

export default NameEditComponent