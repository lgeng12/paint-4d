// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

///////////////////////////////////////////////// SETUP

var scene = new THREE.Scene();
var viewSize = 50;
var aspectRatio = window.innerWidth / window.innerHeight;
//var camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 1000 );
var camera = new THREE.OrthographicCamera( -aspectRatio * viewSize / 2, aspectRatio * viewSize /2, viewSize / 2, -viewSize /2, -1000, 1000)
scene.add( camera );

camera.position.x = 10;
camera.position.y = 5;
camera.position.z = 15;
camera.lookAt(scene.position);

var light = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(light);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position = (1, 1, 1);
scene.add( directionalLight );

var renderer = new THREE.WebGLRenderer();
// var renderer = new THREE.SVGRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setClearColor( 0xffffff, 1 );

var controls = new THREE.OrbitControls(camera, renderer.domElement);
var axesHelper = new THREE.AxesHelper( 250 );
scene.add( axesHelper );

///////////////////////////////////////////////// MATERIALS 

var clear = new THREE.MeshLambertMaterial({ 
  color: 0x000000,
  transparent: true,
  opacity: 0.25,
  depthWrite: false,
});

var clear2 = new THREE.MeshLambertMaterial({ 
  color: 0x000000,
  transparent: true,
  opacity: 0.75,
  depthWrite: false,
});


var line_mat = new THREE.LineBasicMaterial( {
	color: 0xff0000,
	linewidth: 1,
} );

var color = new THREE.MeshLambertMaterial( {
   color: 0xff8000, 
   wireframe: false 
} );

///////////////////////////////////////////////// DATA STRUCTURES



///////////////////////////////////////////////// GUI CONTROLS

var guiControls = new function() {
  this.speed = 1;
  this.weight = 0.1;
}

var gui = new dat.GUI();
var changeSpeed = gui.add(guiControls, 'speed', 1, 10).step(1);
var toggleAssembly = gui.add(guiControls, 'showAssembly');
var toggleAxes = gui.add(guiControls, 'axes');
gui.add(guiControls, 'play');
gui.addColor(guiControls, 'stroke');
gui.addColor(guiControls, 'background');
gui.addColor(guiControls, 'assembly');
var select = gui.add(guiControls, 'selection').min(0).step(1).max(0);
var changeR = gui.add(guiControls, 'radius', 1, 50);
var changeA = gui.add(guiControls, 'd_alpha', -1, 1).step(0.1);
var changeB = gui.add(guiControls, 'd_beta', -1, 1).step(0.1);
gui.add(guiControls, 'add');
gui.add(guiControls, 'remove');
gui.add(guiControls, 'clear');
gui.add(guiControls, 'filename');
// var changeWeight = gui.add(guiControls, 'weight', 0, 5);
gui.add(guiControls, 'exportSTL');
gui.add(guiControls, 'exportSVG');
gui.add(guiControls, 'exportCode');
// gui.remember(guiControls);

changeSpeed.onChange(function(value) {ass.speed = value;});

toggleAssembly.onChange(function(value) { 
  for (var i = 0; i < ass.size; i++) {
    if (value) spheres[i].visible = true;
    else spheres[i].visible = false;
  }
}); 

toggleAxes.onChange(function(value) {
  if (value) axesHelper.visible = true;
  else axesHelper.visible = false;
});

changeR.onChange(function(value) {
  var i = guiControls.selection;
  ass.balls[i].r = value;
  ass.balls[i].update();
  var init_radius = spheres[i].geometry.parameters.radius;
  spheres[i].scale.x = value / init_radius;
  spheres[i].scale.y = value / init_radius;
  spheres[i].scale.z = value / init_radius;
  updateAssembly();
});

changeA.onChange(function(value) {
  ass.balls[guiControls.selection].d_alpha = value;
});

changeB.onChange(function(value) {
  ass.balls[guiControls.selection].d_beta = value;
});

select.onChange(function(value) {
  updateControllers();
  updateSelection(value);
});

function updateControllers() {
  guiControls.radius = ass.balls[guiControls.selection].r;
  guiControls.d_alpha = ass.balls[guiControls.selection].d_alpha;
  guiControls.d_beta = ass.balls[guiControls.selection].d_beta;
  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }
}

///////////////////////////////////////////////// ANIMATE LOOP

function animate() {
  requestAnimationFrame( animate );
  
  renderer.setClearColor( guiControls.background, 1 );
  clear.color.setHex( guiControls.assembly );
  clear2.color.setHex( guiControls.assembly );
  line_mat.color.setHex( guiControls.stroke );
  color.color.setHex( guiControls.stroke );

  updateAssembly( guiControls.play );
  if (index != -1) path.geometry.attributes.position.needsUpdate = true; 

  renderer.render( scene, camera );
}
animate();