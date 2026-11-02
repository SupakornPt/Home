"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { lumenPalette as C } from "./materials";

/**
 * Madison Paige Palm Springs villa — ArchiCGI Sydney hero shot.
 * Geometry keyed to the clay/greyscale massing: rounded FR corner,
 * three recessed L2 squares, timber wrap + oculus, breeze-block court.
 */

type BoxProps = {
  args: [number, number, number];
  position: [number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  rotation?: [number, number, number];
  map?: THREE.Texture | null;
};

function Box({
  args,
  position,
  color,
  roughness = 0.9,
  metalness = 0.02,
  castShadow = true,
  receiveShadow = true,
  rotation,
  map,
}: BoxProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        map={map ?? undefined}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

function useBrickTex() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#f3f0ea";
    ctx.fillRect(0, 0, size, size);
    const bw = 58;
    const bh = 19;
    for (let y = 0, row = 0; y < size + bh; y += bh, row++) {
      const off = row % 2 === 0 ? 0 : bw / 2;
      for (let x = -bw; x < size + bw; x += bw) {
        const shade = 232 + ((x * 7 + y * 3) % 14);
        ctx.fillStyle = `rgb(${shade},${shade - 1},${shade - 4})`;
        ctx.fillRect(x + off + 1, y + 1, bw - 2, bh - 2);
        ctx.strokeStyle = "rgba(188,182,170,0.95)";
        ctx.lineWidth = 2.2;
        ctx.strokeRect(x + off + 0.5, y + 0.5, bw - 1, bh - 1);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    tex.repeat.set(4.2, 7.2);
    return tex;
  }, []);
}

function useBreezeTex() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#f1eee8";
    ctx.fillRect(0, 0, size, size);
    const n = 6;
    const cell = size / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const cx = (i + 0.5) * cell;
        const cy = (j + 0.5) * cell;
        const r = cell * 0.18;
        ctx.fillStyle = "#e6e1d8";
        ctx.fillRect(i * cell + 2, j * cell + 2, cell - 4, cell - 4);
        // flower / cross hole
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = (k * Math.PI) / 2;
          ctx.ellipse(
            cx + Math.cos(a) * r * 0.55,
            cy + Math.sin(a) * r * 0.55,
            r * 0.55,
            r * 0.35,
            a,
            0,
            Math.PI * 2,
          );
        }
        ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 3.2);
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function usePaverTex() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#d9d5cd";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#c8c3b9";
    ctx.lineWidth = 2;
    const step = size / 8;
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 3.5);
    return tex;
  }, []);
}

