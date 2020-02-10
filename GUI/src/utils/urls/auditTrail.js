import materialKeys from '../materialKeys';

const namespace = 'auditTrail';

const auditTrail = {
  'IVH-AUDIT-TRIAL_API': {
    Address: '/api',
    Path: '/ummi-admin/',
    URLS: {
      auditTrailList: {
        url: 'auditLog/pageQuery',
        materialKey: materialKeys['M3-29']
      },
      searchAuditTrailList: {
        url: 'auditLog/auditTrailList',
        materialKey: materialKeys['M3-29']
      },
      exportAudit: {
        url: 'auditLog/export',
        materialKey: materialKeys['M3-29']
      },
      exportAuditAll: {
        url: 'export/excel/auditLog',
        materialKey: materialKeys['M3-29']
      }
    }
  }
};
export default { auditTrail, namespace };
