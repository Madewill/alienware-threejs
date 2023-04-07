import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObj = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");
// Scene
const scene = new THREE.Scene();
// group

/**
 * Environment
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
	"./environmentMaps/0/px.jpg",
	"./environmentMaps/0/nx.jpg",
	"./environmentMaps/0/py.jpg",
	"./environmentMaps/0/ny.jpg",
	"./environmentMaps/0/pz.jpg",
	"./environmentMaps/0/nz.jpg",
]);
// scene.background = environmentMap;
environmentMap.encoding = THREE.sRGBEncoding;

/*
 Update all materilas 
 */
const keyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (
			child instanceof THREE.Mesh &&
			child.material instanceof THREE.MeshStandardMaterial
		) {
			child.material.envMap = environmentMap;
			child.material.envMapIntensity = debugObj.envMapIntensity;
		}
		if (child.name === "lightkeys") {
			// TODO: have glowing keyboards --> possibley usieng bloom composer
		}
	});
};

debugObj.envMapIntensity = 2.5;
gui.add(debugObj, "envMapIntensity")
	.min(0)
	.max(10)
	.step(0.001)
	.setValue(1.75)
	.onChange(updateAllMaterials);

/* 
Model
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load("./laptop2.glb", (gltf) => {
	const laptop = gltf.scene;
	laptop.position.set(0, 0.5, 0);

	scene.add(laptop);
	updateAllMaterials();

	// center the model to the origin
	const box = new THREE.Box3().setFromObject(gltf.scene);
	const center = box.getCenter(new THREE.Vector3());

	gltf.scene.position.x += gltf.scene.position.x - center.x;
	gltf.scene.position.y += gltf.scene.position.y - center.y;
	gltf.scene.position.z += gltf.scene.position.z - center.z;
});

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
// camera.position.x = 2;
// camera.position.y = 2;
// camera.position.z = -1.6;
gui.add(camera.position, "x")
	.min(-50)
	.max(50)
	.step(0.001)
	.setValue(2)
	.name("cameraX");
gui.add(camera.position, "y")
	.min(-50)
	.max(50)
	.step(0.001)
	.setValue(2)
	.name("cameraY");
gui.add(camera.position, "z")
	.min(-50)
	.max(50)
	.step(0.001)
	.setValue(-1.6)
	.name("cameraZ");
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();

/* 
Postion 1 : x:1.41, y:0.78, z:-1.42
postion 2 : x:-1.83, y:-0.3, z:0.22
postion 3 : x:-0.19, y:0.99, z:2.7
postion 4 : x:0.07, y:1.4, z:-1.8
*/