/** Rounded-rectangle footprint extruded to height (Y-up). */
function RoundedVolume({
  width,
  depth,
  height,
  position,
  radius,
  corners,
  brick,
}: {
  width: number;
  depth: number;
  height: number;
  position: [number, number, number];
  radius: number;
  /** which corners get radius: fl fr bl br in XZ plane (front = +Z) */
  corners: { fl?: boolean; fr?: boolean; bl?: boolean; br?: boolean };
  brick: THREE.Texture | null;
}) {
  const geom = useMemo(() => {
    const hw = width / 2;
    const hd = depth / 2;
    const r = radius;
    const fl = corners.fl ? r : 0;
    const fr = corners.fr ? r : 0;
    const bl = corners.bl ? r : 0;
    const br = corners.br ? r : 0;
    const s = new THREE.Shape();
    // start bottom-left going CCW in XY of shape (= XZ after rotate)
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

    const g = new THREE.ExtrudeGeometry(s, {
      depth: height,
      bevelEnabled: false,
      curveSegments: 28,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, 0);
    g.computeVertexNormals();
    return g;
  }, [width, depth, height, radius, corners.fl, corners.fr, corners.bl, corners.br]);

  return (
    <mesh geometry={geom} position={position} castShadow receiveShadow>
      <meshStandardMaterial
        color="#f5f2ec"
        map={brick ?? undefined}
        roughness={0.93}
      />
    </mesh>
  );
}

const MAIN_W = 9.4;
const MAIN_D = 8.4;
const MAIN_X = -1.35;
const MAIN_Z = -0.2;
const GF_H = 3.15;
const L2_H = 3.05;
const EAVE = GF_H + L2_H;
const R = 1.65;

const GAR_W = 6.1;
const GAR_D = 6.9;
const GAR_H = 3.05;
const GAR_X = MAIN_X + MAIN_W / 2 + GAR_W / 2 - 0.05;
const GAR_Z = 0.55;
const R_G = 1.5;

const FRONT = MAIN_Z + MAIN_D / 2;

function Massing({ brick }: { brick: THREE.Texture | null }) {
  const frontFaceW = MAIN_W - R - 0.15;
  return (
    <group>
      <RoundedVolume
        width={MAIN_W}
        depth={MAIN_D}
        height={EAVE}
        position={[MAIN_X, 0, MAIN_Z]}
        radius={R}
        corners={{ fr: true }}
        brick={brick}
      />
      {/* explicit brick skins — ExtrudeGeometry UVs are weak */}
      <mesh position={[MAIN_X - R / 2 - 0.05, EAVE / 2, FRONT + 0.015]} receiveShadow>
        <planeGeometry args={[frontFaceW, EAVE]} />
        <meshStandardMaterial
          color="#f7f4ef"
          map={brick ?? undefined}
          roughness={0.92}
        />
      </mesh>
      <mesh
        position={[MAIN_X - MAIN_W / 2 - 0.015, EAVE / 2, MAIN_Z]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[MAIN_D - 0.2, EAVE]} />
        <meshStandardMaterial
          color="#f7f4ef"
          map={brick ?? undefined}
          roughness={0.92}
        />
      </mesh>
      <mesh position={[MAIN_X, EAVE + 0.035, MAIN_Z]}>
        <boxGeometry args={[MAIN_W + 0.04, 0.07, MAIN_D + 0.04]} />
        <meshStandardMaterial color={C.capping} roughness={0.4} metalness={0.15} />
      </mesh>
      <RoundedVolume
        width={2.6}
        depth={3.2}
        height={0.7}
        position={[MAIN_X + 2.2, EAVE, MAIN_Z - 1.6]}
        radius={0.2}
        corners={{}}
        brick={brick}
      />

      <RoundedVolume
        width={GAR_W}
        depth={GAR_D}
        height={GAR_H}
        position={[GAR_X, 0, GAR_Z]}
        radius={R_G}
        corners={{ fl: true }}
        brick={brick}
      />
      <mesh position={[GAR_X + R_G / 2 + 0.1, GAR_H / 2, GAR_Z + GAR_D / 2 + 0.015]} receiveShadow>
        <planeGeometry args={[GAR_W - R_G - 0.2, GAR_H]} />
        <meshStandardMaterial
          color="#f7f4ef"
          map={brick ?? undefined}
          roughness={0.92}
        />
      </mesh>
      <mesh position={[GAR_X, GAR_H + 0.035, GAR_Z]}>
        <boxGeometry args={[GAR_W + 0.04, 0.07, GAR_D + 0.04]} />
        <meshStandardMaterial color={C.capping} roughness={0.4} metalness={0.15} />
      </mesh>
    </group>
  );
}

function UpperWindows() {
  // Continuous recess with THREE clear bays (glass | louvers | glass)
  const y = GF_H + 1.52;
  const zFront = FRONT + 0.04;
  const bay = 1.22;
  const pier = 0.16;
  const total = bay * 3 + pier * 2;
  const cx = MAIN_X - 0.55;
  const bays = [-1, 0, 1].map((i) => cx + i * (bay + pier));

  return (
    <group>
      {/* recessed pocket so openings sit deep */}
      <Box
        args={[total + 0.35, bay + 0.35, 0.38]}
        position={[cx, y, FRONT - 0.14]}
        color="#e8e4dc"
        roughness={0.9}
      />
      {/* dark sill / head band */}
      <Box
        args={[total + 0.2, 0.08, 0.12]}
        position={[cx, y + bay / 2 + 0.02, zFront - 0.02]}
        color={C.frame}
        roughness={0.3}
      />
      <Box
        args={[total + 0.2, 0.08, 0.12]}
        position={[cx, y - bay / 2 - 0.02, zFront - 0.02]}
        color={C.frame}
        roughness={0.3}
      />

      {bays.map((x, i) => (
        <group key={i}>
          <Box
            args={[0.05, bay + 0.08, 0.1]}
            position={[x - bay / 2, y, zFront]}
            color={C.frame}
            roughness={0.28}
          />
          <Box
            args={[0.05, bay + 0.08, 0.1]}
            position={[x + bay / 2, y, zFront]}
            color={C.frame}
            roughness={0.28}
          />
          {i === 1 ? (
            <group>
              <Box
                args={[bay - 0.06, bay - 0.06, 0.04]}
                position={[x, y, zFront + 0.01]}
                color="#111214"
                roughness={0.4}
              />
              {Array.from({ length: 10 }, (_, k) => (
                <Box
                  key={k}
                  args={[bay - 0.14, 0.045, 0.05]}
                  position={[x, y - bay / 2 + 0.14 + k * 0.105, zFront + 0.03]}
                  color="#2a2e32"
                  roughness={0.4}
                  metalness={0.15}
                  castShadow={false}
                />
              ))}
            </group>
          ) : (
            <mesh position={[x, y, zFront + 0.02]}>
              <boxGeometry args={[bay - 0.1, bay - 0.1, 0.03]} />
              <meshPhysicalMaterial
                color="#a8c2d0"
                roughness={0.05}
                metalness={0.05}
                transmission={0.65}
                thickness={0.35}
                transparent
                opacity={0.7}
                ior={1.45}
              />
            </mesh>
          )}
          <Box
            args={[bay - 0.25, bay - 0.25, 0.04]}
            position={[x, y, FRONT - 0.5]}
            color="#f0ebe3"
            castShadow={false}
          />
        </group>
      ))}

      {/* white brick piers between bays */}
      {[-1, 1].map((side) => (
        <Box
          key={side}
          args={[pier - 0.02, bay - 0.05, 0.2]}
          position={[cx + side * (bay / 2 + pier / 2), y, FRONT - 0.05]}
          color="#f2efe9"
          roughness={0.9}
        />
      ))}

      <Box
        args={[0.5, 0.5, 0.09]}
        position={[MAIN_X + 3.45, y, zFront]}
        color={C.frame}
        roughness={0.28}
      />
      <mesh position={[MAIN_X + 3.45, y, zFront + 0.03]}>
        <boxGeometry args={[0.42, 0.42, 0.03]} />
        <meshStandardMaterial color="#15181c" roughness={0.12} />
      </mesh>
    </group>
  );
}

function EntryNiche() {
  const z = FRONT + 0.05;
  const doorX = MAIN_X - 1.45;

  return (
    <group>
      <Box
        args={[1.25, 2.6, 0.4]}
        position={[doorX, 1.3, FRONT - 0.15]}
        color="#ebe7e0"
        roughness={0.9}
      />
      <Box
        args={[1.02, 2.4, 0.09]}
        position={[doorX, 1.25, z + 0.02]}
        color="#f0c4b4"
        roughness={0.42}
      />
      <mesh position={[doorX, 1.25, z + 0.12]} castShadow>
        <sphereGeometry args={[0.06, 20, 16]} />
        <meshStandardMaterial color="#d4b06e" roughness={0.18} metalness={0.88} />
      </mesh>

      <Box
        args={[0.98, 0.36, 0.09]}
        position={[MAIN_X - 3.45, 1.75, z]}
        color={C.frame}
        roughness={0.28}
      />
      <mesh position={[MAIN_X - 3.45, 1.75, z + 0.03]}>
        <boxGeometry args={[0.9, 0.28, 0.03]} />
        <meshStandardMaterial color="#15191d" roughness={0.12} />
      </mesh>
    </group>
  );
}

function TimberWrap() {
  // Timber cladding from door niche, across front, around Art Deco curve
  const cx = MAIN_X + MAIN_W / 2 - R;
  const cz = FRONT - R;
  const h = GF_H - 0.1;
  const r = R + 0.04;
  const count = 58;
  // oculus sits IN the timber field, right of door, before deep curve
  const circleX = MAIN_X + 1.65;
  const circleY = 1.68;
  const circleR = 0.82;

  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        const a = Math.PI / 2 - t * (Math.PI / 2) * 0.98;
        // pull first third of slats left across the flat front toward the door
        const pull = t < 0.55 ? (0.55 - t) * 3.35 : 0;
        const x = cx + Math.cos(a) * r - pull;
        const z = cz + Math.sin(a) * r + 0.06;
        const nearCircle = Math.abs(x - circleX) < circleR * 0.92;
        const color = i % 4 === 0 ? "#9a7348" : "#c09460";
        if (nearCircle) {
          const belowH = Math.max(0.2, circleY - circleR - 0.08);
          const aboveY0 = circleY + circleR;
          const aboveH = Math.max(0.2, h - aboveY0 + 0.08);
          return (
            <group key={i}>
              <Box
                args={[0.052, belowH, 0.1]}
                position={[x, belowH / 2 + 0.05, z]}
                rotation={[0, -a + Math.PI / 2, 0]}
                color={color}
                roughness={0.58}
              />
              <Box
                args={[0.052, aboveH, 0.1]}
                position={[x, aboveY0 + aboveH / 2, z]}
                rotation={[0, -a + Math.PI / 2, 0]}
                color={color}
                roughness={0.58}
              />
            </group>
          );
        }
        return (
          <Box
            key={i}
            args={[0.052, h, 0.1]}
            position={[x, h / 2 + 0.05, z]}
            rotation={[0, -a + Math.PI / 2, 0]}
            color={color}
            roughness={0.58}
          />
        );
      })}

      <mesh position={[circleX, circleY, FRONT + 0.11]}>
        <ringGeometry args={[0.74, 0.88, 64]} />
        <meshStandardMaterial
          color="#121416"
          roughness={0.2}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[circleX, circleY, FRONT + 0.1]}>
        <circleGeometry args={[0.76, 64]} />
        <meshPhysicalMaterial
          color="#6a7f8c"
          roughness={0.05}
          metalness={0.05}
          transmission={0.55}
          thickness={0.4}
          transparent
          opacity={0.85}
          ior={1.45}
        />
      </mesh>
      <Box
        args={[1.7, 1.75, 0.04]}
        position={[circleX, circleY, FRONT - 0.45]}
        color="#2a2622"
        castShadow={false}
      />
    </group>
  );
}

