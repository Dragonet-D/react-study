// handle item checked
export function handleCheckedItem(data, id, checked, targetId) {
  return data.map(item => {
    if (item[targetId] === id) {
      return {
        ...item,
        checked
      };
    }
    return item;
  });
}
