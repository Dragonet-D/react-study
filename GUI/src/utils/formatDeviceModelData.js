/*
 * @Description: the function mapping model id to name
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @LastEditors: Kevin
 * @Date: 2019-03-27 19:46:59
 * @LastEditTime: 2019-08-04 19:17:17
 */

/**
 * @param {array} data device model list
 * @return {object} get a object that mapping model id to name; key is model id, value is model name
 */
export default function(data) {
  const r = {};
  data.forEach(item => {
    r[item.id] = item.name;
  });
  return r;
}
