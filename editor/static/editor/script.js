"use strict";

// QUEUE
class Queue {
  constructor() {
    this.items = [];
  }

  // add element to the queue
  enqueue(element) {
    return this.items.push(element);
  }

  // remove element from the queue
  dequeue() {
    if (this.items.length > 0) {
      return this.items.shift();
    }
  }

  // view the first element
  peek() {
    return this.items[0];
  }

  // check if the queue is empty
  isEmpty() {
    return this.items.length == 0;
  }

  // the size of the queue
  size() {
    return this.items.length;
  }

  // empty the queue
  clear() {
    this.items = [];
  }
}

// To access root font variables
const root = document.querySelector("html");
const sliders = document.querySelectorAll(".slider");

// Update text property and displayed property value for each slider
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

// POST REQUEST FOR GET REULTS
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

// DARK MODE BUTTON
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

// Info button
const infoButton = document.getElementById("info-button");
const closeButton = document.querySelector(".close-button");
const modal = document.getElementById("modal");
infoButton.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

closeButton.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

// RESTART BUTTON
const restartButton = document.getElementById("restart-button");

// Default slider values
const defaultSliderValues = [160, 35, 1000, 1000, 1000, 1000, 1000];

restartButton.addEventListener("click", () => {
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
});

window.addEventListener("load", () => {
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
});

// Get h1 element
const target = document.body.querySelector(".typewrite");
const speed = target.getAttribute("data-speed");

// Constructing Queue
let listofPhrases = JSON.parse(target.getAttribute("data-type"));
let phrasesQueue = new Queue();
listofPhrases.forEach((phrase) => {
  phrasesQueue.enqueue(phrase);
});

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// Type effect onload
window.addEventListener("load", async () => {
  let phraseToType = phrasesQueue.peek();
  target.classList.toggle("typing");
  await typeOut(target, phraseToType, speed);
  target.classList.toggle("typing");
});

// Event listener for hover to play typewriter effect
target.addEventListener("mouseenter", async function () {
  if (!target.classList.contains("typing")) {
    target.classList.toggle("typing");
    await backSpace(target, speed, phrasesQueue);

    target.classList.toggle("typing");
  }
});

// Typewriter effect 2 components: backSpace and typeOut
async function backSpace(target, speed, phrasesQueue) {
  const originalWord = String(target.childNodes[0].nodeValue);
  for (let i = originalWord.length; i >= 1; i--) {
    let currentText = String(target.childNodes[0].nodeValue);
    target.childNodes[0].nodeValue = currentText.substring(0, i);
    await timer(speed);
  }

  let phraseToEnqueue = phrasesQueue.peek();
  phrasesQueue.dequeue();
  phrasesQueue.enqueue(phraseToEnqueue);

  let phraseToType = phrasesQueue.peek();
  await typeOut(target, phraseToType, speed);
}

async function typeOut(target, phrase, speed) {
  for (let i = 1; i < phrase.length + 1; i++) {
    target.childNodes[0].nodeValue = phrase.substring(0, i);
    await timer(speed);
  }
}
