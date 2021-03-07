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
    // drawId(markers);
    updateScenes(markers);
    
    if(markers.length > 0) {
      // hightlight video frame
      canvas.style.border = "thick solid #FF003CFF";
    } else {
      canvas.style.border = "thick solid #00000000";
    }
  }
}

function snapshot() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function drawCorners(markers) {
  var corners, corner, i, j;

  context.lineWidth = 10;

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
  context.font = "30px sans-serif"
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

// copied from codehandbook.org
function generate_random_string(string_length){
    let random_string = '';
    let random_ascii;
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}


var time_for_new_line = true;
var line_id = "firstline";
const id_length = 20;
var current_coord =[0, 0, 0];
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
    coord[2] /= 10;
    coord[2] -= 400;
    
    var diff = [coord[0] - current_coord[0], coord[1] - current_coord[1], coord[2] - current_coord[2]];
    diff = diff.map(x => x / 15);
    current_coord = [current_coord[0]+diff[0], current_coord[1]+diff[1], current_coord[2]+diff[2]];
    coord = current_coord;
    
    var id = markers[0].id;
    let pen_on = id != 1023;
    
    if (!pen_on) {
      time_for_new_line = true;
    }
    
    else {
      if (time_for_new_line) {
        time_for_new_line = false;
        line_id = generate_random_string(id_length);
        lineIDStack_push(line_id);
      }
      updateCoordinateList(line_id, coord);
    }
    // console.log("Coordinates of phone: " + coord);
    updateSphere("cursor", coord);
  }
}

window.onload = onLoad;
