
// var keyDownHandler = function(evt) {
//   if (evt.key === 'VolumeDown') {
//     alert("hello " + 1);
//     // process logic of volume-down
//   } else if (evt.key === 'VolumeUp') {
//     // process logic of volume-up
//     console.log("hello " + 0);
//   }
//   evt.preventDefault(); // to stop system app from processing keydown event
// };

// window.addEventListener('keydown', keyDownHandler);

const video = document.createElement('video');

video.onvolumechange = (event) => {
  alert('The volume changed.');
};