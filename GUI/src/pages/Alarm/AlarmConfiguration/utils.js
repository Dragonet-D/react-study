// handle item checked
export function handleCheckedItem(data, id, checked) {
  return data.map(item => {
    if (item.alarmDefinitionUuid === id) {
      return {
        ...item,
        checked
      };
    }
    return item;
  });
}
