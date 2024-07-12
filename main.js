import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as dat from "lil-gui";

const canvas = document.querySelector(".webgl");

// scene
const scene = new THREE.Scene();

// camera
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
camera.position.x = 2;
camera.position.y = 3;
camera.position.z = 15;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);

/* 要素 */
// material
const line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });

// Line
const x_line = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(10, 0, 0),
  ]),
  line_material
);
const y_line = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -10, 0),
    new THREE.Vector3(0, 10, 0),
  ]),
  line_material
);
const z_line = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, -10),
    new THREE.Vector3(0, 0, 10),
  ]),
  line_material
);
scene.add(x_line, y_line, z_line);

// Point
const element_num = 5;
for (let i = 0; i < element_num * 3; i++) {
  const material = new THREE.MeshBasicMaterial({ color: "#3c94d7" });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), material);
  mesh.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  mesh.name = String(i);
  console.log(mesh);
  scene.add(mesh);
}

// raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

const clock = new THREE.Clock();
const animate = () => {
  let delta_time = clock.getDelta();

  // マウスオーバー検知
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name != "") {
      console.log(intersects[i].object.name);
      intersects[i].object.material.color.set(0xff0000);
      break;
    }
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
