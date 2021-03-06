
var keyDownHandler = function(evt) {
  if (evt.key === 'VolumeDown') {
    console.log("hello " + 1);
    document.getElementById('volume_button').value = 1;
    // process logic of volume-down
  } else if (evt.key === 'VolumeUp') {
    // process logic of volume-up
    console.log("hello " + 0);
    document.getElementById('volume_button').value = 0;
  }
  evt.preventDefault(); // to stop system app from processing keydown event
};

window.addEventListener('keydown', keyDownHandler);