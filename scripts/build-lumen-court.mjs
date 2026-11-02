/**
 * Madison Paige Sydney Art Deco villa → public/models/lumen-court.glb
 * Brick/lawn/paver textures with world-space UVs (readable mortar lines).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    result = null;
    onload = null;
    onloadend = null;
    onerror = null;
    readAsArrayBuffer(blob) {
      const done = (ab) => {
        this.result = ab;
        this.onload?.({ target: this });
        this.onloadend?.({ target: this });
      };
      if (blob?.arrayBuffer) blob.arrayBuffer().then(done).catch((e) => this.onerror?.(e));
      else if (blob instanceof ArrayBuffer) done(blob);
      else done(new Uint8Array(blob).buffer);
    }
  };
}
if (typeof globalThis.ImageData === "undefined") {
  globalThis.ImageData = class ImageData {
    constructor(dataOrW, wOrH, h) {
      if (typeof dataOrW === "number") {
        this.width = dataOrW;
        this.height = wOrH;
        this.data = new Uint8ClampedArray(dataOrW * wOrH * 4);
      } else {
        this.data = dataOrW;
        this.width = wOrH;
        this.height = h;
      }
    }
  };
}
class NodeOffscreenCanvas {
  constructor(w = 1, h = 1) {
    this.width = w;
    this.height = h;
    this._img = null;
  }
  getContext() {
    const self = this;
    return {
      translate() {},
      scale() {},
      drawImage() {},
      putImageData(img) {
        self._img = img;
      },
      getImageData() {
        return self._img;
      },
    };
  }
  toBlob(cb, mimeType = "image/png") {
    this.convertToBlob({ type: mimeType }).then(cb).catch(() => cb(null));
  }
  async convertToBlob({ type = "image/png" } = {}) {
    const img = this._img;
    if (!img) return new Blob([], { type });
    const buf = await sharp(Buffer.from(img.data), {
      raw: { width: img.width, height: img.height, channels: 4 },
    })
      .png()
      .toBuffer();
    return new Blob([buf], { type });
  }
}
globalThis.OffscreenCanvas = NodeOffscreenCanvas;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/models/lumen-court.glb");

const C = {
  brick: 0xf4f1eb,
  surfmist: 0xe6e4df,
  capping: 0xd8d5cf,
  door: 0xe8a08c,
  timber: 0xb88958,
  timberDark: 0x9a7044,
  frame: 0x1a1b1d,
  glass: 0x9ec0d2,
  glassTint: 0x7aa0b4,
  louver: 0x2c3034,
  knob: 0xd4af6a,
  drive: 0xd0ccc4,
  paver: 0xc8c4bc,
  lawn: 0x5c7a40,
  trunk: 0x6a5a45,
  foliage: 0x4f6438,
  foliageLite: 0x6a7f48,
  foliageDark: 0x3d4e2c,
  cactus: 0x64784a,
  pot: 0xf0ece4,
  soil: 0x5a4838,
  wall: 0xf2efe8,
  metal: 0xc9c5bd,
  interior: 0xe8e2d8,
};

const MAIN_W = 9.6;
const MAIN_D = 8.6;
const MAIN_X = -1.4;
const MAIN_Z = -0.2;
const GF_H = 3.05;
const L2_H = 3.0;
const EAVE = GF_H + L2_H;
const R = 1.9;
const GAR_W = 5.9;
const GAR_D = 7.0;
const GAR_H = 2.95;
const GAR_X = MAIN_X + MAIN_W / 2 + GAR_W / 2 - 0.06;
const GAR_Z = 0.7;
const R_G = 1.55;
const FRONT = MAIN_Z + MAIN_D / 2;
const BW = 0.32;
const BH = 0.1;

function makeBrickTex(size = 1024) {
  const data = new Uint8Array(size * size * 4);
  const bw = 96;
  const bh = 32;
  for (let y = 0; y < size; y++) {
    const row = Math.floor(y / bh);
    const off = row % 2 === 0 ? 0 : bw / 2;
    for (let x = 0; x < size; x++) {
      const lx = ((x + off) % bw + bw) % bw;
      const ly = y % bh;
      const mortar = lx < 4 || ly < 3 || lx > bw - 5 || ly > bh - 4;
      const v = mortar ? 188 : 246 + ((x * 3 + y) % 6);
      const i = (y * size + x) * 4;
      data[i] = v;
      data[i + 1] = v - (mortar ? 4 : 1);
      data[i + 2] = v - (mortar ? 12 : 5);
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.needsUpdate = true;
  tex.flipY = true;
  return tex;
}

function makeLawnTex(size = 256) {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const n = (i * 17) % 19;
    const o = i * 4;
    data[o] = 52 + (n % 7);
    data[o + 1] = 90 + n;
    data[o + 2] = 40 + (n % 5);
    data[o + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.needsUpdate = true;
  tex.flipY = true;
  return tex;
}

function makePaverTex(size = 512) {
  const data = new Uint8Array(size * size * 4);
  const cell = 64;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const edge = x % cell < 2 || y % cell < 2;
      const shade = edge ? 165 : 198 + ((x + y) % 8);
      const i = (y * size + x) * 4;
      data[i] = shade;
      data[i + 1] = shade - 2;
      data[i + 2] = shade - 8;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.needsUpdate = true;
  tex.flipY = true;
  return tex;
}

function bakeWorldUVs(geometry, uScale = 1 / BW, vScale = 1 / BH) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  g.computeVertexNormals();
  const pos = g.attributes.position;
  const nrm = g.attributes.normal;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = Math.abs(nrm.getX(i));
    const ny = Math.abs(nrm.getY(i));
    const nz = Math.abs(nrm.getZ(i));
    let u;
    let v;
    if (ny >= nx && ny >= nz) {
      u = x * uScale;
      v = z * uScale;
    } else if (nx >= nz) {
      u = -z * uScale;
      v = y * vScale;
    } else {
      u = x * uScale;
      v = y * vScale;
    }
    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    map: opts.map ?? null,
    roughness: opts.roughness ?? 0.88,
    metalness: opts.metalness ?? 0.02,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
  });
}

function box(w, h, d, x, y, z, material, rotY = 0) {
  let geom = new THREE.BoxGeometry(w, h, d);
  if (material.map) geom = bakeWorldUVs(geom);
  const m = new THREE.Mesh(geom, material);
  m.position.set(x, y, z);
  if (rotY) m.rotation.y = rotY;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function roundedFootprint(width, depth, radius, corners) {
  const hw = width / 2;
  const hd = depth / 2;
  const fl = corners.fl ? radius : 0;
  const fr = corners.fr ? radius : 0;
  const bl = corners.bl ? radius : 0;
  const br = corners.br ? radius : 0;
  const s = new THREE.Shape();
  s.moveTo(-hw + fl, -hd);
  s.lineTo(hw - fr, -hd);
  if (fr > 0.01) s.absarc(hw - fr, -hd + fr, fr, -Math.PI / 2, 0, false);
  else s.lineTo(hw, -hd);
  s.lineTo(hw, hd - br);
  if (br > 0.01) s.absarc(hw - br, hd - br, br, 0, Math.PI / 2, false);
  else s.lineTo(hw, hd);
  s.lineTo(-hw + bl, hd);
  if (bl > 0.01) s.absarc(-hw + bl, hd - bl, bl, Math.PI / 2, Math.PI, false);
  else s.lineTo(-hw, hd);
  s.lineTo(-hw, -hd + fl);
  if (fl > 0.01) s.absarc(-hw + fl, -hd + fl, fl, Math.PI, Math.PI * 1.5, false);
  else s.lineTo(-hw, -hd);
  s.closePath();
  return s;
}

function roundedVolume(width, depth, height, x, y, z, radius, corners, material) {
  const shape = roundedFootprint(width, depth, radius, corners);
  let geom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 48,
  });
  geom.rotateX(-Math.PI / 2);
  // Extruded curves get wavy planar UVs — keep solid color on volume body.
  const mesh = new THREE.Mesh(geom, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = "LumenCourtVilla";

  const brickMap = makeBrickTex();
  const lawnMap = makeLawnTex();
  const paverMap = makePaverTex();

  // subtle painted-brick read via very soft mortar tint (no noisy map)
  const mBrickSoft = mat(0xf2efe8, { roughness: 0.9 });
  const mBrick = mBrickSoft;
  const mBrickTex = mBrickSoft;
  const mSurf = mat(C.surfmist, { roughness: 0.48 });
  const mCap = mat(C.capping, { roughness: 0.38, metalness: 0.22 });
  const mDoor = mat(C.door, { roughness: 0.4 });
  const mTimber = mat(C.timber, { roughness: 0.55 });
  const mTimberD = mat(C.timberDark, { roughness: 0.55 });
  const mFrame = mat(C.frame, { roughness: 0.32, metalness: 0.28 });
  const mGlass = mat(0xb8d4e4, {
    roughness: 0.04,
    metalness: 0.12,
    transparent: true,
    opacity: 0.28,
  });
  const mGlassDark = mat(C.glassTint, { roughness: 0.08, metalness: 0.18 });
  const mLouver = mat(C.louver, { roughness: 0.4, metalness: 0.12 });
  const mKnob = mat(C.knob, { roughness: 0.14, metalness: 0.92 });
  const mDrive = mat(C.drive, { roughness: 0.92 });
  const mPaver = mat(C.paver, { map: paverMap, roughness: 0.9 });
  const mLawn = mat(C.lawn, { map: lawnMap, roughness: 1 });
  const mTrunk = mat(C.trunk, { roughness: 0.97 });
  const mFol = mat(C.foliage, { roughness: 1 });
  const mFolL = mat(C.foliageLite, { roughness: 1 });
  const mFolD = mat(C.foliageDark, { roughness: 1 });
  const mCactus = mat(C.cactus, { roughness: 0.85 });
  const mPot = mat(C.pot, { roughness: 0.45 });
  const mSoil = mat(C.soil, { roughness: 1 });
  const mWall = mat(C.wall, { roughness: 0.88 });
  const mMetal = mat(C.metal, { roughness: 0.32, metalness: 0.45 });
  const mInterior = mat(0xf4efe6, { roughness: 0.9 });
  const mGravel = mat(0xe8e4dc, { roughness: 1 });

  {
    let geom = new THREE.CircleGeometry(30, 80);
    geom = bakeWorldUVs(geom, 1 / 0.35, 1 / 0.35);
    const lawn = new THREE.Mesh(geom, mLawn);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0.3, 0, 1.5);
    lawn.receiveShadow = true;
    root.add(lawn);
  }

  // Straight driveway (like ArchiCGI hero) + garage apron
  root.add(box(4.6, 0.04, 15.0, GAR_X + 0.05, 0.02, 7.0, mDrive));
  {
    let pg = new THREE.BoxGeometry(6.0, 0.05, 3.0);
    pg = bakeWorldUVs(pg, 1 / 0.45, 1 / 0.45);
    const p = new THREE.Mesh(pg, mPaver);
    p.position.set(GAR_X + 0.05, 0.028, GAR_Z + GAR_D / 2 + 1.3);
    p.receiveShadow = true;
    root.add(p);
  }
  root.add(
    box(1.35, 0.055, 2.0, GAR_X + GAR_W / 2 - 0.25, 0.035, GAR_Z + GAR_D / 2 - 0.35, mGravel),
  );
  // Straight walk to front door — continuous strip
  root.add(box(1.5, 0.05, 7.5, MAIN_X - 1.45, 0.028, FRONT + 3.6, mDrive));
  for (let i = 0; i < 4; i++) {
    const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.42, 0.04, 24), mPaver);
    stone.position.set(MAIN_X - 1.45, 0.05, FRONT + 0.7 + i * 1.15);
    stone.receiveShadow = true;
    root.add(stone);
  }

  root.add(roundedVolume(MAIN_W, MAIN_D, EAVE, MAIN_X, 0, MAIN_Z, R, { fr: true }, mBrick));
  // Brick skins on flat faces only (readable mortar, no curve UV stretch)
  {
    const frontW = MAIN_W - R - 0.2;
    let fg = new THREE.PlaneGeometry(frontW, EAVE);
    fg = bakeWorldUVs(fg);
    const frontSkin = new THREE.Mesh(fg, mBrickTex);
    frontSkin.position.set(MAIN_X - R / 2 - 0.05, EAVE / 2, FRONT + 0.012);
    frontSkin.receiveShadow = true;
    root.add(frontSkin);

    let lg = new THREE.PlaneGeometry(MAIN_D - 0.15, EAVE);
    lg = bakeWorldUVs(lg);
    const leftSkin = new THREE.Mesh(lg, mBrickTex);
    leftSkin.position.set(MAIN_X - MAIN_W / 2 - 0.012, EAVE / 2, MAIN_Z);
    leftSkin.rotation.y = -Math.PI / 2;
    leftSkin.receiveShadow = true;
    root.add(leftSkin);

    // brick strips wrapping the FR curve (follows arc, correct orientation)
    const stripCount = 36;
    for (let i = 0; i < stripCount; i++) {
      const t = i / (stripCount - 1);
      const a = -Math.PI / 2 + t * (Math.PI / 2);
      const cx = MAIN_X + MAIN_W / 2 - R;
      const cz = FRONT - R;
      const x = cx + Math.cos(a) * (R + 0.015);
      const z = cz + Math.sin(a) * (R + 0.015);
      const strip = box(0.12, EAVE, 0.04, x, EAVE / 2, z, mBrickTex);
      strip.rotation.y = -a + Math.PI / 2;
      root.add(strip);
    }
  }
  // L2 lip over entry — keep shallow so door reads full-height
  root.add(
    box(3.2, 0.18, 0.75, MAIN_X - MAIN_W / 2 + 1.55, GF_H + 0.05, FRONT + 0.18, mBrickTex),
  );
  root.add(
    box(
      3.0,
      GF_H - 0.15,
      0.45,
      MAIN_X - MAIN_W / 2 + 1.5,
      (GF_H - 0.15) / 2,
      FRONT - 0.15,
      mInterior,
    ),
  );
  root.add(box(MAIN_W + 0.1, 0.06, MAIN_D + 0.1, MAIN_X, EAVE + 0.03, MAIN_Z, mCap));
  root.add(
    roundedVolume(2.3, 2.6, 0.5, MAIN_X + 2.1, EAVE, MAIN_Z - 1.9, 0.12, {}, mBrick),
  );
  root.add(box(2.4, 0.05, 2.7, MAIN_X + 2.1, EAVE + 0.5, MAIN_Z - 1.9, mCap));

  root.add(roundedVolume(GAR_W, GAR_D, GAR_H, GAR_X, 0, GAR_Z, R_G, { fr: true }, mBrick));
  {
    const frontW = GAR_W - R_G - 0.25;
    let fg = new THREE.PlaneGeometry(frontW, GAR_H);
    fg = bakeWorldUVs(fg);
    const skin = new THREE.Mesh(fg, mBrickTex);
    skin.position.set(GAR_X - R_G / 2 + 0.05, GAR_H / 2, GAR_Z + GAR_D / 2 + 0.012);
    skin.receiveShadow = true;
    root.add(skin);
    const stripCount = 28;
    for (let i = 0; i < stripCount; i++) {
      const t = i / (stripCount - 1);
      const a = -Math.PI / 2 + t * (Math.PI / 2);
      const cx = GAR_X + GAR_W / 2 - R_G;
      const cz = GAR_Z + GAR_D / 2 - R_G;
      const x = cx + Math.cos(a) * (R_G + 0.015);
      const z = cz + Math.sin(a) * (R_G + 0.015);
      const strip = box(0.12, GAR_H, 0.04, x, GAR_H / 2, z, mBrickTex);
      strip.rotation.y = -a + Math.PI / 2;
      root.add(strip);
    }
  }
  root.add(box(GAR_W + 0.1, 0.06, GAR_D + 0.1, GAR_X, GAR_H + 0.03, GAR_Z, mCap));

  const wallH = 2.05;
  const wallZ = FRONT + 0.05;
  const x0 = MAIN_X - MAIN_W / 2 - 0.1;
  const cols = 7;
  const rows = 5;
  const cellW = 2.7 / cols;
  const cellH = wallH / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bx = x0 - 2.6 + col * cellW + cellW / 2;
      const by = row * cellH + cellH / 2;
      root.add(box(cellW * 0.94, cellH * 0.12, 0.14, bx, by + cellH * 0.38, wallZ, mWall));
      root.add(box(cellW * 0.94, cellH * 0.12, 0.14, bx, by - cellH * 0.38, wallZ, mWall));
      root.add(box(cellW * 0.12, cellH * 0.72, 0.14, bx - cellW * 0.38, by, wallZ, mWall));
      root.add(box(cellW * 0.12, cellH * 0.72, 0.14, bx + cellW * 0.38, by, wallZ, mWall));
      root.add(box(cellW * 0.72, cellH * 0.1, 0.12, bx, by, wallZ, mWall));
      root.add(box(cellW * 0.1, cellH * 0.55, 0.12, bx, by, wallZ, mWall));
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < 4; col++) {
      const bz = wallZ - 0.15 - col * 0.48;
      const by = row * cellH + cellH / 2;
      root.add(box(0.14, cellH * 0.55, 0.38, x0 - 2.75, by, bz, mWall));
    }
  }
  root.add(box(0.2, wallH + 0.08, 0.2, x0 + 0.05, wallH / 2, wallZ, mWall));

  // Full-height Pink Lemonade door filling the recess
  const doorX = MAIN_X - 1.45;
  const doorH = GF_H - 0.12;
  const doorW = 1.4;
  root.add(box(doorW + 0.28, doorH + 0.1, 0.4, doorX, doorH / 2, FRONT - 0.2, mInterior));
  root.add(box(doorW, doorH, 0.12, doorX, doorH / 2, FRONT + 0.06, mDoor));
  root.add(box(0.05, doorH - 0.1, 0.025, doorX - doorW / 2 + 0.07, doorH / 2, FRONT + 0.13, mat(0xd99282, { roughness: 0.4 })));
  root.add(box(0.05, doorH - 0.1, 0.025, doorX + doorW / 2 - 0.07, doorH / 2, FRONT + 0.13, mat(0xd99282, { roughness: 0.4 })));
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 18), mKnob);
  knob.position.set(doorX, doorH / 2, FRONT + 0.2);
  knob.castShadow = true;
  root.add(knob);
  root.add(box(0.95, 0.34, 0.08, MAIN_X - 3.55, 1.72, FRONT + 0.02, mFrame));
  root.add(box(0.86, 0.26, 0.03, MAIN_X - 3.55, 1.72, FRONT + 0.05, mGlass));

  // Timber wrap FULL solid backing + dense slats, then circular glass overlays
  const cx = MAIN_X + MAIN_W / 2 - R;
  const cz = FRONT - R;
  const hT = GF_H - 0.04;
  const rT = R + 0.02;
  const circleX = MAIN_X + 1.85;
  const circleY = 1.55;
  // Solid timber backing (continuous, no gaps)
  const backCount = 40;
  for (let i = 0; i < backCount; i++) {
    const t = i / (backCount - 1);
    const a = Math.PI / 2 - t * (Math.PI / 2) * 0.98;
    const pull = t < 0.6 ? (0.6 - t) * 3.6 : 0;
    const x = cx + Math.cos(a) * rT - pull;
    const z = cz + Math.sin(a) * rT + 0.02;
    const panel = box(0.14, hT, 0.08, x, hT / 2 + 0.02, z, mTimber);
    panel.rotation.y = -a + Math.PI / 2;
    root.add(panel);
  }
  // Dense vertical slats on top of backing
  const count = 90;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const a = Math.PI / 2 - t * (Math.PI / 2) * 0.98;
    const pull = t < 0.6 ? (0.6 - t) * 3.6 : 0;
    const x = cx + Math.cos(a) * (rT + 0.05) - pull;
    const z = cz + Math.sin(a) * (rT + 0.05) + 0.04;
    const colorMat = i % 4 === 0 ? mTimberD : mTimber;
    const slat = box(0.042, hT, 0.06, x, hT / 2 + 0.02, z, colorMat);
    slat.rotation.y = -a + Math.PI / 2;
    root.add(slat);
  }
  // Oculus overlays timber
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.86, 1.0, 64),
    mat(0x1a1c1e, { roughness: 0.25, metalness: 0.4, side: THREE.DoubleSide }),
  );
  ring.position.set(circleX, circleY, FRONT + 0.2);
  root.add(ring);
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.88, 64),
    mat(0xb0d0e0, { roughness: 0.04, metalness: 0.18, transparent: true, opacity: 0.4 }),
  );
  disc.position.set(circleX, circleY, FRONT + 0.18);
  root.add(disc);

  // Upper windows — all three matching clear glass
  const yW = GF_H + 1.48;
  const zF = FRONT + 0.03;
  const bay = 1.3;
  const pier = 0.18;
  const total = bay * 3 + pier * 2;
  const cxW = MAIN_X - 0.25;
  root.add(box(total + 0.45, bay + 0.45, 0.5, cxW, yW, FRONT - 0.22, mInterior));
  root.add(box(total + 0.3, 0.07, 0.14, cxW, yW + bay / 2 + 0.04, zF - 0.02, mFrame));
  root.add(box(total + 0.3, 0.07, 0.14, cxW, yW - bay / 2 - 0.04, zF - 0.02, mFrame));
  [-1, 0, 1].forEach((i) => {
    const x = cxW + i * (bay + pier);
    root.add(box(0.055, bay + 0.1, 0.12, x - bay / 2, yW, zF, mFrame));
    root.add(box(0.055, bay + 0.1, 0.12, x + bay / 2, yW, zF, mFrame));
    root.add(box(bay - 0.12, bay - 0.12, 0.03, x, yW, zF + 0.02, mGlass));
  });
  root.add(box(0.55, 0.55, 0.1, MAIN_X + 3.6, yW, zF, mFrame));
  root.add(box(0.46, 0.46, 0.03, MAIN_X + 3.6, yW, zF + 0.04, mGlass));

  [1.55, GF_H + 1.5].forEach((y) => {
    root.add(box(0.08, 0.42, 1.15, MAIN_X - MAIN_W / 2 - 0.02, y, MAIN_Z + 0.55, mFrame));
    root.add(
      box(0.03, 0.34, 1.05, MAIN_X - MAIN_W / 2 - 0.04, y, MAIN_Z + 0.55, mGlass),
    );
  });
  [-2.3, -0.9, 0.5].forEach((dx) => {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), mWall);
    lamp.position.set(MAIN_X + dx, GF_H - 0.06, FRONT + 0.2);
    lamp.rotation.x = Math.PI / 2;
    root.add(lamp);
  });

  const gz = GAR_Z + GAR_D / 2 + 0.04;
  const gw = 4.55;
  const gh = 2.28;
  root.add(box(gw + 0.22, gh + 0.16, 0.1, GAR_X + 0.1, gh / 2 + 0.14, gz, mSurf));
  root.add(
    box(gw, gh, 0.05, GAR_X + 0.1, gh / 2 + 0.12, gz + 0.04, mat(0xefede8, { roughness: 0.45 })),
  );
  for (let i = 0; i < 6; i++) {
    root.add(
      box(gw - 0.1, 0.014, 0.03, GAR_X + 0.1, 0.38 + i * 0.36, gz + 0.08, mat(0xd6d2ca)),
    );
  }
  [-1.45, 1.45].forEach((dx) => {
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 12), mWall);
    lamp.position.set(GAR_X + 0.1 + dx, gh + 0.38, gz + 0.04);
    root.add(lamp);
  });
  const railY = GAR_H + 0.55;
  root.add(
    box(
      3.6,
      0.72,
      0.028,
      GAR_X + 0.55,
      railY,
      GAR_Z + 0.15,
      mat(0xcfe3ec, {
        roughness: 0.05,
        metalness: 0.12,
        transparent: true,
        opacity: 0.2,
      }),
    ),
  );
  root.add(box(3.6, 0.025, 0.025, GAR_X + 0.55, railY + 0.36, GAR_Z + 0.15, mMetal));

  function tree(px, pz, scale, spin) {
    const g = new THREE.Group();
    g.position.set(px, 0, pz);
    g.scale.setScalar(scale);
    g.rotation.y = spin;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.13, 7.2, 8), mTrunk);
    trunk.position.y = 3.6;
    trunk.castShadow = true;
    g.add(trunk);
    // Clean canopy only — no stray branches
    [
      [0.0, 6.2, 0.0, 1.65, 1.15, 1.45, mFolD],
      [0.95, 6.55, 0.25, 1.05, 0.8, 0.95, mFol],
      [-0.95, 6.45, -0.2, 1.05, 0.8, 0.95, mFolL],
      [0.15, 7.35, 0.1, 0.9, 0.7, 0.85, mFol],
    ].forEach(([x, y, z, sx, sy, sz, m]) => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), m);
      leaf.position.set(x, y, z);
      leaf.scale.set(sx, sy * 0.9, sz);
      leaf.castShadow = true;
      g.add(leaf);
    });
    root.add(g);
  }
  tree(-13.5, 1.5, 0.9, 0.3);
  tree(14.5, 1.2, 0.95, -0.5);

  function bush(px, pz, s) {
    const g = new THREE.Group();
    g.position.set(px, 0, pz);
    g.scale.setScalar(s);
    [
      [0, 0.85, 0, 0.95, mFolD],
      [0.5, 0.68, 0.3, 0.65, mFol],
      [-0.45, 0.65, -0.25, 0.6, mFolL],
    ].forEach(([x, y, z, r, m]) => {
      const o = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), m);
      o.position.set(x, y, z);
      o.scale.set(1, 0.75, 1);
      g.add(o);
    });
    root.add(g);
  }
  // Left: no bush near fence — only palm well clear of breeze wall
  // Right bushes clear of garage
  bush(GAR_X + GAR_W / 2 + 6.5, FRONT + 4.5, 0.9);
  bush(GAR_X + GAR_W / 2 + 7.2, FRONT + 2.2, 0.65);

  const potG = new THREE.Group();
  potG.position.set(x0 - 6.0, 0, FRONT + 4.8);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.32, 0.58, 28), mPot);
  pot.position.y = 0.36;
  pot.castShadow = true;
  potG.add(pot);
  for (let i = 0; i < 10; i++) {
    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.36 - i * 0.008, 0.012, 6, 24),
      mPot,
    );
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.16 + i * 0.05;
    potG.add(ringMesh);
  }
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.05, 24), mSoil);
  soil.position.y = 0.62;
  potG.add(soil);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.0, 8), mTrunk);
  stem.position.y = 1.55;
  potG.add(stem);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const leaf = box(
      0.12,
      0.02,
      1.2,
      Math.cos(a) * 0.15,
      2.6,
      Math.sin(a) * 0.15,
      mFolL,
    );
    leaf.rotation.set(1.0, a, 0.1);
    potG.add(leaf);
  }
  root.add(potG);

  // Cactus in gravel bed — clear of garage face
  const cact = new THREE.Group();
  cact.position.set(GAR_X + GAR_W / 2 + 0.55, 0.02, GAR_Z + GAR_D / 2 + 0.85);
  [
    [0, 0.8, 0, 0.06, 1.6],
    [0.25, 0.5, 0.1, 0.045, 1.0],
    [-0.2, 0.4, -0.12, 0.04, 0.8],
    [0.12, 0.22, -0.2, 0.08, 0.35],
  ].forEach(([x, y, z, r, h]) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.05, h, 10), mCactus);
    c.position.set(x, y, z);
    cact.add(c);
  });
  root.add(cact);

  root.add(box(18, 1.45, 0.05, -1.5, 0.75, -9.0, mWall));
  for (let i = 0; i < 22; i++) {
    root.add(box(0.04, 0.55, 0.03, -10 + i * 0.85, 1.55, -9.0, mWall));
  }
  root.add(
    box(
      5.5,
      0.08,
      3.2,
      MAIN_X - 0.5,
      0.04,
      MAIN_Z - MAIN_D / 2 - 2.2,
      mat(0x7aa8b8, { roughness: 0.15, metalness: 0.1 }),
    ),
  );

  root.position.set(0.15, 0.02, 0.2);
  root.rotation.y = -0.42;
  root.scale.setScalar(0.92);
  return root;
}

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const scene = new THREE.Scene();
  scene.add(buildScene());
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, {
    binary: true,
    onlyVisible: true,
    maxTextureSize: 1024,
  });
  const buf = Buffer.from(result);
  fs.writeFileSync(OUT, buf);
  console.log(`Wrote ${OUT} (${(buf.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
