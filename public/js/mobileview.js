
// tracker icon changing
function on_picture() {
  var tracker = document.getElementById("tracker");
  var status = document.getElementById("status");
  console.log(name);
  var name = tracker.style.backgroundImage;
  tracker.style.backgroundImage = "url(\"assets/aruco-1023.svg\")";
  status.innerHTML = "ON";
  openFullscreen();
}

// tracker icon changing
function off_picture() {
  var tracker = document.getElementById("tracker");
  var status = document.getElementById("status");
  console.log(name);
  var name = tracker.style.backgroundImage;
  tracker.style.backgroundImage = "url(\"assets/aruco-220.svg\")";
  status.innerHTML = "OFF";
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
