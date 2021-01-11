import React from "react";

const useStateWithLocalStorage = (localStorageKey) => {
  let store = localStorage.getItem(localStorageKey) || "";
  if (store !== "") {
    store = JSON.parse(store);
  }
  const [value, setValue] = React.useState(store);

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);

  return [value, setValue];
};

export default useStateWithLocalStorage;
