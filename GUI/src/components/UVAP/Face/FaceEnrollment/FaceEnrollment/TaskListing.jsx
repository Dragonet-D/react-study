import React, { memo } from 'react';
import { IVHTable } from 'components/common';
import { I18n } from 'react-i18nify';

const TaskListing = memo(() => {
  const columns = [
    {
      title: I18n.t('vap.face.faceEnrollment.taskID'),
      dataIndex: ''
    },
    {
      title: I18n.t('vap.face.faceEnrollment.fileName'),
      dataIndex: ''
    },
    {
      title: I18n.t('vap.face.faceEnrollment.createTime'),
      dataIndex: ''
    },
    {
      title: I18n.t('vap.face.faceEnrollment.status'),
      dataIndex: ''
    }
  ];
  return <IVHTable columns={columns} />;
});

export default TaskListing;
