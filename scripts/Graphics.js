var camera, scene, renderer, composer;
var object, light;
var cameraControl;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: false});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setClearColor(0x002b36, 1.0);
    renderer.shadowMapEnabled = true;
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 800;

    scene = new THREE.Scene();
    object = new THREE.Object3D();
    scene.add( object );
    var geometry = new THREE.SphereGeometry( 1, 6, 3 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );

    var loader = new THREE.OBJLoader();

    // load a resource
    loader.load(
    	// resource URL
    	'models/cat.obj',
    	// called when resource is loaded
    	function ( cat ) {
        var geometry = cat.children[0].geometry;
        var material = new THREE.MeshBasicMaterial( { color: 0x657b83, wireframe: true } );
        var catto = new THREE.Mesh( geometry, material );
        var px = 0;
        var py = 0;
        var pz = 0;

        catto.position.set( px, py, pz).normalize();
        catto.scale.x = catto.scale.y = catto.scale.z = 2;
        object.add( catto );
    	},
    	// called when loading is in progresses
    	function ( xhr ) {

    		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    	},
    	// called when loading has errors
    	function ( error ) {

    		console.log( 'An error happened' );

    	}
    );

    scene.add( new THREE.AmbientLight( 0xffffff ) );

    light = new THREE.DirectionalLight( 0xffffff);
    light.position.set( 1, 1, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff);
    light.position.set( 800, -800, -800 );
    scene.add( light );

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(200, 0, 0);
    spotLight.shadowCameraNear = 20;
    spotLight.shadowCameraFar = 800;
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 1;
    scene.add(spotLight);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1000;
    camera.lookAt(scene.position);

    // add controls
    cameraControl = new THREE.OrbitControls(camera);
    cameraControl.noPan  = true;
    cameraControl.noZoom  = true;
    // postprocessing

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    var effect = new THREE.ShaderPass( THREE.FilmShader );
    effect.uniforms[ 'grayscale' ].value = 0;
    effect.uniforms[ 'nIntensity' ].value = 0.2;
    effect.uniforms[ 'sIntensity' ].value = 0.2;
    effect.uniforms[ 'sCount' ].value = 1800;
    composer.addPass( effect );

    var effect = new THREE.GlitchPass();
    effect.renderToScreen = true;
    composer.addPass( effect );

    control = new function () {
      this.rotationSpeed = 0.001;
    };

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  composer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  cameraControl.update();
  requestAnimationFrame( animate );
  object.rotation.x += 0.01;
  object.rotation.y += 0.01;
  composer.render();
}
