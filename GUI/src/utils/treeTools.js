/*
 * @Description: including method of searching tree node and formating tree data and make it standard enough to generate tree component
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-07-21 23:45:17
 * @LastEditTime: 2019-09-10 18:16:56
 * @LastEditors: Kevin
 */

const tools = {};

tools.formatSensorList = function formatSensorList({ data, parent, search }) {
  if (!data || (!!data && data.length === 0)) {
    return data;
  }

  // added (Make channles display at the front of group) by anke  -- start
  const result = this.putChannelToTop(data); // Make channles display at the front of group
  // added (Make channles display at the front of group)  -- end

  for (const val of result) {
    const haveChild = !!val.children && val.children.length > 0;

    if (haveChild) {
      if (typeof parent === 'undefined') {
        val.fullPath = val.groupId;
        if (val.groupLevel === undefined) val.groupLevel = '1';
      } else {
        val.fullPath = `${parent.fullPath}|${val.groupId}`;
      }

      this.formatSensorList({
        data: val.children,
        parent: val,
        search
      });
    } else {
      if (!val.installation) val.installation = {};

      // fix and set full path
      if (typeof parent === 'undefined') {
        val.fullPath = val.groupId;
      } else {
        if (val.channelName) {
          val.groupName = parent.groupName;
          val.parentGroupId = parent.groupId;
        } else {
          val.parentGroupName = parent.groupName;
        }

        val.fullPath = `${parent.fullPath}|${val.channelId || val.groupId}`;
      }

      // fix and set group level
      if (val.groupLevel === undefined && typeof parent !== 'undefined') {
        val.groupLevel = String(Number(parent.groupLevel) + 1);
      }

      // set isSearched field
      if (
        search !== '' &&
        !!val.channelName &&
        val.channelName.toLowerCase().includes(search.toLowerCase())
      ) {
        val.isSearched = true;
      }
    }
  }
  return result;
};

tools.putChannelToTop = function putChannelToTop(data) {
  const groupList = [];
  const channelList = [];
  if (!data || (!!data && data.length === 0)) {
    return data;
  }
  for (const val of data) {
    const isGroup = !!val && !!val.groupId && val.groupId.length > 0;
    if (isGroup) {
      groupList.push(val);
    } else {
      channelList.push(val);
    }
  }
  channelList.push(...groupList);
  data.splice(0, data.length);
  data.push(...channelList);
  return data;
};

tools.formatUserGroupList = function format({ data }) {
  if (!data || (!!data && data.length === 0)) {
    return data;
  }
  const result = [...data];
  for (const val of result) {
    const haveChild = !!val.children && val.children.length > 0;

    val.isSearched = val.belongToSearch;
    val.fullPath = val.fullPath && val.fullPath.replace('/', '|');
    val.groupLevel = String(Number(val.levelId) + 1);
    if (haveChild) {
      this.formatUserGroupList({
        data: val.children
      });
    }
  }
  return result;
};

export const { formatSensorList } = tools;

export const { formatUserGroupList } = tools;

export default tools;
