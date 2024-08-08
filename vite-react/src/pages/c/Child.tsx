import {FC} from 'react';

interface Props {
}

const Child: FC<Props> = () => {
  console.log('Child-rerender');
  return (
      <div>Child</div>
  )
}

export default Child;