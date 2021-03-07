
// tracker icon changing
function change_picture() {
  var tracker = document.getElementById("tracker");
  var status = document.getElementById("status");
  console.log(name);
  var name = tracker.style.backgroundImage;
  tracker.style.backgroundImage = name.endsWith("assets/aruco-220.svg\")") ? "url(\"assets/aruco-1023.svg\")" : "url(\"assets/aruco-220.svg\")";
  status.innerHTML = name.endsWith("assets/aruco-220.svg\")") ? "OFF" : "ON";
  openFullscreen();
}

// Open fullscreen
function openFullscreen() {
  var doc = document.documentElement;
  if (doc.requestFullscreen) {
    doc.requestFullscreen();
  } else if (doc.webkitRequestFullscreen) { /* Safari */
    doc.webkitRequestFullscreen();
  }
}
