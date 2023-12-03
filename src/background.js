browser = window.browser;

const YOUTUBE_URL = "https://www.youtube.com/";
const PIPED_URL = "https://piped.video/";
const INVIDIOUS_URL = "https://yewtu.be/";

const YOUTUBE_PATTERN = "*://*.youtube.com/watch?v=*";
const PIPED_PATTERN = "*://piped.video/watch?v=*";
const INVIDIOUS_PATTERN = "*://yewtu.be/watch?v=*";

const switchWebsite = (websiteUrl) => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const currentUrl = tabs[0].url;

    let query = getCurrentUrlQuery(currentUrl);
    if (query === "") {
      return;
    }

    let newUrl = websiteUrl + query;
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
  }
  return query;
};

browser.contextMenus.create({
  title: "Switch to YouTube",
  onclick: () => switchWebsite(YOUTUBE_URL),
  documentUrlPatterns: [INVIDIOUS_PATTERN, PIPED_PATTERN],
});

browser.contextMenus.create({
  title: "Switch to Piped",
  onclick: () => switchWebsite(PIPED_URL),
  documentUrlPatterns: [YOUTUBE_PATTERN, INVIDIOUS_PATTERN],
});

browser.contextMenus.create({
  title: "Switch to Invidious",
  onclick: () => switchWebsite(INVIDIOUS_URL),
  documentUrlPatterns: [YOUTUBE_PATTERN, PIPED_PATTERN],
});

browser.commands.onCommand.addListener((command) => {
  if (command == "switch-youtube") {
    switchWebsite(YOUTUBE_URL);
  } else if (command === "switch-piped") {
    switchWebsite(PIPED_URL);
  } else if (command === "switch-invidious") {
    switchWebsite(INVIDIOUS_URL);
  }
});
