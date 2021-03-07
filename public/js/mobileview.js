
// tracker icon changing
function on_picture() {
  document.getElementById("tracker-off").style.display = "none";
  document.getElementById("tracker-on").style.display = "initial";
  document.getElementById("status").innerHTML = "ON";
}

// tracker icon changing
function off_picture() {
  document.getElementById("tracker-on").style.display = "none";
  document.getElementById("tracker-off").style.display = "initial";
  document.getElementById("status").innerHTML = "OFF";
}
