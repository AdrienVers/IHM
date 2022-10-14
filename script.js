let doorState = document.querySelector(".door-state");
let closeSensorState = document.querySelector(".close-sensor-state");
let openSensorState = document.querySelector(".open-sensor-state");
let gyrophareState = document.querySelector(".gyro");
let doorRight = document.querySelector(".flip-right");
let doorLeft = document.querySelector(".flip-left");
let running = false;
let secInput = 20;
let seconds = secInput;
let step = 1;

// const sec = document.getElementById("sec");
const openButton = document.querySelector(".open-button");
const closeButton = document.querySelector(".close-button");
const emergencyButton = document.querySelector(".emergency-button");

function openButtonNotClickable() {
  openButton.setAttribute("disabled", true);
  openButton.style.cursor = "not-allowed";
  openButton.style.color = "grey";

  closeButton.removeAttribute("disabled");
  closeButton.style.cursor = "pointer";
  closeButton.style.color = "black";
}

function closeButtonNotClickable() {
  openButton.removeAttribute("disabled");
  openButton.style.cursor = "pointer";
  openButton.style.color = "black";

  closeButton.setAttribute("disabled", true);
  closeButton.style.cursor = "not-allowed";
  closeButton.style.color = "grey";
}

function openCloseButtonsNotClickable() {
  openButton.setAttribute("disabled", true);
  openButton.style.cursor = "not-allowed";
  openButton.style.color = "grey";

  closeButton.setAttribute("disabled", true);
  closeButton.style.cursor = "not-allowed";
  closeButton.style.color = "grey";
}

function doorStateGreenColor() {
  gyrophareState.style.animationName = "no-tick";
  doorState.style.color = "green";
  doorState.style.fontSize = "1.2rem";
}

function doorStateOrangeColor() {
  doorState.style.color = "orange";
  doorState.style.fontSize = "1.3rem";
  gyrophareState.style.animationName = "tick";
}

function doorStateRedColor() {
  doorState.style.color = "red";
  doorState.style.fontSize = "1.3rem";
  doorState.style.fontSize = "bold";
}

