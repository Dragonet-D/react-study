import global from './en-US/global';
import component from './en-US/component';
import menu from './en-US/menu';
import alarm from './en-US/alarm';
import vap from './en-US/vap';
import vade from './en-US/vade';
import uvms from './en-US/uvms';
import overview from './en-US/overview';
import map from './en-US/map';
import security from './en-US/security';
import user from './en-US/user';
import auditTrail from './en-US/auditTrail';

export default {
  'navBar.lang': 'Languages',
  ...component,
  ...menu,
  ...global,
  ...alarm,
  ...vap,
  ...vade,
  ...uvms,
  ...overview,
  ...map,
  ...security,
  ...user,
  ...auditTrail
};
