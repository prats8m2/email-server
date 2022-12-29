export const findDashMax = (data: any, key: string) => {
  return finder(Math.max, data, key);
};

export const findDashMin = (data: any, key: string) => {
  return finder(Math.min, data, key);
};

const finder = (cmp: any, arr: any, attr: string) => {
  let val = arr[0]?.[attr];
  for (let i = 1; i < arr.length; i++) {
    val = cmp(val, arr[i][attr]);
  }
  return val;
};
