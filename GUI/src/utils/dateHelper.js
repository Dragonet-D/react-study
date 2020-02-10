export const getCurrentTime = () => new Date(Date.now());
export const getStartTime = () => new Date(Date.now() - 1000 * 60 * 60 * 24);
export const getEndTime = () => new Date();

export const dateChangeType = date => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
  const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
  const seconds = newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds();
  return `${year}/${month}/${day} ${hour}:${minutes}:${seconds}`;
};

export const dateChangeTypeForApi = date => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
  const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
  // const seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
  return `${year}${month}${day}${hour}${minutes}`;
};

export const dateTimeTypeForTextField = newDate => {
  // const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
  const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
  // const seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
  return `${year}-${month}-${day}T${hour}:${minutes}`;
};

export const dateTimeTypeForExportExcel = newDate => {
  // const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
  const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
  const seconds = newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds();
  return `${year}${month}${day}${hour}${minutes}${seconds}`;
};
export const dateTypeWithoutTimeForTextField = newDate => {
  // const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
  const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  return `${year}-${month}-${day}`;
};

export const dateDisplayType = date => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
  const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
  const seconds = newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds();
  return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
};

export const dateTimeTypeForTimePicker = date => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
  const day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
  const seconds = newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds();
  return `${year}-${month}-${day}T${hour}:${minutes}:${seconds}`;
};

export const getCurrentTimeInMinutes = newDate => {
  const currentTime = new Date();
  const newTimeString = new Date(newDate).getTime();
  const currentTimeString = new Date(currentTime.toLocaleDateString()).getTime();
  const time = parseInt(newTimeString, 10) - parseInt(currentTimeString, 10);

  return time / 1000 / 60;
};

export const getCurrentTimeWithMinutes = time => {
  const currentTime = new Date();
  const currentTimeString = new Date(currentTime.toLocaleDateString()).getTime();
  const currentDateString = parseInt(time * 1000 * 60, 10) + parseInt(currentTimeString, 10);

  return new Date(currentDateString);
};
