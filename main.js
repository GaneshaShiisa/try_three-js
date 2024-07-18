import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";

const canvas = document.querySelector(".webgl");
const camera_info = document.querySelector(".camera_info");
const sample_description = document.querySelector(".sample_description");

// scene
const scene = new THREE.Scene();

// camera
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height);
camera.position.x = 15;
camera.position.y = 15;
camera.position.z = 15;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);

// Light
const directional_light = new THREE.DirectionalLight(0xffffff, 10);
const ambient_light = new THREE.AmbientLight(0xffffff, 1);
scene.add(directional_light, ambient_light);

// Line
const line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });
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
const element_num = 20;
for (let i = 0; i < element_num; i++) {
  const material = new THREE.MeshBasicMaterial({ color: "#3c94d7" });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), material);
  mesh.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  mesh.name = String(i);
  scene.add(mesh);
}

// Geometries
const geometries = [];
geometries.push(new THREE.SphereGeometry(0.5, 32, 16));
geometries.push(new THREE.DodecahedronGeometry(0.5, 0));
geometries.push(new THREE.IcosahedronGeometry(0.5, 0));
geometries.push(new THREE.OctahedronGeometry(0.5, 0));
geometries.push(new THREE.TetrahedronGeometry(0.5, 0));
geometries.push(new THREE.BoxGeometry(1, 1, 1));
geometries.push(new THREE.CapsuleGeometry(0.5, 1, 4, 8));
geometries.push(new THREE.ConeGeometry(0.5, 1, 32));
geometries.push(new THREE.CylinderGeometry(0.3, 0.5, 1, 32));

geometries.push(new THREE.TorusGeometry(0.4, 0.1, 16, 32));
geometries.push(new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16));
geometries.push(new THREE.PlaneGeometry(1, 1));
geometries.push(new THREE.RingGeometry(0.25, 0.5, 32));
geometries.push(new THREE.CircleGeometry(0.75, 32, 0, (2 * Math.PI * 2) / 3));

// Material
const material_color = "#3c47d7";
const materials = [];
materials.push(
  // 法線ベクトルをRGBカラーにマッピングするマテリアル
  new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
  })
);
materials.push(
  // シンプルなシェーディング（フラットまたはワイヤーフレーム）で描画するためのマテリアル
  new THREE.MeshBasicMaterial({
    color: material_color,
    side: THREE.DoubleSide,
  })
);
const matcap = new THREE.TextureLoader().load("matcap-porcelain-white.jpg"); // ベイク用の画像を設定
materials.push(
  new THREE.MeshMatcapMaterial({
    color: material_color,
    side: THREE.DoubleSide,
    matcap: matcap,
  })
);
materials.push(
  // 光沢のない表面用のマテリアル
  new THREE.MeshLambertMaterial({
    color: material_color,
    side: THREE.DoubleSide,
  })
);
materials.push(
  // 鏡面ハイライトや光沢を表現できるマテリアル
  new THREE.MeshPhongMaterial({
    color: material_color,
    side: THREE.DoubleSide,
    shininess: 100,
  })
);
materials.push(
  // トゥーンシェーディング（アニメのセル画風）を実現するマテリアル
  new THREE.MeshToonMaterial({
    color: material_color,
    side: THREE.DoubleSide,
  })
);
materials.push(
  // 金属を表現できる、標準的な物理ベースのマテリアル
  new THREE.MeshStandardMaterial({
    color: material_color,
    side: THREE.DoubleSide,
    metalness: 0.5,
    roughness: 0.3,
  })
);
materials.push(
  // MeshStandardMaterialの拡張で、より高度な物理ベースのマテリアル
  new THREE.MeshPhysicalMaterial({
    color: material_color,
    side: THREE.DoubleSide,
    metalness: 0.5,
    roughness: 0.3,
    ior: 1,
    clearcoat: 1,
  })
);

// Object
for (let j = 0; j < materials.length; j++) {
  for (let i = 0; i < geometries.length; i++) {
    const mesh = new THREE.Mesh(geometries[i], materials[j]);
    mesh.position.set(1 + i * 2, 1, 1 + j * 2);
    mesh.name = "sample";
    scene.add(mesh);
  }
}

// Text Box
function text_box(text, size = 1, color = "#000000", background = "#00000000") {
  const canvas_for_text = document.createElement("canvas");
  const ctx = canvas_for_text.getContext("2d");
  const canvas_texture = new THREE.CanvasTexture(canvas_for_text);

  const fontSize = 500;
  ctx.font = `${fontSize}px serif`;
  const width = ctx.measureText(text).width;
  const height =
    ctx.measureText(text).fontBoundingBoxAscent +
    ctx.measureText(text).fontBoundingBoxDescent;
  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.font = `${fontSize}px serif`;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // 青背景を描く
  ctx.fillStyle = background; //rgb(0, 0, 255, 0.5)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // 文字を描く
  ctx.fillStyle = color;
  ctx.fillText(
    text,
    (ctx.canvas.width - ctx.measureText(text).width) / 2,
    ctx.measureText(text).fontBoundingBoxAscent
  );

  const text_material = new THREE.SpriteMaterial({
    map: canvas_texture,
    side: THREE.DoubleSide,
  });

  const ratio = ctx.canvas.width / ctx.canvas.height;
  const object = new THREE.Sprite(text_material);
  object.scale.set(ratio * size, size, 0);
  return object;
}

const text = text_box("Three.js Sample");
text.position.set(0, 5, 0);
scene.add(text);

// GUI
const gui = new GUI();
const color = {};
color.box = material_color;
gui.addColor(color, "box").onChange(() => {
  for (let j = 0; j < materials.length; j++) {
    if ("color" in materials[j]) {
      materials[j].color.set(color.box);
    }
  }
});

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

let click = false;
let mousedown_object;
window.addEventListener("mousedown", () => {
  click = true;
  mousedown_object = mouseover_object;
});
window.addEventListener("mouseup", () => {
  click = false;
  if (mousedown_object == mouseover_object) {
    const text =
      mouseover_object.geometry.type +
      "<br>x<br>" +
      mouseover_object.material.type;
    sample_description.innerHTML = text;
  }
});

let mouseover_object;
const clock = new THREE.Clock();
const animate = () => {
  const delta_time = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Object回転
  scene.traverse((object) => {
    if (object.isMesh) {
      object.rotation.x = elapsedTime * 0.5;
      object.rotation.y = elapsedTime * 0.5;
      object.rotation.z = elapsedTime * 0.5;
    }
  });

  // マウスオーバー検知
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name != "") {
      mouseover_object = intersects[i].object;

      break;
    }
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);

  //
  camera_info.innerHTML =
    "position = " +
    camera.position.x.toFixed(1) +
    ", " +
    camera.position.y.toFixed(1) +
    ", " +
    camera.position.z.toFixed(1) +
    "<br>" +
    "target = " +
    controls.target.x.toFixed(1) +
    ", " +
    controls.target.y.toFixed(1) +
    ", " +
    controls.target.z.toFixed(1);
};

animate();
