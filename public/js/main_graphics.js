///////////////////////////////////////////////// SETUP

var scene = new THREE.Scene();
var viewSize = 50;
var aspectRatio = window.innerWidth / window.innerHeight;
//var camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 1000 );
var camera = new THREE.OrthographicCamera(
  (-aspectRatio * viewSize) / 2,
  (aspectRatio * viewSize) / 2,
  viewSize / 2,
  -viewSize / 2,
  -1000,
  1000
);
scene.add(camera);

camera.position.x = 10;
camera.position.y = 5;
camera.position.z = 15;
camera.lookAt(scene.position);

var light = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position = (1, 1, 1);
scene.add(directionalLight);

var renderer = new THREE.WebGLRenderer();
// var renderer = new THREE.SVGRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xd1e3ff, 1);

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

function updateCoordinateList(id, coord) {
  var cur_line = clientData[id]
  cur_line.points.push(coord);
  updateLine(cur_line)
}

function updateLine(line) { // updates lines passed from servers
  
  var obj = scene.getObjectByName(line.id)
  
  if (!obj) { // If not created, create
    
    var line_mat = new THREE.LineBasicMaterial({
      color: line.color,
      linewidth: line.width
    });
    var line_geometry = new THREE.BufferGeometry();
    var positions = new Float32Array.from(line.points);
    line_geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    window[line.id] = new THREE.Line(line_geometry, line_mat);
    scene.add( window[line.id] );
    
  } 
  else { // if exists, update geometry
    
    window[line.id].material.color = new THREE.Color( 0xffffff );         
    window[line.id].material.needsUpdate = true;
    
    for (var i = 0; i < line.points.length; i++) {
      var tmp = line.points[i];
      window[line.id].geometry.attributes.position.array[i] = tmp.x;
      window[line.id].geometry.attributes.position.array[i+1] = tmp.y;
      window[line.id].geometry.attributes.position.array[i+2] = tmp.z;
    }
  }
}

function updateAllLines(lines) {
  for (var i = 0; i < lines.length; i++) {
    updateLine(lines[i]);
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

  // updateLines();
  
  renderer.render(scene, camera);
}
animate();
