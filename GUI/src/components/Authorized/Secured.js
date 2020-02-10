import React from 'react';
import Exception403 from 'pages/Exception/Exception403';
import CheckPermissions from './CheckPermissions';

// Determine whether the incoming component has been instantiated
// AuthorizedRoute is already instantiated
// Authorized  render is already instantiated, children is no instantiated
// Secured is not instantiated
const checkIsInstantiation = target => {
  if (!React.isValidElement(target)) {
    return target;
  }
  return () => target;
};

/**
 * judge the view permission
 * authority support  string ,funtion:()=>boolean|Promise, array
 * e.g. 'user' just user
 * e.g. 'user,admin' user, admin both can
 * e.g. ()=>boolean true => ok, false => not
 * e.g. Promise  then => ok, catch => not
 * e.g. authority support incoming string, funtion: () => boolean | Promise
 * e.g. 'user' only user user can access
 * e.g. 'user, admin' user and admin can access
 * e.g. () => boolean true to be able to visit, return false can not be accessed
 * e.g. Promise then can not access the visit to catch
 * @param {string | function | Promise} authority
 * @param {ReactNode} error no necessary parameter
 */
const authorize = (authority, error) => {
  /**
   * conversion into a class
   * in case that the string together and the 'staticContext' can't be found
   * String parameters can cause staticContext not found error
   */
  let classError = false;
  if (error) {
    classError = () => error;
  }
  if (!authority) {
    throw new Error('authority is required');
  }
  return function decideAuthority(targer) {
    const component = CheckPermissions(authority, targer, classError || Exception403);
    return checkIsInstantiation(component);
  };
};

export default authorize;
