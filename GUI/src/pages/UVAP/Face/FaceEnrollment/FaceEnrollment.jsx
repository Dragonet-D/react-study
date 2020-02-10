import React, { useState, useEffect } from 'react';
import {
  EnrollmentHeader,
  ManagementHandle,
  PersonListing,
  GroupManagement,
  FaceEnrollmentDialog,
  EditUserInformation
} from 'components/UVAP/Face/index';
import { connect } from 'dva';
import { BasicLayoutTitle, Download } from 'components/common';
import { I18n } from 'react-i18nify';

function FaceEnrollment(props) {
  const moduleName = 'faceEnrollment';
  const { dispatch, faceEnrollment, global, loading } = props;
  const { userId } = global;
  const {
    editUserInformation,
    allTheAppsData,
    personImages,
    groupsDataTable,
    batchFileData
  } = faceEnrollment;
  const [groupManagementStatus, setGroupManagementStatus] = useState(false);
  const [faceEnrollmentStatus, setFaceEnrollmentStatus] = useState(false);
  const [editUserInformationStatus, setEditUserInformationStatus] = useState(false);
  const [searchMode, setSearchMode] = useState('person');

  useEffect(() => {
    // get va engine list
    dispatch({
      type: `${moduleName}/getAllApps`,
      payload: userId
    });
    return () => {
      dispatch({
        type: `${moduleName}/clear`
      });
    };
  }, [dispatch, userId]);

  function handleHeaderClick(e) {
    switch (e) {
      case 'groupManagement':
        setGroupManagementStatus(true);
        break;
      case 'faceEnrollment':
        setFaceEnrollmentStatus(true);
        break;
      default:
        break;
    }
  }

  const handlePersonInfoEdit = () => {
    setEditUserInformationStatus(true);
  };

  function getMode(e) {
    setSearchMode(e);
  }

  const batchHandle = {
    handleTempFileDownload: () => {
      dispatch({
        type: `${moduleName}/vapFrsDownloadMultipleFRSTemplate`
      });
    }
  };

  return (
    <>
      <Download isIconNeeded={false} exportData={batchFileData} />
      <BasicLayoutTitle titleName={I18n.t('menu.uvap.children.face.children.faceEnrollment')}>
        <ManagementHandle handleClick={handleHeaderClick} getMode={getMode} />
      </BasicLayoutTitle>
      {groupManagementStatus && (
        <GroupManagement
          userId={userId}
          groupsDataTable={groupsDataTable}
          loading={loading}
          searchMode={searchMode}
          open={groupManagementStatus}
          onClose={() => setGroupManagementStatus(false)}
          allTheAppsData={allTheAppsData}
        />
      )}
      {faceEnrollmentStatus && (
        <FaceEnrollmentDialog
          userId={userId} 
          batchHandle={batchHandle}
          loading={loading}
          searchMode={searchMode}
          open={faceEnrollmentStatus}
          onClose={() => setFaceEnrollmentStatus(false)}
        />
      )}
      {editUserInformationStatus && (
        <EditUserInformation
          searchMode={searchMode}
          open={editUserInformationStatus}
          dataSource={editUserInformation}
          personImages={personImages}
          onClose={() => setEditUserInformationStatus(false)}
          userId={userId}
        />
      )}
      {searchMode === 'person' && <EnrollmentHeader />}
      <PersonListing
        searchMode={searchMode}
        onEdit={handlePersonInfoEdit}
        allTheAppsData={allTheAppsData}
      />
    </>
  );
}

export default connect(({ faceEnrollment, loading, global }) => ({
  loading,
  global,
  faceEnrollment
}))(FaceEnrollment);
