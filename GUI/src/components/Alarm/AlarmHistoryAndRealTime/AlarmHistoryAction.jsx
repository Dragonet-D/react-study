import React from 'react';
import { Button, Permission, isPermissionHas } from 'components/common';
import materialKeys from 'utils/materialKeys';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { Translate } from 'react-i18nify';
import styles from './AlarmHistroyAction.module.less';

function AlarmHistoryAction(props) {
  const { dataSource, userId, getActionData, open, componentTarget } = props;
  const { status: rowSelectionStatus, ownedBy: rowSelectionOwnedBy } = dataSource[0] || {};
  const rowSelectionDisabled = !(!rowSelectionOwnedBy || rowSelectionOwnedBy === userId);
  // handle alarm history or alarm realtime
  const isHistory = componentTarget === 'alarmHistory';
  const isHandleAll = false;

  const handleItemClick = target => e => {
    getActionData(target, dataSource[0], e);
  };
  const handleAll = target => e => {
    getActionData(target, dataSource, e);
  };
  return (
    <>
      {dataSource.length === 1 && <Divider />}
      <div
        className={`${styles.handle_wrapper} ${open && dataSource.length === 1 ? styles.show : ''}`}
      >
        {open && (
          <div className={styles.handle_btn}>
            {dataSource.length === 1 ? (
              <>
                {rowSelectionStatus !== 'Open' && rowSelectionOwnedBy !== userId ? (
                  <Permission
                    materialKey={isHistory ? materialKeys['M4-20'] : materialKeys['M4-21']}
                  >
                    <Button color="primary" onClick={handleItemClick('View')}>
                      <Translate value="alarm.button.view" />
                    </Button>
                  </Permission>
                ) : (
                  <Permission
                    materialKey={isHistory ? materialKeys['M4-77'] : materialKeys['M4-22']}
                  >
                    <Button
                      color="primary"
                      disabled={!(!rowSelectionOwnedBy || rowSelectionOwnedBy === userId)}
                      onClick={handleItemClick('Action')}
                    >
                      <Translate value="alarm.button.action" />
                    </Button>
                  </Permission>
                )}
                {rowSelectionStatus !== 'Closed' && (
                  <>
                    {rowSelectionStatus === 'Open' ? (
                      <>
                        {(() => {
                          const Handling = () => (
                            <Button
                              color="primary"
                              onClick={handleItemClick('Handling')}
                              disabled={rowSelectionDisabled}
                            >
                              <Translate value="alarm.button.handling" />
                            </Button>
                          );
                          if (isHistory) {
                            return <Handling />;
                          }
                          return isPermissionHas(materialKeys['M4-23']) && <Handling />;
                        })()}
                      </>
                    ) : (
                      <>
                        <Button
                          color="primary"
                          disabled={rowSelectionDisabled}
                          onClick={handleItemClick('Release')}
                        >
                          <Translate value="alarm.button.release" />
                        </Button>
                        <Button
                          color="primary"
                          disabled={rowSelectionDisabled}
                          onClick={handleItemClick('Close')}
                        >
                          <Translate value="alarm.button.close" />
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {isHandleAll && (
                  <Button color="primary" onClick={handleAll('handleAll')}>
                    <Translate value="alarm.button.handleAll" />
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

AlarmHistoryAction.defaultProps = {
  dataSource: [],
  userId: '',
  getActionData: () => {}
};

AlarmHistoryAction.propTypes = {
  dataSource: PropTypes.array,
  userId: PropTypes.string,
  getActionData: PropTypes.func,
  componentTarget: PropTypes.oneOf(['alarmHistory', 'alarmRealtime']).isRequired
};

export default AlarmHistoryAction;
