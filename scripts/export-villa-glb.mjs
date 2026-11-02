/**
 * Builds a compact GLB of the Modern Classic villa for optional modelUrl use.
 * Run: node scripts/export-villa-glb.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

/** Minimal FileReader polyfill for three's GLTFExporter in Node. */
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;
    onerror = null;
    readAsArrayBuffer(blob) {
      Promise.resolve(blob.arrayBuffer?.() ?? blob)
        .then((buf) => {
          this.result = buf;
          this.onloadend?.({ target: this });
        })
        .catch((err) => this.onerror?.(err));
    }
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/models");
const outFile = path.join(outDir, "aurora-villa.glb");

const P = {
  wall: 0xe8e4dc,
  trim: 0x8a8f96,
  roof: 0x3a3d42,
  metal: 0x1a1a1a,
  glass: 0xc9b896,
  glassEm: 0xffb45a,
  lawn: 0x3d6b3a,
  hedge: 0x2f5a2c,
  paver: 0x5c6168,
};

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.82,
    metalness: opts.metalness ?? 0.04,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
  });
}

function box(w, h, d, x, y, z, material) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function hippedRoof(w, d, height, x, y, z, material) {
  const hw = w / 2;
  const hd = d / 2;
  const rw = w * 0.22;
  const rd = d * 0.18;
  const positions = new Float32Array([
    -hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd,
    -rw, height, -rd, rw, height, -rd, rw, height, rd, -rw, height, rd,
  ]);
  const indices = [
    0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7,
    0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7,
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = "AuroraVilla";

  const wall = mat(P.wall);
  const trim = mat(P.trim, { roughness: 0.7 });
  const roof = mat(P.roof, { roughness: 0.9 });
  const metal = mat(P.metal, { roughness: 0.35, metalness: 0.65 });
  const glass = mat(P.glass, {
    roughness: 0.15,
    metalness: 0.2,
    emissive: P.glassEm,
    emissiveIntensity: 0.55,
    transparent: true,
    opacity: 0.88,
  });
  const lawn = mat(P.lawn, { roughness: 1 });
  const hedge = mat(P.hedge, { roughness: 1 });
  const paver = mat(P.paver, { roughness: 0.95 });

  // main mass
  root.add(box(14.5, 6.5, 10.2, 0.8, 3.25, 0, wall));
  root.add(box(14.7, 0.2, 10.4, 0.8, 3.25, 0, trim));
  root.add(box(14.9, 0.22, 10.55, 0.8, 6.55, 0, trim));
  root.add(box(14.7, 0.28, 10.4, 0.8, 0.14, 0, trim));

  // arch pilasters + glass
  root.add(box(0.7, 6.2, 0.85, -2.85, 3.1, 5.4, wall));
  root.add(box(0.7, 6.2, 0.85, 2.85, 3.1, 5.4, wall));
  root.add(box(4.5, 5.8, 0.5, 0, 2.9, 5.35, wall));
  root.add(box(3.8, 5.2, 0.08, 0, 2.8, 5.65, glass));

  // muntin grid
  for (const x of [-1.2, -0.4, 0.4, 1.2]) {
    root.add(box(0.04, 4.8, 0.05, x, 2.6, 5.72, metal));
  }
  for (const y of [1.1, 2.2, 3.3, 4.2]) {
    root.add(box(3.9, 0.04, 0.05, 0, y, 5.72, metal));
  }

  // balcony wing
  root.add(box(4.2, 6.4, 4.8, 6.85, 3.2, -0.4, wall));
  root.add(box(3.2, 2.5, 0.08, 6.85, 1.55, 2.05, glass));
  root.add(box(3.1, 2.35, 0.08, 6.85, 4.85, 1.95, glass));
  root.add(box(3.6, 0.14, 1.35, 6.85, 3.55, 2.45, wall));
  root.add(box(3.5, 0.04, 0.04, 6.85, 4.45, 3.05, metal));

  // carport
  root.add(box(9.2, 0.28, 7.2, -9.0, 3.25, 0.8, wall));
  root.add(box(9.4, 0.12, 7.4, -9.0, 3.42, 0.8, trim));
  for (const x of [-12.2, -9.0, -5.8]) {
    for (const z of [3.2, -1.6]) {
      root.add(box(0.55, 0.22, 0.55, x, 0.11, z, trim));
      root.add(box(0.42, 2.8, 0.42, x, 1.6, z, wall));
      root.add(box(0.52, 0.14, 0.52, x, 3.08, z, trim));
    }
  }
  root.add(box(9.0, 0.04, 7.0, -9.0, 0.02, 0.8, paver));

  // roofs
  root.add(hippedRoof(15.2, 10.8, 1.35, 0.8, 6.65, 0, roof));
  root.add(hippedRoof(4.6, 5.4, 1.05, 6.85, 6.55, -0.2, roof));

  // framed windows (simplified)
  const wins = [
    [-4.6, 4.85, 5.15],
    [-3.4, 4.85, 5.15],
    [3.15, 2.0, 5.15],
    [3.9, 2.0, 5.15],
    [3.15, 4.95, 5.15],
    [3.9, 4.95, 5.15],
  ];
  for (const [x, y, z] of wins) {
    root.add(box(0.75, 2.3, 0.06, x, y, z - 0.02, trim));
    root.add(box(0.55, 2.1, 0.05, x, y, z + 0.02, glass));
  }

  // landscaping
  const lawnMesh = new THREE.Mesh(new THREE.PlaneGeometry(32, 18), lawn);
  lawnMesh.rotation.x = -Math.PI / 2;
  lawnMesh.position.set(0, 0, 6);
  lawnMesh.receiveShadow = true;
  root.add(lawnMesh);
  root.add(box(3.2, 0.55, 0.7, -2.2, 0.28, 8.4, hedge));
  root.add(box(3.2, 0.55, 0.7, 2.2, 0.28, 8.4, hedge));

  for (let i = 0; i < 6; i++) {
    root.add(box(1.35, 0.06, 0.85, 0, 0.03, 7.6 + i * 0.95, paver));
  }

  root.position.set(1.5, 0, -1);
  return root;
}

fs.mkdirSync(outDir, { recursive: true });
const scene = new THREE.Scene();
scene.add(buildScene());

const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const buf = Buffer.from(result);
    fs.writeFileSync(outFile, buf);
    console.log(`Wrote ${outFile} (${buf.length} bytes)`);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
  { binary: true },
);
