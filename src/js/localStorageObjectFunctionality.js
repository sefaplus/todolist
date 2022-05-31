export function setLocalStorageObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorageObject(key) {
    let value = localStorage.getItem(key);
    return value && JSON.parse(value);
}
export function localStorageToArray(localStorage) {
    let A = [];
    Object.keys(localStorage).sort().forEach((key) => {
      A.push(getLocalStorageObject(key));
    });
    return A;
  }
export function rmLocalStorageObject(key) {
  localStorage.removeItem(key);
}