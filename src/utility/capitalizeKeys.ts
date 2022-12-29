const CAPITALIZEKEYS = (arr: any) => {
  const resp = [];
  for (let index = 0; index < arr.length; index++) {
    const obj = arr[index];

    const keys = Object.keys(obj);
    let n = keys.length;
    let lowKey;
    while (n--) {
      const key = keys[n];
      if (key === (lowKey = key.toUpperCase())) continue;

      obj[lowKey] = obj[key];
      delete obj[key];
    }
    resp.push(obj);
  }
  return resp;
};

export default CAPITALIZEKEYS;
