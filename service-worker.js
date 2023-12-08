const REQUEST_ENDPOINT_PATTERN = "*://*.youtube.com/pagead/adview*";

// monitoring network requests
chrome.webRequest.onBeforeRequest.addListener(
  async ({ type, tabId }) => {
    const bannerAdsType = "image";

    if (type !== bannerAdsType) {
      console.info("is playing an ad");

      const tries = 10;
      const message = "skip-ad";

      sendMessageWithRetry({ tabId, message, tries });
    }
  },
  {
    urls: [REQUEST_ENDPOINT_PATTERN],
  }
);

const sendMessageWithRetry = async ({ tabId, message, tries }) => {
  try {
    if (!tabId || tries <= 0) {
      return;
    }

    console.info(`trying connection: ${tries}`);

    await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    const newTryNumber = tries - 1;

    console.error(`${error} \nretrying: ${newTryNumber}`);

    await sleep(200);
    sendMessageWithRetry({ tabId, message, tries: newTryNumber });
  }
};

const sleep = (sleepTime) => {
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
};
