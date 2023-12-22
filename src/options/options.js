"use strict";

const browser = window.browser;

const INITIAL_PIPED = "piped.video";
const INITIAL_INVIDIOUS = "yewtu.be";

const saveOptions = (event) => {
  event.preventDefault();
  browser.storage.sync.set({
    piped: document.querySelector("#piped").value,
    invidious: document.querySelector("#invidious").value,
  });
};

const restoreOptions = async () => {
  const setCurrentChoicePiped = ({ piped }) => {
    document.querySelector("#piped").value = piped || INITIAL_PIPED;
  };

  const setCurrentChoiceInvidious = ({ invidious }) => {
    document.querySelector("#invidious").value = invidious || INITIAL_INVIDIOUS;
  };

  try {
    const getPiped = browser.storage.sync.get("piped");
    const getInvidious = browser.storage.sync.get("invidious");

    const pipedResult = await getPiped;
    const invidiousResult = await getInvidious;

    setCurrentChoicePiped(pipedResult);
    setCurrentChoiceInvidious(invidiousResult);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
