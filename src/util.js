export function createRandomId(str) {
  return `${str || ""}-${new Date().getTime()}-${Math.random()}`;
}