function initTimer(step = 1) {
  let intervalId = null;
  function startTimer() {
    if (!intervalId) {
      intervalId = setInterval(() => {
        seconds -= step;
        // sec.innerText = seconds.toString().padStart(2, "0");
        if (
          doorState.innerText ===
          ("FERMÉE" || "EN COURS D'OUVERTURE" || "ARRÊTÉE")
        ) {
          openCountdown();
        } else if (
          doorState.innerText ===
          ("OUVERTE" || "EN COURS DE FERMETURE" || "ARRÊTÉE")
        ) {
          closeCountdown();
        }

        if (seconds === 0) {
          stopTimer();
          if (doorState.innerText === "OUVERTE") {
            openButtonNotClickable();
            openSensorState.innerText = "ON";
            closeSensorState.innerText = "OFF";
          } else if (doorState.innerText === "FERMÉE") {
            closeButtonNotClickable();
            openSensorState.innerText = "OFF";
            closeSensorState.innerText = "ON";
          }
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    if (!intervalId) startTimer();
    else {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    seconds = secInput;
    // sec.innerText = seconds.toString().padStart(2, "0");
    console.log("stop");

    if (doorState.innerText === "EN COURS D'OUVERTURE") {
      doorState.innerText = "OUVERTE";
      doorStateGreenColor();
    } else if (doorState.innerText === "EN COURS DE FERMETURE") {
      doorState.innerText = "FERMÉE";
      doorStateGreenColor();
    }
  }

  return { startTimer, pauseTimer, stopTimer };
}

function emergency() {
  if (doorState.innerText === "EN COURS D'OUVERTURE") {
    doorState.innerText = "ARRÊTÉE À L'OUVERTURE";
    doorStateRedColor();
  } else if (doorState.innerText === "EN COURS DE FERMETURE") {
    doorState.innerText = "ARRÊTÉE À LA FERMETURE";
    doorStateRedColor();
  } else if (doorState.innerText === "OUVERTE") {
    doorState.innerText = "ARRÊTÉE EN POSITION OUVERTE";
    doorStateRedColor();
  } else if (doorState.innerText === "FERMÉE") {
    doorState.innerText = "ARRÊTÉE EN POSITION FERMÉE";
    doorStateRedColor();
  }

  if (emergencyButton.innerText === "RÉARMER") {
    gyrophareState.style.animationName = "tick-emergency";
  } else if (emergencyButton.innerText === "ARRÊT D'URGENCE") {
    gyrophareState.style.animationName = "emergency";
  }

  if (!running) {
    doorLeft.classList.add("transition");
    doorRight.classList.add("transition");
  } else {
    var computedStyleLeft = window.getComputedStyle(doorLeft),
      transformLeft = computedStyleLeft.getPropertyValue("transform");
    doorLeft.style.transform = transformLeft;

    var computedStyleRight = window.getComputedStyle(doorRight),
      transformRight = computedStyleRight.getPropertyValue("transform");
    doorRight.style.transform = transformRight;

    doorLeft.classList.remove("transition");
    doorRight.classList.remove("transition");
  }

  running = !running;
}

function toggleTransition() {
  doorRight.classList.add("transition");
  doorLeft.classList.add("transition");
}

function openCountdown() {
  running = true;
  toggleTransition();
  doorStateOrangeColor();
  doorState.innerText = "EN COURS D'OUVERTURE";
  doorLeft.style.transform = "rotateY(-90deg)";
  doorRight.style.transform = "rotateY(90deg)";
  doorLeft.style.transitionTimingFunction = "";
  doorRight.style.transitionTimingFunction = "";
  openSensorState.innerText = "OFF";
  closeSensorState.innerText = "OFF";
  openCloseButtonsNotClickable();
}

function closeCountdown() {
  running = true;
  toggleTransition();
  doorStateOrangeColor();
  doorState.innerText = "EN COURS DE FERMETURE";
  doorLeft.style.transform = "rotateY(0deg)";
  doorRight.style.transform = "rotateY(0deg)";
  doorLeft.style.transitionTimingFunction = "cubic-bezier(.87,.54,.71,1.04)";
  doorRight.style.transitionTimingFunction = "cubic-bezier(.87,.54,.71,1.04)";
  openSensorState.innerText = "OFF";
  closeSensorState.innerText = "OFF";
  openCloseButtonsNotClickable();
}

const timerObj = initTimer(step);

openButton.addEventListener("click", () => {
  openCountdown();
  timerObj.startTimer();
});

closeButton.addEventListener("click", () => {
  closeCountdown();
  timerObj.startTimer();
});

emergencyButton.addEventListener("click", () => {
  if (emergencyButton.innerText === "ARRÊT D'URGENCE") {
    emergencyButton.innerText = "RÉARMER";
    emergencyButton.style.backgroundColor = "rgb(0, 185, 0)";

    openCloseButtonsNotClickable();
    if (doorState.innerText === "FERMÉE" || doorState.innerText === "OUVERTE") {
      timerObj.stopTimer();
    } else if (
      doorState.innerText === "EN COURS DE FERMETURE" ||
      doorState.innerText === "EN COURS D'OUVERTURE"
    ) {
      timerObj.pauseTimer();
    }

    emergency();
  } else {
    emergencyButton.innerText = "ARRÊT D'URGENCE";
    emergencyButton.style.backgroundColor = "red";

    if (doorState.innerText === "FERMÉE" || doorState.innerText === "OUVERTE") {
      timerObj.stopTimer();
    } else if (
      doorState.innerText === "EN COURS DE FERMETURE" ||
      doorState.innerText === "EN COURS D'OUVERTURE"
    ) {
      timerObj.pauseTimer();
    }

    emergency();
    if (doorState.innerText === "ARRÊTÉE EN POSITION FERMÉE") {
      closeButtonNotClickable();
    } else if (doorState.innerText === "ARRÊTÉE EN POSITION OUVERTE") {
      openButtonNotClickable();
    } else if (doorState.innerText === "ARRÊTÉE À L'OUVERTURE") {
      closeButtonNotClickable();
    } else if (doorState.innerText === "ARRÊTÉE À LA FERMETURE") {
      openButtonNotClickable();
    }
  }
});