function BreezeCourt({ map }: { map: THREE.Texture | null }) {
  // Low patterned wall left of entry — enclosure, not a full wing
  const wallH = 2.15;
  const wallZ = FRONT + 0.08;
  const x0 = MAIN_X - 4.55;
  return (
    <group>
      <mesh position={[x0 + 1.35, wallH / 2, wallZ]} castShadow>
        <boxGeometry args={[2.9, wallH, 0.18]} />
        <meshStandardMaterial
          color="#f2efe9"
          map={map ?? undefined}
          alphaMap={map ?? undefined}
          alphaTest={0.28}
          roughness={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* return wall into court */}
      <mesh position={[x0 - 0.05, wallH / 2, wallZ - 1.35]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[2.5, wallH, 0.18]} />
        <meshStandardMaterial
          color="#f2efe9"
          map={map ?? undefined}
          alphaMap={map ?? undefined}
          alphaTest={0.28}
          roughness={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Box
        args={[0.22, wallH + 0.05, 0.22]}
        position={[x0 + 2.75, wallH / 2, wallZ]}
        color="#f4f1eb"
      />
    </group>
  );
}

function GarageDoor() {
  const z = GAR_Z + GAR_D / 2 + 0.05;
  const w = 4.75;
  const h = 2.35;
  return (
    <group>
      <Box
        args={[w + 0.18, h + 0.12, 0.1]}
        position={[GAR_X + 0.15, h / 2 + 0.12, z]}
        color="#e8e5df"
        roughness={0.55}
      />
      <Box
        args={[w, h, 0.05]}
        position={[GAR_X + 0.15, h / 2 + 0.1, z + 0.04]}
        color="#f0ede7"
        roughness={0.48}
      />
      {Array.from({ length: 5 }, (_, i) => (
        <Box
          key={i}
          args={[w - 0.12, 0.012, 0.025]}
          position={[GAR_X + 0.15, 0.42 + i * 0.44, z + 0.07]}
          color="#ddd8d0"
          roughness={0.45}
          castShadow={false}
        />
      ))}
      {/* two round wall lights above door */}
      {[ -1.55, 1.55 ].map((dx) => (
        <mesh key={dx} position={[GAR_X + 0.15 + dx, h + 0.42, z + 0.05]} castShadow>
          <sphereGeometry args={[0.07, 12, 10]} />
          <meshStandardMaterial color="#f5f2ec" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function GlassRail() {
  return (
    <group>
      <mesh position={[GAR_X + 0.6, GAR_H + 0.5, GAR_Z + 0.2]}>
        <boxGeometry args={[3.4, 0.68, 0.03]} />
        <meshStandardMaterial
          color="#cfe0e8"
          roughness={0.06}
          metalness={0.15}
          transparent
          opacity={0.22}
        />
      </mesh>
      <Box
        args={[3.4, 0.02, 0.02]}
        position={[GAR_X + 0.6, GAR_H + 0.84, GAR_Z + 0.2]}
        color="#cfcbc3"
        metalness={0.4}
        roughness={0.35}
        castShadow={false}
      />
    </group>
  );
}

function Driveway({ paver }: { paver: THREE.Texture | null }) {
  return (
    <group>
      {/* curved approach — approximate with rotated slabs */}
      <mesh position={[-1.6, 0.025, 9.8]} receiveShadow>
        <boxGeometry args={[5.4, 0.05, 11.5]} />
        <meshStandardMaterial color="#d4d0c8" roughness={0.95} />
      </mesh>
      <mesh position={[1.9, 0.028, 6.4]} rotation={[0, -0.48, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.05, 5.6]} />
        <meshStandardMaterial color="#d4d0c8" roughness={0.95} />
      </mesh>
      <mesh position={[GAR_X + 0.2, 0.032, GAR_Z + GAR_D / 2 + 1.55]} receiveShadow>
        <boxGeometry args={[6.3, 0.05, 3.0]} />
        <meshStandardMaterial
          color="#ddd9d1"
          map={paver ?? undefined}
          roughness={0.88}
        />
      </mesh>
      {/* white gravel bed by garage curve */}
      <mesh position={[GAR_X + GAR_W / 2 - 0.35, 0.04, GAR_Z + GAR_D / 2 - 0.4]} receiveShadow>
        <boxGeometry args={[1.4, 0.06, 2.2]} />
        <meshStandardMaterial color="#ece8e0" roughness={1} />
      </mesh>
    </group>
  );
}

function Eucalyptus({
  position,
  scale = 1,
  spin = 0,
}: {
  position: [number, number, number];
  scale?: number;
  spin?: number;
}) {
  return (
    <group position={position} scale={scale} rotation={[0, spin, 0.03]}>
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.12, 6.4, 8]} />
        <meshStandardMaterial color="#6f5f48" roughness={0.97} />
      </mesh>
      <mesh position={[0.45, 4.4, -0.15]} rotation={[0.2, 0.5, 0.35]} castShadow>
        <cylinderGeometry args={[0.03, 0.055, 3.6, 6]} />
        <meshStandardMaterial color="#6a5a44" roughness={0.97} />
      </mesh>
      <mesh position={[-0.4, 4.8, 0.25]} rotation={[-0.15, -0.4, -0.3]} castShadow>
        <cylinderGeometry args={[0.028, 0.05, 3.2, 6]} />
        <meshStandardMaterial color="#6a5a44" roughness={0.97} />
      </mesh>
      {/* irregular airy canopy — flattened ellipsoids */}
      {[
        [0.1, 5.4, 0.05, 1.7, 1.05, 1.45],
        [1.15, 5.7, 0.35, 1.2, 0.8, 1.1],
        [-1.05, 5.55, -0.25, 1.25, 0.82, 1.15],
        [0.55, 6.35, -0.55, 1.05, 0.72, 0.95],
        [-0.55, 6.15, 0.7, 1.0, 0.68, 0.9],
        [1.4, 5.0, -0.4, 0.9, 0.6, 0.85],
        [-1.25, 4.95, 0.45, 0.85, 0.55, 0.8],
        [0.2, 6.8, 0.15, 0.8, 0.55, 0.75],
        [0.85, 5.95, 0.85, 0.75, 0.5, 0.7],
        [-0.7, 5.2, -0.7, 0.7, 0.48, 0.65],
      ].map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={i} position={[x, y, z]} scale={[sx, sy, sz]} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#455832" : i % 3 === 1 ? "#566b3c" : "#647a45"}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function PalmPot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.27, 0.48, 28]} />
        <meshStandardMaterial color="#f2efe9" roughness={0.48} />
      </mesh>
      {/* rib rings */}
      {[0.12, 0.26, 0.4].map((yy) => (
        <mesh key={yy} position={[0, yy, 0]}>
          <torusGeometry args={[0.31 - yy * 0.05, 0.012, 8, 24]} />
          <meshStandardMaterial color="#e8e4dc" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 24]} />
        <meshStandardMaterial color="#5a4838" roughness={1} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.055, 1.7, 8]} />
        <meshStandardMaterial color="#6e5844" roughness={0.9} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.2, 2.25, Math.sin(a) * 0.2]}
            rotation={[1.05, a, 0.08]}
            castShadow
          >
            <boxGeometry args={[0.11, 0.02, 1.05]} />
            <meshStandardMaterial color="#6f8a4c" roughness={0.94} />
          </mesh>
        );
      })}
    </group>
  );
}

