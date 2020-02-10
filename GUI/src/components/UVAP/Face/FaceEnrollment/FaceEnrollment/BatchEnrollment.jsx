import React from 'react';
import GroupTable from './GroupTable';
import FileUpload from './FileUpload';

function BatchEnrollment(props) {
  return (
    <>
      <FileUpload {...props} />
      <GroupTable />
    </>
  );
}

export default BatchEnrollment;
