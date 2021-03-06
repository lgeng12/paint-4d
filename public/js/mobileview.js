
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


function change_picture() {
  let name = document.getElementById("icon").src;
  alert(name);
  document.getElementById("icon").src = (name.endsWith("assets/aruco-1023.svg") ? "assets/aruco-1023.svg" : "assets/aruco-220.svg");
}