function CactusCluster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[
        [0, 0.7, 0, 0.055, 1.4],
        [0.22, 0.45, 0.08, 0.04, 0.9],
        [-0.18, 0.35, -0.1, 0.035, 0.7],
      ].map(([x, y, z, r, h], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[r as number, (r as number) * 1.05, h as number, 8]} />
          <meshStandardMaterial color="#6a7d4e" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Hedge({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[1.05, 14, 12]} />
        <meshStandardMaterial color="#4e6236" roughness={1} />
      </mesh>
      <mesh position={[0.55, 0.75, 0.3]} castShadow>
        <sphereGeometry args={[0.7, 12, 10]} />
        <meshStandardMaterial color="#5d7344" roughness={1} />
      </mesh>
      <mesh position={[-0.5, 0.7, -0.25]} castShadow>
        <sphereGeometry args={[0.65, 12, 10]} />
        <meshStandardMaterial color="#6a824a" roughness={1} />
      </mesh>
    </group>
  );
}

function Landscape() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0, 2.5]} receiveShadow>
        <circleGeometry args={[26, 64]} />
        <meshStandardMaterial color="#5f7d42" roughness={1} />
      </mesh>
      {/* darker lawn patches */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.01, 5]} receiveShadow>
        <circleGeometry args={[4.5, 32]} />
        <meshStandardMaterial color="#567239" roughness={1} />
      </mesh>

      <Eucalyptus position={[-10.4, 0, 1.0]} scale={0.88} spin={0.4} />
      <Eucalyptus position={[11.0, 0, -0.6]} scale={0.95} spin={-0.7} />
      <Hedge position={[-9.4, 0, 3.4]} scale={1.25} />
      <Hedge position={[10.2, 0, 4.2]} scale={1.05} />
      <PalmPot position={[-6.55, 0, 4.35]} />
      <CactusCluster position={[GAR_X + GAR_W / 2 - 0.15, 0.02, GAR_Z + GAR_D / 2 - 0.55]} />

      {/* rear fence silhouette */}
      <Box
        args={[16, 1.35, 0.06]}
        position={[-2, 0.7, -8.5]}
        color="#f0ece5"
        roughness={0.88}
        castShadow={false}
      />
    </group>
  );
}

