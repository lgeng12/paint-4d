
function fullScreenCheck() {
  if (document.fullscreenElement) return;
  return document.documentElement.requestFullscreen();
}

function updateDetails(lockButton) {
  const buttonOrientation = getOrientation();
  lockButton.textContent = `Lock to ${buttonOrientation}`;
}

function getOrientation() {
  // const { type } = screen.orientation;
  // return type.startsWith("portrait") ? "landscape" : "portrait";
  return "portrait";
}

async function rotate(lockButton) {
  try {
    await fullScreenCheck();
  } catch (err) {
    console.error(err);
  }
  const newOrientation = getOrientation();
  await screen.orientation.lock(newOrientation);
  updateDetails(lockButton);
}

function show() {
  const { type, angle } = screen.orientation;
  console.log(`Orientation type is ${type} & angle is ${angle}.`);
}

screen.orientation.addEventListener("change", () => {
  show();
  updateDetails(document.getElementById("button"));
});

window.addEventListener("load", () => {
  show();
  updateDetails(document.getElementById("button"));
});


// icon changing
function change_picture() {
  var tracker = document.getElementById("tracker");
  console.log(name);
  var name = tracker.style.backgroundImage;
  tracker.style.backgroundImage = name.endsWith("assets/aruco-220.svg\")") ? "url(\"assets/aruco-1023.svg\")" : "url(\"assets/aruco-220.svg\")";
  tracker.innerHTML = name.endsWith("assets/aruco-220.svg\")") ? "OFF" : "ON";
}

