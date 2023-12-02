window.browser = window.browser || window.chrome;

const YOUTUBE_URL = "https://www.youtube.com/";
const INVIDIOUS_URL = "https://yewtu.be/";
const PIPED_URL = "https://piped.video/";

const YOUTUBE_PATTERN = "*://*.youtube.com/*";
const INVIDIOUS_PATTERN = "*://yewtu.be/*";
const PIPED_PATTERN = "*://piped.video/*";

window.browser.contextMenus.create({
  title: "Switch to YouTube",
  onclick: switchYouTube,
  documentUrlPatterns: [INVIDIOUS_PATTERN, PIPED_PATTERN],
});

window.browser.contextMenus.create({
  title: "Switch to Invidious",
  onclick: switchInvidious,
  documentUrlPatterns: [YOUTUBE_PATTERN, PIPED_PATTERN],
});

window.browser.contextMenus.create({
  title: "Switch to Piped",
  onclick: switchPiped,
  documentUrlPatterns: [YOUTUBE_PATTERN, INVIDIOUS_PATTERN],
});

function switchYouTube(info) {
  const currentUrl = info.pageUrl;

  let query = getCurrentUrlQuery(currentUrl);
  let newUrl = YOUTUBE_URL + query;

  browser.tabs.update({
    url: newUrl,
  });
}

function switchInvidious(info) {
  const currentUrl = info.pageUrl;

  let query = getCurrentUrlQuery(currentUrl);
  let newUrl = INVIDIOUS_URL + query;

  browser.tabs.update({
    url: newUrl,
  });
}

function switchPiped(info) {
  const currentUrl = info.pageUrl;

  let query = getCurrentUrlQuery(currentUrl);
  let newUrl = PIPED_URL + query;

  browser.tabs.update({
    url: newUrl,
  });
}

function getCurrentUrlQuery(currentUrl) {
  let query = "";
  if (currentUrl.includes(YOUTUBE_URL)) {
    query = currentUrl.split(YOUTUBE_URL)[1];
    return query;
  } else if (currentUrl.includes(INVIDIOUS_URL)) {
    query = currentUrl.split(INVIDIOUS_URL)[1];
    return query;
  } else if (currentUrl.includes(PIPED_URL)) {
    query = currentUrl.split(PIPED_URL)[1];
    return query;
  }
}
