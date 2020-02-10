/*
 * @Description: data tools to deal with folding feature table
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @Date: 2019-06-13 21:02:22
 * @LastEditTime: 2019-10-15 22:15:15
 * @LastEditors: Kevin
 */

// translate horizontal data to tree data
const getTreeDataOfFeature = (() => {
  // get children feature depend on parent feature's uuid
  function getChildrenData({ featureUuid: id, originalData: initArray, level }) {
    const re = [];
    for (const tmp of initArray) {
      if (level === '') {
        tmp.level = 0;
      }
      if (tmp.releationship === id) {
        if (id !== '') {
          tmp.level = level + 1;
        }
        re.push(tmp);
      }
    }
    return re;
  }

  // get whole tree list
  function getListData({ previousArray: preArr, original: initArray }) {
    for (const tmp of preArr) {
      const childArray = getChildrenData({
        featureUuid: tmp.featureUuid,
        originalData: initArray,
        level: tmp.level
      });

      tmp.children = [];
      tmp.children = tmp.children.concat(childArray);

      // if some feature has children ,then continue looping to get child's children feature
      if (childArray.length > 0) {
        getListData({
          previousArray: tmp.children,
          original: initArray
        });
      }
    }
  }

  return function getTreeData(data) {
    const rootLevel = getChildrenData({ featureUuid: '', originalData: data, level: '' });

    getListData({
      previousArray: rootLevel,
      original: data
    });

    return rootLevel;
  };
})();

// search feature
const getAllFeaturesSearched = (() => {
  let result = [];

  // get parent: loop initial data to get all parent features and parent's parents on some one path
  function getAllParentFeatures(item, initData) {
    for (const temp of initData) {
      if (item.releationship === temp.featureUuid) {
        result.push(temp);
        getAllParentFeatures(temp, initData);
      }
    }
  }

  // get children: loop initial data to get all children and child's children on some one path
  function getAllChildFeatures({ child, initialData }) {
    // console.log('````````````````getAllChildFeatures``111111`````````',child, initialData);
    for (const temp of initialData) {
      // console.log('````````````````getAllChildFeatures``111111`````````',temp, child.featureUuid  === temp.releationship);
      if (child.featureUuid === temp.releationship) {
        result.push(temp);
        getAllChildFeatures({ child: temp, initialData });
      }
    }
  }

  // remove repetition data
  function removeRepetitionData() {
    const all = result.slice();
    const re = {};
    for (const temp of all) {
      const uuid = temp.featureUuid;
      re[uuid] = temp;
    }

    const ret = [];
    Object.keys(re).map(key => {
      ret.push(re[key]);
      return key;
    });

    result = ret;
  }

  // return data searched that including all feature on every path
  return function getSearchingData(searchText, initData) {
    // console.log('1111111111',initData);
    result = [];
    if (searchText === '') return initData;

    for (const temp of initData) {
      if (
        temp.featureName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
        temp.featureDesc.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      ) {
        result.push(temp);

        // search up every parent feature on every path
        getAllParentFeatures(temp, initData);
        // console.log('````````````````getAllParentFeatures```````````',result);

        // search down every children including child's children
        getAllChildFeatures({ child: temp, initialData: initData });
        // console.log('````````````````getAllChildFeatures```````````',result);
      }
    }

    removeRepetitionData();
    // console.log('````````````````removeRepetitionData```````````',result);

    return result;
  };
})();

/*
 * @Author: An Ke
 * @Date: 2019-01-21 09:57:57
 * @Last Modified by: An ke
 * @Last Modified time: 2019-03-16 11:15:40
 *
 * filterRange = ['userId','userName','userFullName','userEmail','userStatus'];
 * keyWord
 * dataList
 * selectRange = { 'deviceType' : 'general-rtsp' }
 * capitalization true or false
 */
const talbeFilter = (
  filterRange,
  keyWord,
  dataList = [],
  selectRange = {},
  capitalization = false
) => {
  let filterList = [];
  if (Object.keys(selectRange).length !== 0) {
    const effectRange = Object.keys(selectRange).filter(obj => {
      return selectRange[obj] && selectRange[obj] !== '#000000';
    });
    filterList = dataList.filter(obj => {
      if (!obj) return false;
      let isInclude = 0;
      Object.keys(obj).forEach(key => {
        for (const i in selectRange) {
          if (selectRange[i] && key === i && obj[key] === selectRange[i]) {
            isInclude++;
          }
        }
      });
      if (isInclude === effectRange.length) {
        return true;
      } else {
        return false;
      }
    });
  } else if (Object.keys(selectRange).length === 0) {
    filterList = dataList;
  }

  if (keyWord) {
    if (!capitalization) keyWord = keyWord.toLowerCase();
    filterList = filterList.filter(obj => {
      let isInclude = false;
      Object.keys(obj).forEach(key => {
        if (!obj[key] && filterRange.join(' ').indexOf(key) === -1) {
          return false;
        }
        if (!capitalization) {
          if (
            obj[key] &&
            String(obj[key])
              .toLowerCase()
              .indexOf(keyWord) !== -1 &&
            filterRange.join(' ').indexOf(key) !== -1
          ) {
            isInclude = true;
            return false;
          }
        } else if (
          obj[key] &&
          String(obj[key]).indexOf(keyWord) !== -1 &&
          filterRange.join(' ').indexOf(key) !== -1
        ) {
          isInclude = true;
          return false;
        }
      });
      if (isInclude) {
        return true;
      }

      return false;
    });
  }

  return filterList;
};

/* ***************************** Result********************************* */

// get  result of tree data searched
const getTreeDataSearched = function getResultOfTreeDataSearched(searchText, initData) {
  const searchingResult = getAllFeaturesSearched(searchText, initData);
  return getTreeDataOfFeature(searchingResult);
};

// get  result of all features searched
const searchFeatures = function getResultOfAllFeaturesSearched(searchText, initData) {
  return getAllFeaturesSearched(searchText, initData);
};

// get  result of all features
const getTreeData = function getResultOfFeatureTreeData(data) {
  return getTreeDataOfFeature(data);
};

export default {
  searchFeatures,
  getTreeDataSearched,
  getTreeData,
  talbeFilter
};
