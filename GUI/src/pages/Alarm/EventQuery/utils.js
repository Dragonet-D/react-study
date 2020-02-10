// handle the data source for the table
export function handleDataForTable(data) {
  return data.map(item => {
    return {
      key: item.eventId,
      ...item
    };
  });
}

export function getSelectRowKeys(data, id) {
  return data.map(item => item[id]);
}
