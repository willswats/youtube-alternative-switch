"use strict";

const browser = window.browser;

let urls = {
  youtube: "https://www.youtube.com/",
  chatReplay: "https://chatreplay.stream/",
  piped: "https://piped.video/",
  invidious: "https://yewtu.be/",
};

let patterns = {
  youtube: "*://*.youtube.com/*",
  chatReplay: "*://chatreplay.stream/*",
  piped: "*://piped.video/*",
  invidious: "*://yewtu.be/*",
};

let patternsWatch = {
  youtube: "*://*.youtube.com/watch?v=*",
  chatReplay: "*://chatreplay.stream/videos/*",
  piped: "*://piped.video/watch?v=*",
  invidious: "*://yewtu.be/watch?v=*",
};

const getStorageSync = async () => {
  const setPiped = ({ piped }) => {
    if (piped !== undefined) {
      urls.piped = `https://${piped}/`;
      patterns.piped = `*://${piped}/*`;
      patternsWatch.piped = `*://${piped}/watch?v=*`;
    }
  };

  const setInvidious = ({ invidious }) => {
    if (invidious !== undefined) {
      urls.invidious = `https://${invidious}/`;
      patterns.invidious = `*://${invidious}/*`;
      patternsWatch.invidious = `*://${invidious}/watch?v=*`;
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

const getNewWebsiteUrl = (currentUrl, websiteUrl) => {
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

  return newUrl;
};

const switchWebsiteOnTab = (websiteUrl) => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const currentUrl = tabs[0].url;

    const newUrl = getNewWebsiteUrl(currentUrl, websiteUrl);

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

const createContextMenusOnVideo = () => {
  browser.contextMenus.create({
    title: "Switch to YouTube",
    onclick: () => switchWebsiteOnTab(urls.youtube),
    documentUrlPatterns: [
      patternsWatch.piped,
      patternsWatch.invidious,
      patternsWatch.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Piped",
    onclick: () => switchWebsiteOnTab(urls.piped),
    documentUrlPatterns: [
      patternsWatch.youtube,
      patternsWatch.invidious,
      patternsWatch.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Invidious",
    onclick: () => switchWebsiteOnTab(urls.invidious),
    documentUrlPatterns: [
      patternsWatch.youtube,
      patternsWatch.piped,
      patternsWatch.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch to Chat Replay",
    onclick: () => switchWebsiteOnTab(urls.chatReplay),
    documentUrlPatterns: [
      patternsWatch.youtube,
      patternsWatch.piped,
      patternsWatch.invidious,
    ],
  });
};

const createContextMenusOnLinksYouTube = () => {
  browser.contextMenus.create({
    title: "Open in Piped",
    documentUrlPatterns: [patterns.youtube],
    contexts: ["link"],
    onclick(info, tab) {
      browser.tabs.create({
        index: tab.index + 1,
        url: getNewWebsiteUrl(info.linkUrl, urls.piped),
      });
    },
  });

  browser.contextMenus.create({
    title: "Open in Invidious",
    documentUrlPatterns: [patterns.youtube],
    contexts: ["link"],
    onclick(info, tab) {
      browser.tabs.create({
        index: tab.index + 1,
        url: getNewWebsiteUrl(info.linkUrl, urls.invidious),
      });
    },
  });

  browser.contextMenus.create({
    title: "Open in Chat Replay",
    documentUrlPatterns: [patterns.youtube],
    contexts: ["link"],
    onclick(info, tab) {
      browser.tabs.create({
        index: tab.index + 1,
        url: getNewWebsiteUrl(info.linkUrl, urls.chatReplay),
      });
    },
  });
};

const createContextMenus = () => {
  createContextMenusOnVideo();
  createContextMenusOnLinksYouTube();
};

browser.storage.onChanged.addListener(({ piped, invidious }) => {
  urls.piped = `https://${piped.newValue}/`;
  patterns.piped = `*://${piped.newValue}/*`;
  patternsWatch.piped = `*://${piped.newValue}/watch?v=*`;

  urls.invidious = `https://${invidious.newValue}/`;
  patterns.invidious = `*://${invidious.newValue}/*`;
  patternsWatch.invidious = `*://${invidious.newValue}/watch?v=*`;

  browser.contextMenus.removeAll();
  createContextMenus();
});

browser.commands.onCommand.addListener((command) => {
  if (command == "switch-youtube") {
    switchWebsiteOnTab(urls.youtube);
  } else if (command === "switch-piped") {
    switchWebsiteOnTab(urls.piped);
  } else if (command === "switch-invidious") {
    switchWebsiteOnTab(urls.invidious);
  } else if (command === "switch-chat-replay") {
    switchWebsiteOnTab(urls.chatReplay);
  }
});

const main = () => {
  getStorageSync();
};

main();
