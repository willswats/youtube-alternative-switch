browser = window.browser;

const YOUTUBE_URL = "https://www.youtube.com/";
const CHAT_REPLAY_URL = "https://chatreplay.stream/";
const YOUTUBE_PATTERN = "*://*.youtube.com/watch?v=*";
const CHAT_REPLAY_PATTERN = "*://chatreplay.stream/videos/*";

let PIPED_URL = "https://piped.video/";
let INVIDIOUS_URL = "https://yewtu.be/";
let PIPED_PATTERN = `*://piped.video/watch?v=*`;
let INVIDIOUS_PATTERN = `*://yewtu.be/watch?v=*`;

const getStorageSync = () => {
  const setPiped = ({ piped }) => {
    console.log(piped);
    console.log(piped);
    if (piped !== undefined) {
      PIPED_URL = `https://${piped}/`;
      PIPED_PATTERN = `*://${piped}/watch?v=*`;
    }
  };

  const setInvidious = ({ invidious }) => {
    if (invidious !== undefined) {
      INVIDIOUS_URL = `https://${invidious}/`;
      INVIDIOUS_PATTERN = `*://${invidious}/watch?v=*`;
    }
  };

  const onError = (error) => {
    console.log(`Error: ${error}`);
  };

  let getPiped = browser.storage.sync.get("piped");
  getPiped.then(setPiped, onError);

  let getInvidious = browser.storage.sync.get("invidious");
  getInvidious.then(setInvidious, onError);
};

const switchWebsite = (websiteUrl) => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const currentUrl = tabs[0].url;

    let query = getCurrentUrlQuery(currentUrl);
    if (query === "") {
      return;
    }

    let newUrl = websiteUrl + query;
    let chatReplayUrlConverted = `${currentUrl.split("videos/")[0]}watch?v=${currentUrl.split("videos/")[1]
      }`;
    if (newUrl === currentUrl || newUrl === chatReplayUrlConverted) {
      return;
    }

    browser.tabs.update({
      url: newUrl,
    });
  });
};

const getCurrentUrlQuery = (currentUrl) => {
  let query = "";
  if (currentUrl.includes(YOUTUBE_URL)) {
    query = currentUrl.split(YOUTUBE_URL)[1];
  } else if (currentUrl.includes(INVIDIOUS_URL)) {
    query = currentUrl.split(INVIDIOUS_URL)[1];
  } else if (currentUrl.includes(PIPED_URL)) {
    query = currentUrl.split(PIPED_URL)[1];
  } else if (currentUrl.includes(CHAT_REPLAY_URL)) {
    const chatReplaySplitUrl = `${CHAT_REPLAY_URL}videos/`;
    query = `watch?v=${currentUrl.split(chatReplaySplitUrl)[1]}`;
  }
  return query;
};

const createContextMenus = () => {
  browser.contextMenus.create({
    title: "Switch to YouTube",
    onclick: () => switchWebsite(YOUTUBE_URL),
    documentUrlPatterns: [
      INVIDIOUS_PATTERN,
      PIPED_PATTERN,
      CHAT_REPLAY_PATTERN,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Piped",
    onclick: () => switchWebsite(PIPED_URL),
    documentUrlPatterns: [
      YOUTUBE_PATTERN,
      INVIDIOUS_PATTERN,
      CHAT_REPLAY_PATTERN,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Invidious",
    onclick: () => switchWebsite(INVIDIOUS_URL),
    documentUrlPatterns: [YOUTUBE_PATTERN, PIPED_PATTERN, CHAT_REPLAY_PATTERN],
  });

  browser.contextMenus.create({
    title: "Switch to Chat Replay",
    onclick: () => switchWebsite(CHAT_REPLAY_URL),
    documentUrlPatterns: [YOUTUBE_PATTERN, PIPED_PATTERN, INVIDIOUS_PATTERN],
  });
};

browser.storage.onChanged.addListener(({ piped, invidious }) => {
  PIPED_URL = `https://${piped.newValue}/`;
  PIPED_PATTERN = `*://${piped.newValue}/watch?v=*`;

  INVIDIOUS_URL = `https://${invidious.newValue}/`;
  INVIDIOUS_PATTERN = `*://${invidious.newValue}/watch?v=*`;

  browser.contextMenus.removeAll();
  createContextMenus();
});

browser.commands.onCommand.addListener((command) => {
  if (command == "switch-youtube") {
    switchWebsite(YOUTUBE_URL);
  } else if (command === "switch-piped") {
    switchWebsite(PIPED_URL);
  } else if (command === "switch-invidious") {
    switchWebsite(INVIDIOUS_URL);
  } else if (command === "switch-chat-replay") {
    switchWebsite(CHAT_REPLAY_URL);
  }
});

const main = () => {
  getStorageSync();
  createContextMenus();
};

main();
