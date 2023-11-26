const REQUEST_ENDPOINT_PATTERN = "*://*.youtube.com/pagead/adview*";

// monitoring network requests
chrome.webRequest.onBeforeRequest.addListener(
  async ({ type }) => {
    const bannerAdsType = "image";

    if (type !== bannerAdsType) {
      console.info("is playing an ad");

      const retries = 5;
      const message = "skip-ad";

      sendMessageWithRetry(message, retries);
    }
  },
  {
    urls: [REQUEST_ENDPOINT_PATTERN],
  }
);

const sendMessageWithRetry = async (message, tries) => {
  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (activeTab) {
      if (tries <= 0) {
        return;
      }

      console.info(`trying connection: ${tries}`);

      await chrome.tabs.sendMessage(activeTab.id, message);
    }
  } catch (error) {
    const newTryNumber = (tries = tries - 1);

    console.error(`${error} \nretrying: ${newTryNumber}`);

    await sleep(200);

    sendMessageWithRetry(message, newTryNumber);
  }
};

const sleep = (sleepTime) => {
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
};
