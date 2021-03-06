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

// idk
// function addLine (geometry) {
//   let line = new THREE.Line(geometry, line_mat);
//   scene.add(line);
// }

///////////////////////////////////////////////// MATERIALS

var clear = new THREE.MeshLambertMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.25,
  depthWrite: false
});

var clear2 = new THREE.MeshLambertMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.75,
  depthWrite: false
});

var line_mat = new THREE.LineBasicMaterial({
  color: 0xff0000,
  linewidth: 1
});

var color = new THREE.MeshLambertMaterial({
  color: 0xff8000,
  wireframe: false
});

///////////////////////////////////////////////// DATA STRUCTURES

///////////////////////////////////////////////// GUI CONTROLS

// var guiControls = new function() {
//   this.speed = 1;
//   this.weight = 0.1;
// }

// var gui = new dat.GUI();
// var changeSpeed = gui.add(guiControls, 'speed', 1, 10).step(1);
// var toggleAssembly = gui.add(guiControls, 'showAssembly');

///////////////////////////////////////////////// ANIMATE LOOP

// format:
// [
//  {points: THREE.Vector3(), color: '#abcdef'},
//  {points: [array of coords], color: '#abcdef'},
//  {points: [array of coords], color: '#abcdef'},
//  {points: [array of coords], color: '#abcdef'},
//  {points: [array of coords], color: '#abcdef'},
//    ...
// ]

function drawLine(line) { // updates lines passed from servers
    var path = new THREE.Line(line_geometry, line_mat);
    scene.add( path );
}

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
