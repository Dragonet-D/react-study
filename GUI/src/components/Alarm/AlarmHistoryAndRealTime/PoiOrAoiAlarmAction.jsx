import React from 'react';
import { routerRedux } from 'dva';
import { Button, Permission, isPermissionHas } from 'components/common';
import materialKeys from 'utils/materialKeys';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { I18n, Translate } from 'react-i18nify';
import store from '@/index';
import styles from './AlarmHistroyAction.module.less';

function PoiOrAoiAlarmAction(props) {
  const { dataSource, userId, getActionData, open } = props;
  const { status: rowSelectionStatus, ownedBy: rowSelectionOwnedBy } = dataSource[0] || {};
  const rowSelectionDisabled = !(!rowSelectionOwnedBy || rowSelectionOwnedBy === userId);
  // handle alarm history or alarm realtime
  const isHandleAll = false;

  const handleItemClick = target => e => {
    getActionData(target, dataSource[0], e);
  };
  const handleAll = target => e => {
    getActionData(target, dataSource, e);
  };

  function handleReportIncident() {
    store.dispatch(routerRedux.push('/uvap/post-incident'));
  }
  return (
    <>
      {dataSource.length > 0 && <Divider />}
      <div className={`${styles.handle_wrapper} ${open ? styles.show : ''}`}>
        {open && (
          <div className={styles.handle_btn}>
            <Button color="primary" onClick={handleItemClick('FalsePositive')}>
              {I18n.t('alarm.button.falsePositive')}
            </Button>
            {dataSource.length === 1 ? (
              <>
                <Button onClick={handleReportIncident}>
                  {I18n.t('alarm.button.reportIncident')}
                </Button>
                {rowSelectionStatus !== 'Open' && rowSelectionOwnedBy !== userId ? (
                  ''
                ) : (
                  <Permission materialKey={materialKeys['M4-22']}>
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

PoiOrAoiAlarmAction.defaultProps = {
  dataSource: [],
  userId: '',
  getActionData: () => {}
};

PoiOrAoiAlarmAction.propTypes = {
  dataSource: PropTypes.array,
  userId: PropTypes.string,
  getActionData: PropTypes.func
};

export default PoiOrAoiAlarmAction;
