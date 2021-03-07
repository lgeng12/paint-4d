
// tracker icon changing
function on_picture() {
  document.getElementById("tracker").style.backgroundImage = "url(\"assets/aruco-220.svg\")";
  document.getElementById("status").innerHTML = "ON";
}

// tracker icon changing
function off_picture() {
  document.getElementById("tracker").style.backgroundImage = "url(\"assets/aruco-1023.svg\")";
  document.getElementById("status").innerHTML = "OFF";
}
