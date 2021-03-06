var video, canvas, context, imageData, detector, posit;
var pose;
var modelSize = 50.0; //millimeters

function onLoad() {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  canvas.width = 1280;
  canvas.height = 720;

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  navigator.mediaDevices
    .getUserMedia({ video: { width: 1280, height: 720 } })
    .then(function(stream) {
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });

  detector = new AR.Detector();
  posit = new POS.Posit(modelSize, canvas.width);

  requestAnimationFrame(tick);
}

function tick() {
  requestAnimationFrame(tick);

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    snapshot();

    var markers = detector.detect(imageData);
    drawCorners(markers);
    drawId(markers);
    updateScenes(markers);
  }
}

function snapshot() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function drawCorners(markers) {
  var corners, corner, i, j;

  context.lineWidth = 3;

  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners;

    context.strokeStyle = "red";
    context.beginPath();

    for (j = 0; j !== corners.length; ++j) {
      corner = corners[j];
      context.moveTo(corner.x, corner.y);
      corner = corners[(j + 1) % corners.length];
      context.lineTo(corner.x, corner.y);
    }

    context.stroke();
    context.closePath();

    context.strokeStyle = "green";
    context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  }
}

function drawId(markers) {
  var corners, corner, x, y, i, j;

  context.strokeStyle = "blue";
  context.lineWidth = 1;

  for (i = 0; i !== markers.length; ++i) {
    corners = markers[i].corners;

    x = Infinity;
    y = Infinity;

    for (j = 0; j !== corners.length; ++j) {
      corner = corners[j];

      x = Math.min(x, corner.x);
      y = Math.min(y, corner.y);
    }

    context.strokeText(markers[i].id, x, y);
  }
}

function updateScenes(markers) {
  // var corners, corner, pose, i;
  var corners, corner, i;

  if (markers.length > 0) {
    corners = markers[0].corners;

    for (i = 0; i < corners.length; ++i) {
      corner = corners[i];

      corner.x = corner.x - canvas.width / 2;
      corner.y = canvas.height / 2 - corner.y;
    }

    pose = posit.pose(corners);
    var coord = pose.bestTranslation;

    console.log("Coordinates of phone: " + coord);
  }
}

window.onload = onLoad;
