"use strict";

const browser = window.browser;

let urls = {
  youtube: "https://www.youtube.com/",
  chatReplay: "https://chatreplay.stream/",
  piped: "https://piped.video/",
  invidious: "https://yewtu.be/",
};

let patterns = {
  youtube: "*://*.youtube.com/watch?v=*",
  chatReplay: "*://chatreplay.stream/videos/*",
  piped: "*://piped.video/watch?v=*",
  invidious: "*://yewtu.be/watch?v=*",
};

const getStorageSync = async () => {
  const setPiped = ({ piped }) => {
    if (piped !== undefined) {
      urls.piped = `https://${piped}/`;
      patterns.piped = `*://${piped}/watch?v=*`;
    }
  };

  const setInvidious = ({ invidious }) => {
    if (invidious !== undefined) {
      urls.invidious = `https://${invidious}/`;
      patterns.invidious = `*://${invidious}/watch?v=*`;
    }
  };

  try {
    const getPiped = browser.storage.sync.get("piped");
    const getInvidious = browser.storage.sync.get("invidious");

    const pipedResult = await getPiped;
    const invidiousResult = await getInvidious;

    setPiped(pipedResult);
    setInvidious(invidiousResult);

    createContextMenus();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
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

  if (currentUrl.includes(urls.youtube)) {
    query = currentUrl.split(urls.youtube)[1];
  } else if (currentUrl.includes(urls.piped)) {
    query = currentUrl.split(urls.piped)[1];
  } else if (currentUrl.includes(urls.invidious)) {
    query = currentUrl.split(urls.invidious)[1];
  } else if (currentUrl.includes(urls.chatReplay)) {
    const chatReplaySplitUrl = `${urls.chatReplay}videos/`;
    query = `watch?v=${currentUrl.split(chatReplaySplitUrl)[1]}`;
  }

  return query;
};

const createContextMenus = () => {
  browser.contextMenus.create({
    title: "Switch to YouTube",
    onclick: () => switchWebsite(urls.youtube),
    documentUrlPatterns: [
      patterns.piped,
      patterns.invidious,
      patterns.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Piped",
    onclick: () => switchWebsite(urls.piped),
    documentUrlPatterns: [
      patterns.youtube,
      patterns.invidious,
      patterns.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Invidious",
    onclick: () => switchWebsite(urls.invidious),
    documentUrlPatterns: [
      patterns.youtube,
      patterns.piped,
      patterns.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Chat Replay",
    onclick: () => switchWebsite(urls.chatReplay),
    documentUrlPatterns: [patterns.youtube, patterns.piped, patterns.invidious],
  });
};

browser.storage.onChanged.addListener(({ piped, invidious }) => {
  urls.piped = `https://${piped.newValue}/`;
  patterns.piped = `*://${piped.newValue}/watch?v=*`;

  urls.invidious = `https://${invidious.newValue}/`;
  patterns.invidious = `*://${invidious.newValue}/watch?v=*`;

  browser.contextMenus.removeAll();
  createContextMenus();
});

browser.commands.onCommand.addListener((command) => {
  if (command == "switch-youtube") {
    switchWebsite(urls.youtube);
  } else if (command === "switch-piped") {
    switchWebsite(urls.piped);
  } else if (command === "switch-invidious") {
    switchWebsite(urls.invidious);
  } else if (command === "switch-chat-replay") {
    switchWebsite(urls.chatReplay);
  }
});

const main = () => {
  getStorageSync();
};

main();
