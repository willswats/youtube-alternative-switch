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
  if (query === "" || query === undefined) {
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

const switchWebsiteOnTab = async (websiteUrl) => {
  try {
    const getTabs = browser.tabs.query({ currentWindow: true, active: true });
    const tabsResult = await getTabs;

    const currentUrl = tabsResult[0].url;

    const newUrl = getNewWebsiteUrl(currentUrl, websiteUrl);

    browser.tabs.update({
      url: newUrl,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const getCurrentUrlQuery = (currentUrl) => {
  let query = "";

  if (currentUrl.includes(urls.youtube)) {
    if (!currentUrl.includes("watch?v=")) {
      return;
    }

    query = currentUrl.split(urls.youtube)[1];
  } else if (currentUrl.includes(urls.piped)) {
    if (!currentUrl.includes("watch?v=")) {
      return;
    }

    query = currentUrl.split(urls.piped)[1];
  } else if (currentUrl.includes(urls.invidious)) {
    if (!currentUrl.includes("watch?v=")) {
      return;
    }

    query = currentUrl.split(urls.invidious)[1];
  } else if (currentUrl.includes(urls.chatReplay)) {
    if (!currentUrl.includes("/videos/")) {
      return;
    }

    const chatReplaySplitUrl = `${urls.chatReplay}videos/`;
    query = `watch?v=${currentUrl.split(chatReplaySplitUrl)[1]}`;
  }

  return query;
};

const createContextMenusOnVideo = () => {
  browser.contextMenus.create({
    title: "Switch Current Tab to YouTube",
    onclick: () => switchWebsiteOnTab(urls.youtube),
    documentUrlPatterns: [
      patternsWatch.piped,
      patternsWatch.invidious,
      patternsWatch.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch Current Tab to Piped",
    onclick: () => switchWebsiteOnTab(urls.piped),
    documentUrlPatterns: [
      patternsWatch.youtube,
      patternsWatch.invidious,
      patternsWatch.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch Current Tab to Invidious",
    onclick: () => switchWebsiteOnTab(urls.invidious),
    documentUrlPatterns: [
      patternsWatch.youtube,
      patternsWatch.piped,
      patternsWatch.chatReplay,
    ],
  });

  browser.contextMenus.create({
    title: "Switch Current Tab to Chat Replay",
    onclick: () => switchWebsiteOnTab(urls.chatReplay),
    documentUrlPatterns: [
      patternsWatch.youtube,
      patternsWatch.piped,
      patternsWatch.invidious,
    ],
  });
};

const createContextMenuOnLink = (title, pattern, websiteUrl) => {
  browser.contextMenus.create({
    title: title,
    documentUrlPatterns: [pattern],
    contexts: ["link"],
    onclick(info, tab) {
      if (
        pattern === patterns.youtube ||
        pattern === patterns.piped ||
        pattern === patterns.invidious
      ) {
        if (!info.linkUrl.includes("watch?v=")) {
          return;
        }
      } else if (pattern === patterns.chatReplay) {
        if (!info.linkUrl.includes("/videos/")) {
          return;
        }
      }

      browser.tabs.create({
        index: tab.index + 1,
        url: getNewWebsiteUrl(info.linkUrl, websiteUrl),
      });
    },
  });
};

const createContextMenusOnLinksYouTube = (
  pipedTitle,
  invidiousTitle,
  chatReplayTitle,
) => {
  createContextMenuOnLink(pipedTitle, patterns.youtube, urls.piped);
  createContextMenuOnLink(invidiousTitle, patterns.youtube, urls.invidious);
  createContextMenuOnLink(chatReplayTitle, patterns.youtube, urls.chatReplay);
};

const createContextMenusOnLinksPiped = (
  youtubeTitle,
  invidiousTitle,
  chatReplayTitle,
) => {
  createContextMenuOnLink(youtubeTitle, patterns.piped, urls.youtube);
  createContextMenuOnLink(invidiousTitle, patterns.piped, urls.invidious);
  createContextMenuOnLink(chatReplayTitle, patterns.piped, urls.chatReplay);
};

const createContextMenusOnLinksInvidious = (
  youtubeTitle,
  pipedTitle,
  chatReplayTitle,
) => {
  createContextMenuOnLink(youtubeTitle, patterns.invidious, urls.youtube);
  createContextMenuOnLink(pipedTitle, patterns.invidious, urls.piped);
  createContextMenuOnLink(chatReplayTitle, patterns.invidious, urls.chatReplay);
};

const createContextMenusOnLinksChatReplay = (
  youtubeTitle,
  pipedTitle,
  invidiousTitle,
) => {
  createContextMenuOnLink(youtubeTitle, patterns.chatReplay, urls.youtube);
  createContextMenuOnLink(pipedTitle, patterns.chatReplay, urls.piped);
  createContextMenuOnLink(invidiousTitle, patterns.chatReplay, urls.invidious);
};

const createContextMenus = () => {
  const youtubeTitleOnLinks = "Open Link in New YouTube Tab";
  const pipedTitleOnLinks = "Open Link in New Piped Tab";
  const invidiousTitleOnLinks = "Open Link in New Invidious Tab";
  const chatReplayTitleOnLinks = "Open Link in New Chat Replay Tab";

  createContextMenusOnLinksYouTube(
    pipedTitleOnLinks,
    invidiousTitleOnLinks,
    chatReplayTitleOnLinks,
  );
  createContextMenusOnLinksPiped(
    youtubeTitleOnLinks,
    invidiousTitleOnLinks,
    chatReplayTitleOnLinks,
  );
  createContextMenusOnLinksInvidious(
    youtubeTitleOnLinks,
    pipedTitleOnLinks,
    chatReplayTitleOnLinks,
  );
  createContextMenusOnLinksChatReplay(
    youtubeTitleOnLinks,
    pipedTitleOnLinks,
    invidiousTitleOnLinks,
  );
  createContextMenusOnVideo();
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
