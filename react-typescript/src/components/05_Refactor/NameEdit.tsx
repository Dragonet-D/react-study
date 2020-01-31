import * as React from 'react';
import { Input, Button } from 'antd';

interface IProps {
  initialUserName: string;
  editingName: string;
  onNameUpdated: () => any;
  onEditingNameUpdated: (newEditingName: string) => any;
}

function Refactor(props: IProps) {
  const { initialUserName, onEditingNameUpdated, onNameUpdated } = props;

  const onUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onEditingNameUpdated(value);
  };

  const handleNameUpdated = (e: any): void => {
    onNameUpdated();
  };

  return (
    <>
      <Input value={initialUserName} onChange={onUserNameChange} />
      <Button onClick={handleNameUpdated}>Change</Button>
    </>
  );
}

export default Refactor;
