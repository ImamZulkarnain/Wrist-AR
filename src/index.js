import * as deepar from "deepar";
import Carousel from "./carousel.js";

// Log the version. Just in case.
// console.log("Deepar version: " + deepar.version);

// Top-level await is not supported.
// So we wrap the whole code in an async function that is called immediatly.
(async function () {
  // Get the element you want to place DeepAR into. DeepAR will inherit its width and height from this and fill it.
  const previewElement = document.getElementById("ar-screen");

  // trigger loading progress bar animation
  const loadingProgressBar = document.getElementById("loading-progress-bar");
  loadingProgressBar.style.width = "100%";

  // All the effects are in the public/effects folder.
  // Here we define the order of effect files.
  const effectList = [
    "effects/WRISTI.deepar",
    "effects/WristWatch.deepar"
  ];

  const effectNames = [
    "Analog Watch 1",
    "Digital watch 1"
  ]

  let deepAR = null;

  // Initialize DeepAR with an effect file.
  try {
    deepAR = await deepar.initialize({
      licenseKey: "165a5a087fc790606486beb51137b5286cd1d45f70456244a8bb54b96c219a7c5d91303eb3a3014246db28c19b7ddbf9cc6240662fb5874702920d1621345690e064c0809cb36efd7705ed73a0f9b04d",
      previewElement,
      effect: effectList[0],
      // Removing the rootPath option will make DeepAR load the resources from the JSdelivr CDN,
      // which is fine for development but is not recommended for production since it's not optimized for performance and can be unstable.
      // More info here: https://docs.deepar.ai/deepar-sdk/deep-ar-sdk-for-web/download-optimizations#custom-deployment-of-deepar-web-resources
      // rootPath: "./deepar-resources",
      additionalOptions: {
        cameraConfig: {
          facingMode: 'environment'  // uncomment this line to use the rear camera
        },
      },
    });
  } catch (error) {
    console.error(error);
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("permission-denied-screen").style.display = "block";
    return;
  }

  // Hide the loading screen.
  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("ar-screen").style.display = "block";

  window.effect = effectList[0];

  const glassesCarousel = new Carousel("carousel");
  glassesCarousel.onChange = async (value) => {
    const loadingSpinner = document.getElementById("loading-spinner");

    // update effectTitle
    document.getElementById("effect-title").innerHTML = effectNames[value];

    if (window.effect !== effectList[value]) {
      loadingSpinner.style.display = "block";
      await deepAR.switchEffect(effectList[value]);
      window.effect = effectList[value];
    }
    loadingSpinner.style.display = "none";
  };
})();
