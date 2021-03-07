var randomColor = Math.floor(Math.random()*16777215).toString(16);
var colorPicker = new iro.ColorPicker("#picker", {
  // Set the size of the color picker
  width: 200,
  color: randomColor
});

///////////////////////////////////////////////// SETUP

var scene = new THREE.Scene();
var viewSize = 50;
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 10000 );
scene.add(camera);

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

var mag = 300;
camera.position.x = randRange(-mag, mag);
camera.position.y = randRange(0, mag);
camera.position.z = randRange(-mag, mag);
camera.lookAt(scene.position);

var light = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position = (1, 1, 1);
scene.add(directionalLight);

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
// var renderer = new THREE.SVGRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor( 0x000000, 0 ); // the default


var gridHelper = new THREE.GridHelper( 100, 10, 0x444444, 0x444444);
scene.add( gridHelper );
var controls = new THREE.OrbitControls(camera, renderer.domElement);
var axesHelper = new THREE.AxesHelper(250);
scene.add(axesHelper);

///////////////////////////////////////////////// DATA STRUCTURES

// format:
// {
//   'falaehflbnabu': {points: THREE.Vector3(), color: '#abcdef', width: 1},
//   'vaivbsoabvirbaivbi': {points: THREE.Vector3(), color: '#abcdef', width: 1},
// }
var clientData = {};
var lineIDStack = [];

function lineIDStack_push(line_id) {
  lineIDStack.push(line_id);
}

socket.on("server-update", function(packet) {
  for (let other_client_id in packet) {
    if (clientData[other_client_id] == undefined)
      clientData[other_client_id] = {};
    clientData[other_client_id] = Object.assign({}, clientData[other_client_id], packet[other_client_id]);
    updateAllLines(packet[other_client_id]);
  }
  // var other_client_id = Object.keys(packet)[0];
  //  if (clientData[other_client_id] == undefined)
  //   clientData[other_client_id] = {};
  // clientData[other_client_id] = Object.assign({}, clientData[other_client_id], packet[other_client_id])
  // clientData = Object.assign({}, clientData, packet);
  // updateAllLines(packet[other_client_id]);
  // console.log(clientData);
});

socket.on("server-clear", function(other_client_id) {
  let lines = clientData[other_client_id];
  for (var key_id in lines) {
    deleteLine(key_id, lines[key_id], other_client_id);
  }
});

function updateCoordinateList(line_id, coord) {
  
  if (clientData[client_id] == undefined) {
    clientData[client_id] = {};
  }
  if (clientData[client_id][line_id] == undefined) {
    clientData[client_id][line_id] = {points: [], color: colorPicker.color.hexString, width: 10}
  }
  
  var cam_mat = camera.matrixWorld;
  var coordinate = new THREE.Vector3(-coord[0], coord[1], coord[2]);
  var new_coord = coordinate.applyMatrix4(cam_mat);
  
  var cur_line = clientData[client_id][line_id]
  cur_line.points.push(new_coord.x);
  cur_line.points.push(new_coord.y);
  cur_line.points.push(new_coord.z);
  updateLine(line_id, cur_line)
  
  // Notify all other clients of updates
  // 'falaehflbnabu': {points: float32 arr[], color: '#abcdef'},
  var packet_inner = {}
  packet_inner[line_id] = cur_line;
  var packet = {}
  packet[client_id] = packet_inner;
  socket.emit('client-update', packet);
}

function updateLine(id, line) { // updates lines passed from servers
  
  var obj = scene.getObjectByName(id);
  var positions = Float32Array.from(line.points);
  
  if (obj == undefined) { // If not created, create
    
    var line_mat = new THREE.LineBasicMaterial({
      color: line.color,
      linewidth: 1
    });
    var line_geometry = new THREE.BufferGeometry();
    line_geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    line_geometry.setDrawRange(0, positions.length);
    window[id] = new THREE.Line(line_geometry, line_mat);
    
    obj = window[id];
    obj.name = id;
    scene.add(obj);
    // scene.add( window[id] );
    
  } 
  else { // if exists, update geometry
    
    // window[id].material.color = new THREE.Color( 0xffffff );         
    // window[id].material.needsUpdate = true;
    window[id].geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    window[id].geometry.setDrawRange(0, positions.length);
  }
}

function updateAllLines(lines) {
  for (var key in lines) {
    updateLine(key, lines[key]);
  }
}

function deleteLine(id, line, other_client_id) {
  var obj = scene.getObjectByName(id);
  if (obj != undefined) {
    scene.remove(obj);
  }
  if (window[id] != undefined) {
    delete window[id];
  }
  delete clientData[other_client_id][id];
}

function deleteSelfLines() {
  let lines = clientData[client_id];
  for (var key_id in lines) {
    deleteLine(key_id, lines[key_id], client_id);
  }
  socket.emit('client-clear', client_id);
}

function undo() {
  line_id = lineIDStack.pop();
  deleteLine()
}

function updateSphere(id, coords) {
  // var obj = scene.getObjectByName(id);
  var obj = window[id];
  
  if (obj == undefined) {
    var sphere_geometry = new THREE.SphereGeometry(1, 32, 32);
    window[id] = new THREE.Mesh(sphere_geometry, new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 0.5} ));
    scene.add(window[id]);
  }
  else {
    var cam_mat = camera.matrixWorld;
    var coordinate = new THREE.Vector3(-coords[0], coords[1], coords[2]);
    var new_coord = coordinate.applyMatrix4(cam_mat);
    window[id].position.x = new_coord.x;
    window[id].position.y = new_coord.y;
    window[id].position.z = new_coord.z;
  }
}

///////////////////////////////////////////////// ANIMATE LOOP

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
