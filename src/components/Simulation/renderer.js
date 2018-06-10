import THREE from './three';
import {attachRotator, onWindowResize as onRotatorWindowResize, setRotation, applyRotationToObject} from './rotator';

// if ( ! Detector.webgl ) { Detector.addGetWebGLMessage(); }
// var stats;
var camera, scene, renderer, lut;
var position;
var mesh;
var colorMap = 'rainbow';
var numberOfColors = 512;
var legendLayout = 'vertical';
var container;

var cameraZ = 30;

function init(containerElement) {
    container = containerElement;
    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    // CAMERA
    camera = new THREE.PerspectiveCamera( 20, containerElement.clientWidth / containerElement.clientHeight, 1, 10000 );
    camera.name = 'camera';
    scene.add( camera );
    // stats = new Stats();
    // container.appendChild( stats.dom );
    // LIGHT
    var ambientLight = new THREE.AmbientLight( 0x444444 );
    ambientLight.name = 'ambientLight';
    scene.add( ambientLight );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = cameraZ;
    // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
    // directionalLight.position.x = 17;
    // directionalLight.position.y = 9;
    // directionalLight.position.z = 30;
    // directionalLight.name = 'directionalLight';
    // scene.add( directionalLight );

    var light = new THREE.AmbientLight( 0x666666 );
    scene.add( light );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(  containerElement.clientWidth,  containerElement.clientHeight );
    containerElement.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );


    attachRotator(containerElement);
    animate();
}

function onWindowResize() {
    onRotatorWindowResize();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth, container.clientHeight );
    render();
}

function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    mesh && applyRotationToObject(mesh);
    renderer.render( scene, camera );
}
var center = new THREE.Vector3();
function loadModel ( url ) {
    var loader = new THREE.BufferGeometryLoader();
    loader.load( url, function( geometry ) {
        // debugger;
        geometry.computeVertexNormals();
        geometry.normalizeNormals();
        var material = new THREE.MeshLambertMaterial( {
            side: THREE.DoubleSide,
            color: 0xF5F5F5,
            vertexColors: THREE.VertexColors
        } );
        var lutColors = [];

        lut = new THREE.Lut( colorMap, numberOfColors );
        lut.setMax( 2000 );
        lut.setMin( 0 );

        for ( var i = 0; i < geometry.attributes.temperature.array.length; i++ ) {
            var colorValue = geometry.attributes.temperature.array[ i ];
            var color = lut.getColor( colorValue );
            if ( color == undefined ) {
                console.log( "ERROR: " + colorValue );
            } else {
                lutColors[ 3 * i     ] = color.r;
                lutColors[ 3 * i + 1 ] = color.g;
                lutColors[ 3 * i + 2 ] = color.b;
            }
        }
        geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( lutColors ), 3 ) );
        mesh = new THREE.Mesh ( geometry, material );
        geometry.computeBoundingBox();
        var boundingBox = geometry.boundingBox;

        boundingBox.getCenter( center );
        if ( position === undefined ) {
            position = new THREE.Vector3(center.x, center.y, center.z);
            // camera.position.x = center.x;
            // camera.position.y = center.y;
            // camera.position.z = center.z + 100;
            // scene.translateX(-center.x);
            // scene.translateY(-center.y);
            // scene.translateZ(-center.z);
        }

        geometry.translate(-center.x, -center.y, -center.z);
        scene.add ( mesh );
        if ( legendLayout ) {
            var legend;
            if ( legendLayout == 'horizontal' ) {
                legend = lut.setLegendOn( { 'layout':'horizontal', 'position': { 'x': 0, 'y': 0, 'z': cameraZ } } );
            } else {
                legend = lut.setLegendOn();
            }
            scene.add ( legend );
            var labels = lut.setLegendLabels( { 'title': 'Temperature', 'um': '*C', 'ticks': 5 } );
            scene.add ( labels['title'] );
            for ( var i = 0; i < Object.keys( labels[ 'ticks' ] ).length; i++ ) {
                scene.add ( labels[ 'ticks' ][ i ] );
                scene.add ( labels[ 'lines' ][ i ] );
            }
        }
    } );
}
function cleanScene () {
    var elementsInTheScene = scene.children.length;
    for ( var i = elementsInTheScene-1; i > 0; i-- ) {
        if ( scene.children [ i ].name != 'camera' &&
            scene.children [ i ].name != 'ambientLight' &&
            scene.children [ i ].name != 'directionalLight') {
            scene.remove ( scene.children [ i ] );
        }
    }
}
// function onKeyDown ( e ) {
//     var maps = [ 'rainbow', 'cooltowarm', 'blackbody', 'grayscale' ];
//     var colorNumbers = ['16', '128', '256', '512' ];
//     if ( e.keyCode == 65 ) {
//         cleanScene();
//         var index = maps.indexOf( colorMap ) >= maps.length - 1 ? 0 : maps.indexOf( colorMap ) + 1;
//         colorMap = maps [ index ];
//         loadModel ( colorMap, numberOfColors, legendLayout );
//     } else if ( e.keyCode == 83 ) {
//         cleanScene();
//         var index = colorNumbers.indexOf( numberOfColors ) >= colorNumbers.length - 1 ? 0 : colorNumbers.indexOf( numberOfColors ) + 1;
//         numberOfColors = colorNumbers [ index ];
//         loadModel ( colorMap ,  numberOfColors, legendLayout );
//     } else if ( e.keyCode == 68 ) {
//         if ( ! legendLayout ) {
//             cleanScene();
//             legendLayout = 'vertical';
//             loadModel ( colorMap ,  numberOfColors, legendLayout );
//         } else {
//             cleanScene();
//             legendLayout = lut.setLegendOff();
//             loadModel ( colorMap ,  numberOfColors, legendLayout );
//         }
//     } else if ( e.keyCode == 70 ) {
//         cleanScene();
//         if ( ! legendLayout ) return false;
//         lut.setLegendOff();
//         if ( legendLayout == 'horizontal') {
//             legendLayout = 'vertical';
//         } else {
//             legendLayout = 'horizontal';
//         }
//         loadModel ( colorMap ,  numberOfColors, legendLayout );
//     }
// }

export default init;
export {
    loadModel
};