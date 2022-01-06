export function createRandomId(str) {
  return `${str || ""}-${new Date().getTime()}-${Math.random()}`;
}


export function getValidateRatio(val) {
  const min = 0;
  const max = 100;
  let v = Math.max(val, min)
  return Math.min(v, max)
}