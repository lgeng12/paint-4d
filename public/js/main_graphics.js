var colorPicker = new iro.ColorPicker("#picker", {
  // Set the size of the color picker
  width: 250,
  // Set the initial color to pure red
  color: "#ffaa00"
});

///////////////////////////////////////////////// SETUP

const socket = io();

var scene = new THREE.Scene();
var viewSize = 50;
var aspectRatio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 1000 );
// var camera = new THREE.OrthographicCamera(
//   (-aspectRatio * viewSize) / 2,
//   (aspectRatio * viewSize) / 2,
//   viewSize / 2,
//   -viewSize / 2,
//   -1000,
//   1000
// );
scene.add(camera);

camera.position.x = 250;
camera.position.y = 175;
camera.position.z = 325;
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

let clientData = {};

// socket.on("server-update", function(packet) {
//   // clientData = packet;
//   console.log(packet);
// });

function updateCoordinateList(id, coord) {
  
  if (clientData[id] == undefined) {
    clientData[id] = {points: [], color: colorPicker.color.hexString, width: 10}
  }
  
  var cam_mat = camera.matrixWorld;
  var coordinate = new THREE.Vector3(-coord[0], coord[1], coord[2]);
  var new_coord = coordinate.applyMatrix4(cam_mat);
  
  var cur_line = clientData[id]
  cur_line.points.push(new_coord.x);
  cur_line.points.push(new_coord.y);
  cur_line.points.push(new_coord.z);
  updateLine(id, cur_line)
}

function updateLine(id, line) { // updates lines passed from servers
  
  var obj = scene.getObjectByName(id);
  
  if (obj == undefined) { // If not created, create
    
    var line_mat = new THREE.LineBasicMaterial({
      color: line.color,
      linewidth: line.width
    });
    var line_geometry = new THREE.BufferGeometry();
    var positions = Float32Array.from(line.points);
    line_geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    line_geometry.setDrawRange(0, positions.length);
    window[id] = new THREE.Line(line_geometry, line_mat);
    scene.add( window[id] );
    
  } 
  else { // if exists, update geometry
    
    window[id].material.color = new THREE.Color( 0xffffff );         
    window[id].material.needsUpdate = true;
    
    for (var i = 0; i < line.points.length; i++) {
      var tmp = line.points[i];
      window[id].geometry.attributes.position.array[i] = tmp.x;
      window[id].geometry.attributes.position.array[i+1] = tmp.y;
      window[id].geometry.attributes.position.array[i+2] = tmp.z;
    }
  }
  
  // Notify all other clients of updates
  // 'falaehflbnabu': {points: THREE.Vector3(), color: '#abcdef', width: 1},
  // socket.emit('client-update', window[id])
}

function updateAllLines(lines) {
  for (var i = 0; i < lines.length; i++) {
    updateLine(lines[i]);
  }
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

///////////////////////////////////////////////// GUI CONTROLS

// var guiControls = new function() {
//   this.speed = 1;
//   this.weight = 0.1;
// }

// var gui = new dat.GUI();
// var changeSpeed = gui.add(guiControls, 'speed', 1, 10).step(1);
// var toggleAssembly = gui.add(guiControls, 'showAssembly');

///////////////////////////////////////////////// ANIMATE LOOP



function animate() {
  requestAnimationFrame(animate);

  //   renderer.setClearColor( guiControls.background, 1 );
  //   clear.color.setHex( guiControls.assembly );
  //   clear2.color.setHex( guiControls.assembly );
  //   line_mat.color.setHex( guiControls.stroke );
  //   color.color.setHex( guiControls.stroke );

  //   updateAssembly( guiControls.play );
  //   if (index != -1) path.geometry.attributes.position.needsUpdate = true;

  //   updateLines();
  
  renderer.render(scene, camera);
}
animate();
