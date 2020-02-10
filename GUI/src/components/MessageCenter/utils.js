export function getNewData(newData, prevData) {
  if (!prevData.length) {
    return newData;
  } else {
    return newData
      .concat(prevData)
      .filter(v => !newData.find(a => a.key === v.key) || !prevData.find(a => a.key === v.key));
  }
}
