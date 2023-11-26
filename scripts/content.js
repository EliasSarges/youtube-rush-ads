const AD_CONTAINER_QUERY = ".ytp-ad-skip-ad-slot";

window.onload = () => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message === "skip-ad") {
      console.info("skipping");

      const videoSpeed = 16;

      speedUpVideo(videoSpeed);

      const adsContainer = document.querySelector(AD_CONTAINER_QUERY);

      clickSkipButtonWhenAvailable(adsContainer);
    }
  });
};

const speedUpVideo = (playbackRate) => {
  const videoElement = document.querySelector("video");

  if (!videoElement) {
    return;
  }

  videoElement.playbackRate = playbackRate;
};

const clickSkipButtonWhenAvailable = (element) => {
  if (!element) {
    return;
  }

  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      const targetElement = mutation.target;

      if (targetElement.hasChildNodes()) {
        const buttonElement = targetElement.childNodes.item("button");

        if (buttonElement) {
          buttonElement.click();
          observer.disconnect();
        }
      }
    }
  });

  observer.observe(element, {
    attributeFilter: ["style"],
    attributes: true,
    subtree: true,
  });
};
