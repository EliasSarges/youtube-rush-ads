const VIEW_ADS_REQUEST_ENDPOINT = "*://*.youtube.com/pagead/adview*";

// monitoring network requests
chrome.webRequest.onBeforeRequest.addListener(
  ({ type }) => {
    const bannerAdsType = "image";

    // is playing an ads video
    if (type !== bannerAdsType) {
      console.log("playing");
    }
  },
  {
    urls: [VIEW_ADS_REQUEST_ENDPOINT],
  }
);
