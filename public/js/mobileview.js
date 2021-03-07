
// tracker icon changing
function on_picture() {
  document.getElementById("tracker").style.backgroundImage = "url(\"assets/aruco-220.svg\")";
  document.getElementById("status").innerHTML = "ON";
  //openFullscreen();
}

// tracker icon changing
function off_picture() {
  document.getElementById("tracker").style.backgroundImage = "url(\"assets/aruco-1023.svg\")";
  document.getElementById("status").innerHTML = "OFF";
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
