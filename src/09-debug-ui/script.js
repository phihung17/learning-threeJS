import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI({
  width: 300,
  title: "Debug",
});
// gui.close();
gui.hide();
window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    // gui._hidden is a private property, so we need to use the show method with the _hidden property
    gui.show(gui._hidden);
  }
});
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
debugObject.color = "#ff0000";
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const meshFolder = gui.addFolder("Mesh");

meshFolder.add(mesh.position, "y").min(-3).max(3).step(0.01).name("y");
meshFolder.add(mesh, "visible").name("visible");

const materialFolder = gui.addFolder("Material");
materialFolder.add(material, "wireframe").name("wireframe");
materialFolder
  .addColor(debugObject, "color")
  .name("color")
  .onChange(() => {
    material.color.set(debugObject.color);
  });

debugObject.spin = () => {
  gsap.to(mesh.rotation, {
    y: mesh.rotation.y + Math.PI * 2,
    // duration: 1,
    ease: "none",
  });
};
gui.add(debugObject, "spin").name("spin");

debugObject.subdivision = 2;
gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(10)
  .step(1)
  .name("subdivision")
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
