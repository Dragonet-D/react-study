export const LICENSE_STATUS_ENABLED = 'OK';
export const LICENSE_STATUS_DISABLED = 'DISABLED';
export const LICENSE_STATUS_STRING = 'STRING';
export const LICENSE_STATUS_FILE = 'FILE';
export function handleLicenseList(data) {
  return data.map(item => ({
    ...item,
    enabled: item.enabled ? LICENSE_STATUS_ENABLED : LICENSE_STATUS_DISABLED
  }));
}
