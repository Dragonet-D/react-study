import { routerRedux, fetch } from 'dva';
import store from '../index';
import notification from './messageCenter';
import token from './tokenHelper';
import userHelper from './userHelper';
import { clearAutoUpdateSession } from './helpers';

const isLogged = !!userHelper.get();

const codeMessageEN = {
  200: 'The request has succeeded',
  201: 'The request has succeeded and a new resource has been created/updated',
  202: 'The request has been received but not yet acted upon (asynchronous response)',
  204: 'No content to send for this request',
  400: 'Bad Request',
  401: 'Unauthorized operation',
  403: 'Forbidden',
  404: 'Not Found',
  406: 'Cannot find any content following the criteria given by the user agent',
  410: 'Requested content has been permanently deleted',
  422: 'The request was well-formed but was unable to be followed due to semantic errors',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

function errMessage(response) {
  const errortext = codeMessageEN[response.status] || response.statusText;
  notification.error(`${response.url}`, 'Request Error');
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  return error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {object} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {string} type      The request type
 * @param  {string} requestType      The use type
 * @return {object}           An object containing either "data" or "err"
 */
function request(url, options, type, requestType) {
  const formatOptions = Object.assign(
    {},
    {
      body: options,
      headers: Object.assign(
        token.get() ? { Authorization: token.get() } : {},
        url.materialKey ? { materialKey: url.materialKey } : {}
      )
    },
    { method: type }
  );
  // default parameter
  const defaultOptions = {
    // credentials: 'include',
    mode: 'cors',
    cache: 'default'
  };
  const newOptions = { ...defaultOptions, ...formatOptions };

  newOptions.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    ...newOptions.headers
  };
  newOptions.body = JSON.stringify(newOptions.body);

  return fetch(url.url, newOptions)
    .then(response => {
      const { dispatch } = store;
      if (requestType === 'download') {
        return response
          .blob()
          .then(res => {
            if (response.headers.get('Content-Disposition')) {
              const nameDecodeURI = response.headers
                .get('Content-Disposition')
                .slice(response.headers.get('Content-Disposition').indexOf('=') + 1);
              res.fileName = decodeURIComponent(nameDecodeURI);
            }

            return res;
          })
          .catch(() => {
            throw errMessage(response);
          });
      } else {
        return response.json().then(
          res => {
            const data = {
              status: response.status,
              message: response.statusText,
              time: response.headers.get('date'),
              ...res
            };
            // the same uer logged in the other place
            if (data.status === 403 && data.statusCode === 9999) {
              if (isLogged) {
                const { dispatch } = store;
                clearAutoUpdateSession();
                dispatch({
                  type: 'global/disConnectCommonWebSocket'
                });
                dispatch({
                  type: 'user/clearUpdateSession'
                });
                userHelper.remove();
              }
              dispatch(routerRedux.push('/user/login'));
              return data;
            }
            if (data.status >= 200 && data.status < 500) {
              return data;
            }
            // request error
            throw errMessage(response);
          },
          () => {
            // request error
            throw errMessage(response);
          }
        );
      }
    })
    .then(response => {
      return response;
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      clearAutoUpdateSession();
      dispatch({
        type: 'global/disConnectCommonWebSocket'
      });
      dispatch({
        type: 'user/clearUpdateSession'
      });
      if (status === 401) {
        dispatch({
          type: 'User/logout'
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        // dispatch(routerRedux.push('/exception/500'));
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}

function fetchNoLoadingApi(url, option) {
  return Promise.race([
    fetch(url, option),
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Request Timeout')), option.timeout);
    })
  ])
    .then(res => {
      return res.json().then(
        json => {
          const httpMsg = {
            status: res.status,
            message: res.statusText,
            ...json
          };

          if (httpMsg.status === 403 && httpMsg.statusCode === 9999) {
            token.remove();
          }
          return httpMsg;
        },
        error => {
          return {
            status: res.status,
            message: res.statusText,
            error
          };
        }
      );
    })
    .then(json => {
      return json;
    })
    .catch(err => {
      throw err;
    });
}

function fileUpload(item, pd) {
  const mKey = item.materialKey;
  const option = {
    mode: 'cors',
    cache: 'default',
    timeout: 1000 * 60 * 60
  };
  const headerSetting = {
    Accept: 'application/json'
  };

  const tokens = token.get();
  if (tokens) {
    headerSetting.Authorization = tokens;
  }
  if (mKey) {
    headerSetting.materialKey = mKey;
  }

  const op = Object.assign({}, option, {
    method: 'POST',
    body: getFormDataObject(pd),
    headers: headerSetting,
    timeout: 1000 * 60 * 60 * 24
  });

  return fetchNoLoadingApi(item.url, op);
}

function getFormDataObject(args) {
  const formdata = new FormData();
  for (const name in args) {
    if (args.hasOwnProperty(name)) {
      const value = args[name];
      formdata.append(name, value);
    }
  }

  return formdata;
}

function post(url, options) {
  return request(url, options, 'POST');
}

function get(url, options) {
  return request(url, options, 'GET');
}

function put(url, options) {
  return request(url, options, 'PUT');
}

function del(url, options) {
  return request(url, options, 'DELETE', 'DELETE');
}

function downloadPost(url, options) {
  return request(url, options, 'POST', 'download');
}

function downloadGet(url, options) {
  return request(url, options, 'GET', 'download');
}

export default {
  post,
  put,
  get,
  del,
  fileUpload,
  downloadPost,
  downloadGet
};