function SideWindows() {
  return (
    <group>
      {/* left elevation slots */}
      {[1.6, GF_H + 1.55].map((y, i) => (
        <group key={i}>
          <Box
            args={[0.08, 0.38, 1.05]}
            position={[MAIN_X - MAIN_W / 2 - 0.02, y, MAIN_Z + 0.4]}
            color={C.frame}
            roughness={0.28}
          />
          <mesh position={[MAIN_X - MAIN_W / 2 - 0.04, y, MAIN_Z + 0.4]}>
            <boxGeometry args={[0.03, 0.3, 0.95]} />
            <meshStandardMaterial color="#1a1e22" roughness={0.12} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function LumenCourtVilla() {
  const brick = useBrickTex();
  const breeze = useBreezeTex();
  const paver = usePaverTex();

  return (
    <group position={[0.55, 0.02, 0.55]} rotation={[0, -0.58, 0]} scale={0.84}>
      <Landscape />
      <Driveway paver={paver} />
      <Massing brick={brick} />
      <BreezeCourt map={breeze} />
      <TimberWrap />
      <EntryNiche />
      <UpperWindows />
      <GarageDoor />
      <GlassRail />
      <SideWindows />
      <pointLight
        position={[MAIN_X - 1.2, 2.0, FRONT - 0.2]}
        color="#fff1df"
        intensity={0.5}
        distance={8}
      />
      <pointLight
        position={[MAIN_X + 0.5, 1.85, FRONT - 0.3]}
        color="#fff6ea"
        intensity={0.35}
        distance={6}
      />
    </group>
  );
}
