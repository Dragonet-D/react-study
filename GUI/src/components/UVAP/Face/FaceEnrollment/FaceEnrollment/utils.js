// handle item checked
export function handleCheckedItem(data, id, checked) {
  return data.map(item => {
    if (item.id === id) {
      return {
        ...item,
        checked
      };
    }
    return item;
  });
}

export function initialCheckedItems(data, ids) {
  return data.map(item => {
    return {
      ...item,
      checked: ids.includes(item.id)
    };
  });
}
