"use strict";

browser = window.browser;

const INITIAL_PIPED = "piped.video";
const INITIAL_INVIDIOUS = "yewtu.be";

const saveOptions = (event) => {
  event.preventDefault();
  browser.storage.sync.set({
    piped: document.querySelector("#piped").value,
    invidious: document.querySelector("#invidious").value,
  });
};

const restoreOptions = () => {
  const setCurrentChoicePiped = (result) => {
    document.querySelector("#piped").value = result.piped || INITIAL_PIPED;
  };

  const setCurrentChoiceInvidious = (result) => {
    document.querySelector("#invidious").value =
      result.invidious || INITIAL_INVIDIOUS;
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
