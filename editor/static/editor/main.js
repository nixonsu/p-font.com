const root = document.querySelector("html");
const sliders = document.querySelectorAll(".slider");
const restartButton = document.getElementById("restart-button");
const defaultSliderValues = [160, 35, 1000, 1000, 1000, 1000, 1000];

// Onload -> set slider values to default
window.addEventListener("load", setDefaultSliderValues);

// Restart Button -> set all slider values to default
restartButton.addEventListener("click", setDefaultSliderValues);

// Sliders -> reflect slider values in CSS
sliders.forEach((slider) => {
  const sliderIndex = slider.getAttribute("data-slider-index");

  slider.oninput = function () {
    if (sliderIndex <= 1) {
      root.style.setProperty(`--${this.id}`, `${this.value}px`);
    } else {
      root.style.setProperty(`--${this.id}`, `${this.value}`);
    }
  };
});

function setDefaultSliderValues() {
  sliders.forEach((slider) => {
    const sliderIndex = slider.getAttribute("data-slider-index");
    slider.value = defaultSliderValues[sliderIndex];
    if (sliderIndex <= 1) {
      root.style.setProperty(
        `--${slider.id}`,
        `${defaultSliderValues[sliderIndex]}px`
      );
    } else {
      root.style.setProperty(
        `--${slider.id}`,
        `${defaultSliderValues[sliderIndex]}`
      );
    }
  });
}

// Dark/Light Mode Button -> sets CSS text/background colour properties
const darkModeButton = document.getElementById("theme-button");
const infoIconBlack = document.querySelector("#info-icon-black");
const infoIconWhite = document.querySelector("#info-icon-white");

darkModeButton.addEventListener("click", () => {
  infoIconWhite.classList.toggle("hide");
  infoIconBlack.classList.toggle("hide");
  root.classList.toggle("dark-mode");
  if (root.classList.contains("dark-mode")) {
    root.style.setProperty("--bg-color", "#181818");
    root.style.setProperty("--text-color", "white");
  } else if (!root.classList.contains("dark-mode")) {
    root.style.setProperty("--bg-color", "#ecedeb");
    root.style.setProperty("--text-color", "black");
  }
});

// Information Modal -> displays/hides modal
const infoButton = document.getElementById("info-button");
const closeButton = document.querySelector(".close-button");
const modal = document.getElementById("modal");
infoButton.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

closeButton.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

// Get Results Button -> sends POST request to results app
const getResultsButton = document.getElementById("get-results-button");
getResultsButton.addEventListener("click", async () => {
  let fontobj = {};
  sliders.forEach((slider) => {
    // If slider hasn't been changed
    if (root.style.getPropertyValue(`--${slider.id}`) === "") {
      let indexOfName = names.indexOf(slider.id);
      // If slider pertains to variable requiring a 'px' suffix
      if (slider.id === "font-size" || slider.id === "word-spacing") {
        fontobj[slider.id] = {
          value: `${defaultSliderValues[indexOfName]}px`,
          min: `${slider.min}`,
          max: `${slider.max}`,
          percentage: `${Math.round(
            ((slider.value - slider.min) / (slider.max - slider.min)) * 100
          )}`,
        };
      } else {
        fontobj[slider.id] = {
          value: `${defaultSliderValues[indexOfName]}`,
          min: `${slider.min}`,
          max: `${slider.max}`,
          percentage: `${Math.round(
            ((slider.value - slider.min) / (slider.max - slider.min)) * 100
          )}`,
        };
      }
    } else {
      fontobj[slider.id] = {
        value: root.style.getPropertyValue(`--${slider.id}`),
        min: `${slider.min}`,
        max: `${slider.max}`,
        percentage: `${Math.round(
          ((slider.value - slider.min) / (slider.max - slider.min)) * 100
        )}`,
      };
    }
  });

  let text = document.querySelector("#textbox").textContent;
  fontobj["content"] = text;

  console.log(fontobj);

  try {
    let response = await fetch("/render-css", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fontobj),
    });

    if (response.ok) {
      window.open("/results", "_blank");
      return "ok";
    }
  } catch (error) {
    console.log(error);
  }
});

// // GET/POST REQUEST FOR GENERATING STATIC FONT
// const staticFontButton = document.getElementById("generate-font-button");

// staticFontButton.addEventListener("click", () => {
//   let variable_font_values = {};
//   sliders.forEach((slider) => {
//     if (slider.name.length <= 4) {
//       variable_font_values[slider.name] = parseInt(slider.value);
//     }
//   });

//   var req = new XMLHttpRequest();
//   let method = "POST";
//   let url = "/create";

//   req.open(method, url, true);
//   req.setRequestHeader("Content-Type", "application/json");
//   req.onload = function () {
//     console.log(this.responseText);
//     window.location.href = "/download";
//   };
//   req.send(
//     JSON.stringify({
//       variable_font_values,
//     })
//   );

//   console.log(variable_font_values);
// });
