browser = window.browser;

const saveOptions = (event) => {
  event.preventDefault();
  browser.storage.sync.set({
    piped: document.querySelector("#piped").value,
    invidious: document.querySelector("#invidious").value,
  });
};

const restoreOptions = () => {
  const setCurrentChoicePiped = (result) => {
    document.querySelector("#piped").value = result.piped || "piped.video";
  };

  const setCurrentChoiceInvidious = (result) => {
    document.querySelector("#invidious").value = result.invidious || "yewtu.be";
  };

  const onError = (error) => {
    console.log(`Error: ${error}`);
  };

  let getPiped = browser.storage.sync.get("piped");
  getPiped.then(setCurrentChoicePiped, onError);

  let getInvidious = browser.storage.sync.get("invidious");
  getInvidious.then(setCurrentChoiceInvidious, onError);
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
