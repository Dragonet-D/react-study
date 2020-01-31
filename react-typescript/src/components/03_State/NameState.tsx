import * as React from 'react';

interface IProps {
  userName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameEditComponent = (props: IProps) => {
  return <input type='text' value={props.userName} onChange={props.onChange} />;
};

export default NameEditComponent