"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { villaPalette as P } from "./materials";

/**
 * Modern two-storey gable villa from the product-render reference.
 * Footprint 13.6 × 8.6 m (typical modern gable house).
 * Roof 28° Satteldach (German Einfamilienhaus standard ~30°).
 * Pool 7.6 × 3.2 m on a raised stone podium.
 */
const W = 13.6;
const D = 8.6;
const HW = W / 2;
const HD = D / 2;
const GF_H = 3.15;
const L2_H = 3.05;
const EAVE = GF_H + L2_H;
const PITCH = (28 * Math.PI) / 180;
const RISE = (D / 2) * Math.tan(PITCH);
const OVERHANG = 0.48;
const WT = 0.3;
const FZ = HD;

type BoxProps = {
  args: [number, number, number];
  position: [number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  rotation?: [number, number, number];
};

function Box({
  args,
  position,
  color,
  roughness = 0.86,
  metalness = 0.02,
  castShadow = true,
  receiveShadow = true,
  rotation,
}: BoxProps) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

type Hole = { x: number; y: number; w: number; h: number };

function wallSegments(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  holes: Hole[],
): { x: number; y: number; w: number; h: number }[] {
  const segs: { x: number; y: number; w: number; h: number }[] = [];
  const sorted = [...holes].sort((a, b) => a.x - a.w / 2 - (b.x - b.w / 2));
  let cursor = x0;
  const bands: { left: number; right: number; hole?: Hole }[] = [];

  for (const hole of sorted) {
    const left = hole.x - hole.w / 2;
    const right = hole.x + hole.w / 2;
    if (left > cursor + 0.01) bands.push({ left: cursor, right: left });
    bands.push({ left, right, hole });
    cursor = Math.max(cursor, right);
  }
  if (cursor < x1 - 0.01) bands.push({ left: cursor, right: x1 });

  for (const band of bands) {
    const bw = band.right - band.left;
    if (bw < 0.02) continue;
    const cx = (band.left + band.right) / 2;
    if (!band.hole) {
      segs.push({ x: cx, y: (y0 + y1) / 2, w: bw, h: y1 - y0 });
      continue;
    }
    const hy0 = band.hole.y - band.hole.h / 2;
    const hy1 = band.hole.y + band.hole.h / 2;
    if (hy0 - y0 > 0.02) {
      segs.push({ x: cx, y: (y0 + hy0) / 2, w: bw, h: hy0 - y0 });
    }
    if (y1 - hy1 > 0.02) {
      segs.push({ x: cx, y: (hy1 + y1) / 2, w: bw, h: y1 - hy1 });
    }
  }
  return segs;
}

function FacadeWall({
  x0,
  x1,
  y0,
  y1,
  z,
  holes,
  color = P.wall,
}: {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z: number;
  holes: Hole[];
  color?: string;
}) {
  const segs = wallSegments(x0, x1, y0, y1, holes);
  return (
    <group>
      {segs.map((s, i) => (
        <Box
          key={`${s.x}-${s.y}-${i}`}
          args={[s.w, s.h, WT]}
          position={[s.x, s.y, z]}
          color={color}
          roughness={0.9}
        />
      ))}
    </group>
  );
}

function Glass({
  args,
  position,
  opacity = 0.22,
}: {
  args: [number, number, number];
  position: [number, number, number];
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={P.glass}
        roughness={0.06}
        metalness={0.12}
        transparent
        opacity={opacity}
        envMapIntensity={0.85}
      />
    </mesh>
  );
}

function FrameBar({
  args,
  position,
}: {
  args: [number, number, number];
  position: [number, number, number];
}) {
  return (
    <Box
      args={args}
      position={position}
      color={P.frame}
      roughness={0.35}
      metalness={0.55}
      castShadow={false}
    />
  );
}

/** Black aluminum window — 2 vertical lites, flush in the wall. */
function Casement({
  position,
  width = 0.88,
  height = 1.52,
}: {
  position: [number, number, number];
  width?: number;
  height?: number;
}) {
  const t = 0.045;
  return (
    <group position={position}>
      <Glass args={[width - 0.02, height - 0.02, 0.03]} position={[0, 0, 0]} />
      <FrameBar args={[width + 0.02, t, 0.055]} position={[0, height / 2, 0.01]} />
      <FrameBar args={[width + 0.02, t, 0.055]} position={[0, -height / 2, 0.01]} />
      <FrameBar args={[t, height, 0.055]} position={[-width / 2, 0, 0.01]} />
      <FrameBar args={[t, height, 0.055]} position={[width / 2, 0, 0.01]} />
      <FrameBar args={[t * 0.85, height - t, 0.04]} position={[0, 0, 0.015]} />
    </group>
  );
}

/** Floor-to-ceiling sliding door with equal black mullions. */
function Slider({
  position,
  width,
  height = 2.52,
  panes,
}: {
  position: [number, number, number];
  width: number;
  height?: number;
  panes: number;
}) {
  const t = 0.05;
  const paneW = (width - t) / panes;
  return (
    <group position={position}>
      <Glass args={[width - 0.03, height - 0.03, 0.03]} position={[0, 0, 0]} opacity={0.2} />
      <FrameBar args={[width + 0.02, t, 0.06]} position={[0, height / 2, 0.012]} />
      <FrameBar args={[width + 0.02, t, 0.06]} position={[0, -height / 2, 0.012]} />
      {Array.from({ length: panes + 1 }, (_, i) => {
        const x = -width / 2 + i * paneW;
        return <FrameBar key={i} args={[t, height, 0.06]} position={[x, 0, 0.012]} />;
      })}
    </group>
  );
}

function Curtains({
  width,
  height,
  z = -0.18,
}: {
  width: number;
  height: number;
  z?: number;
}) {
  return (
    <group>
      <Box
        args={[0.22, height * 0.92, 0.04]}
        position={[-width / 2 + 0.18, 0, z]}
        color={P.curtain}
        roughness={0.95}
        castShadow={false}
      />
      <Box
        args={[0.22, height * 0.92, 0.04]}
        position={[width / 2 - 0.18, 0, z]}
        color={P.curtain}
        roughness={0.95}
        castShadow={false}
      />
    </group>
  );
}

function ThinRail({
  width,
  height = 1.05,
  z = 0,
}: {
  width: number;
  height?: number;
  z?: number;
}) {
  const count = Math.max(8, Math.round(width / 0.12));
  return (
    <group>
      <Box
        args={[width, 0.025, 0.025]}
        position={[0, height, z]}
        color={P.metal}
        metalness={0.7}
        roughness={0.3}
        castShadow={false}
      />
      <Box
        args={[width, 0.018, 0.018]}
        position={[0, 0.08, z]}
        color={P.metal}
        metalness={0.7}
        roughness={0.3}
        castShadow={false}
      />
      {Array.from({ length: count + 1 }, (_, i) => {
        const x = -width / 2 + (width / count) * i;
        return (
          <Box
            key={i}
            args={[0.016, height, 0.016]}
            position={[x, height / 2, z]}
            color={P.metal}
            metalness={0.7}
            roughness={0.3}
            castShadow={false}
          />
        );
      })}
    </group>
  );
}

function GableRoof() {
  const hw = HW + OVERHANG;
  const hd = HD + OVERHANG;
  const slopeLen = Math.hypot(hd, RISE);
  const pitch = Math.atan2(RISE, hd);

  const gable = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-HD, 0);
    s.lineTo(HD, 0);
    s.lineTo(0, RISE);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  return (
    <group position={[0, EAVE, 0]}>
      {/* thick roof planes — reads as a real Satteldach, not a paper sheet */}
      <Box
        args={[hw * 2, 0.16, slopeLen]}
        position={[0, RISE / 2, hd / 2]}
        rotation={[pitch, 0, 0]}
        color={P.roof}
        roughness={0.9}
      />
      <Box
        args={[hw * 2, 0.16, slopeLen]}
        position={[0, RISE / 2, -hd / 2]}
        rotation={[-pitch, 0, 0]}
        color={P.roof}
        roughness={0.9}
      />

      {/* white soffit so the overhang is not a black void from the front */}
      <Box
        args={[W + 0.1, 0.05, OVERHANG + 0.2]}
        position={[0, -0.03, HD + OVERHANG / 2]}
        color={P.wall}
        roughness={0.88}
        castShadow={false}
      />

      <mesh geometry={gable} position={[-HW, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <meshStandardMaterial color={P.wall} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={gable} position={[HW, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <meshStandardMaterial color={P.wall} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      <Box
        args={[hw * 2 + 0.06, 0.12, 0.12]}
        position={[0, 0.01, hd]}
        color={P.fascia}
        roughness={0.38}
        metalness={0.28}
      />
      <Box
        args={[hw * 2 + 0.06, 0.12, 0.12]}
        position={[0, 0.01, -hd]}
        color={P.fascia}
        roughness={0.38}
        metalness={0.28}
      />
      <Box
        args={[hw * 2 + 0.04, 0.1, 0.16]}
        position={[0, RISE + 0.04, 0]}
        color={P.fascia}
        roughness={0.4}
        metalness={0.22}
      />

      {([-1, 1] as const).flatMap((side) =>
        ([-1, 1] as const).map((slope) => (
          <Box
            key={`${side}-${slope}`}
            args={[0.1, 0.12, slopeLen + 0.08]}
            position={[side * hw, RISE / 2, slope * (hd / 2)]}
            rotation={[slope * pitch, 0, 0]}
            color={P.fascia}
            roughness={0.38}
            metalness={0.28}
          />
        )),
      )}

      <Box
        args={[0.42, 1.15, 0.32]}
        position={[3.05, RISE + 0.42, 0.1]}
        color={P.roof}
        roughness={0.86}
      />
      <Box
        args={[0.5, 0.08, 0.4]}
        position={[3.05, RISE + 1.02, 0.1]}
        color={P.fascia}
        roughness={0.4}
        metalness={0.2}
      />
    </group>
  );
}

function InteriorRooms() {
  return (
    <group>
      {/* room backs so glass is not a black void */}
      <Box
        args={[3.2, 2.7, 0.06]}
        position={[-4.85, 1.4, 3.15]}
        color={P.interior}
        castShadow={false}
      />
      <Box
        args={[4.4, 2.7, 0.06]}
        position={[-0.45, 1.4, 3.05]}
        color={P.interior}
        castShadow={false}
      />
      <Box
        args={[1.4, 2.7, 0.06]}
        position={[4.55, 1.4, 3.25]}
        color={P.interior}
        castShadow={false}
      />
      <Box
        args={[12.8, 0.04, 1.15]}
        position={[0, 0.12, 3.7]}
        color="#e8e4dc"
        roughness={0.75}
        castShadow={false}
      />

      <group position={[-0.35, 0, 3.55]}>
        <Box args={[2.05, 0.2, 1.15]} position={[0, 0.32, 0]} color={P.bedding} roughness={0.8} />
        <Box args={[2.12, 0.28, 0.08]} position={[0, 0.4, -0.52]} color="#d8d2c8" />
        <Box args={[0.52, 0.14, 0.36]} position={[-0.42, 0.5, -0.28]} color="#f5f3ef" />
        <Box args={[0.52, 0.14, 0.36]} position={[0.42, 0.5, -0.28]} color="#f5f3ef" />
      </group>

      <group position={[-4.85, 1.4, 3.85]}>
        <Curtains width={3.1} height={2.4} z={0} />
      </group>
      <group position={[-0.45, 1.4, 3.85]}>
        <Curtains width={4.2} height={2.4} z={0} />
      </group>
      <group position={[4.55, 1.4, 3.85]}>
        <Curtains width={1.2} height={2.4} z={0} />
      </group>
    </group>
  );
}

function Lounger({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0.08, 0]}>
      <Box args={[0.62, 0.07, 1.85]} position={[0, 0.28, 0]} color={P.wood} roughness={0.7} />
      <Box
        args={[0.62, 0.06, 0.55]}
        position={[0, 0.42, -0.78]}
        rotation={[-0.45, 0, 0]}
        color={P.wood}
        roughness={0.7}
      />
      {[-0.26, 0.26].map((x) => (
        <group key={x}>
          <Box args={[0.04, 0.26, 0.04]} position={[x, 0.13, 0.78]} color={P.woodDark} />
          <Box args={[0.04, 0.26, 0.04]} position={[x, 0.13, -0.72]} color={P.woodDark} />
        </group>
      ))}
    </group>
  );
}

function Shrub({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.55, 14, 12]} />
        <meshStandardMaterial color={P.foliage} roughness={1} />
      </mesh>
      <mesh position={[0.22, 0.42, 0.12]} castShadow>
        <sphereGeometry args={[0.32, 12, 10]} />
        <meshStandardMaterial color={P.foliageDark} roughness={1} />
      </mesh>
      <mesh position={[-0.18, 0.38, -0.1]} castShadow>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color={P.foliage} roughness={1} />
      </mesh>
    </group>
  );
}

/** Descending stair rail on the left of the podium — matches the photo diagonal. */
function LeftStairFence() {
  const steps = 4;
  const stepW = 0.52;
  const stepH = 0.115;
  const stepD = 1.25;
  const xHouse = -HW - 0.04;
  const zRail = FZ + 0.22;
  const yTop = 0.92;
  const xEnd = xHouse - steps * stepW;
  const yEnd = yTop - steps * stepH;
  const posts = 6;

  return (
    <group>
      {Array.from({ length: steps }, (_, i) => (
        <Box
          key={`st-${i}`}
          args={[stepW, stepH, stepD]}
          position={[
            xHouse - (i + 0.5) * stepW,
            -(i + 1) * stepH + stepH / 2,
            zRail + 0.35,
          ]}
          color={P.terrace}
          roughness={0.82}
        />
      ))}
      {Array.from({ length: posts }, (_, i) => {
        const t = i / (posts - 1);
        const x = xHouse + (xEnd - xHouse) * t;
        const yHand = yTop + (yEnd - yTop) * t;
        const yBase = -t * steps * stepH;
        const h = Math.max(0.2, yHand - yBase);
        return (
          <Box
            key={`p-${i}`}
            args={[0.018, h, 0.018]}
            position={[x, yBase + h / 2, zRail]}
            color={P.metal}
            metalness={0.7}
            roughness={0.3}
            castShadow={false}
          />
        );
      })}
      <Box
        args={[Math.hypot(xEnd - xHouse, yEnd - yTop), 0.024, 0.024]}
        position={[(xHouse + xEnd) / 2, (yTop + yEnd) / 2, zRail]}
        rotation={[0, 0, Math.atan2(yEnd - yTop, xEnd - xHouse)]}
        color={P.metal}
        metalness={0.7}
        roughness={0.3}
        castShadow={false}
      />
    </group>
  );
}

function TerraceAndPool() {
  const terraceZ = 2.15;
  const terraceD = 13.0;
  return (
    <group>
      {/* dark stone podium */}
      <Box
        args={[15.8, 0.46, terraceD]}
        position={[0.15, -0.23, terraceZ]}
        color={P.podium}
        roughness={0.95}
      />
      {/* white deck */}
      <mesh position={[0.15, 0.005, terraceZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.6, terraceD - 0.12]} />
        <meshStandardMaterial color={P.terrace} roughness={0.82} />
      </mesh>

      {/* pool basin — ~8.2 × 3.4 m, left-of-center like the reference */}
      <Box
        args={[8.25, 0.4, 3.45]}
        position={[-1.15, -0.14, FZ + 2.75]}
        color={P.poolDeep}
        roughness={0.32}
        metalness={0.08}
      />
      <mesh position={[-1.15, 0.03, FZ + 2.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.05, 3.25]} />
        <meshStandardMaterial
          color={P.pool}
          roughness={0.1}
          metalness={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>
      {[
        [0, 0.04, 1.76, 8.3, 0.14] as const,
        [0, 0.04, -1.76, 8.3, 0.14] as const,
        [4.16, 0.04, 0, 0.14, 3.5] as const,
        [-4.16, 0.04, 0, 0.14, 3.5] as const,
      ].map(([x, y, z, a, b], i) => (
        <Box
          key={i}
          args={[a, 0.04, b]}
          position={[-1.15 + x, y, FZ + 2.75 + z]}
          color={P.terrace}
          roughness={0.7}
          castShadow={false}
        />
      ))}

      <Lounger position={[5.45, 0.02, FZ + 2.95]} />
      <Shrub position={[6.7, 0, FZ + 3.65]} />

      <LeftStairFence />
    </group>
  );
}

const GF_LEFT: Hole = { x: -4.85, y: 1.38, w: 3.1, h: 2.52 };
const GF_CENTER: Hole = { x: -0.45, y: 1.38, w: 4.2, h: 2.52 };
const GF_RIGHT: Hole = { x: 4.55, y: 1.38, w: 1.2, h: 2.52 };

const L2_WINS: Hole[] = [
  { x: -5.5, y: GF_H + 1.58, w: 0.9, h: 1.52 },
  { x: -4.2, y: GF_H + 1.58, w: 0.9, h: 1.52 },
  { x: -1.2, y: GF_H + 1.58, w: 0.9, h: 1.52 },
  { x: 0.3, y: GF_H + 1.58, w: 0.9, h: 1.52 },
  { x: 3.9, y: GF_H + 1.52, w: 0.82, h: 1.4 },
  { x: 5.15, y: GF_H + 1.52, w: 0.82, h: 1.4 },
];

export function ModernPoolVilla() {
  const frontZ = FZ - WT / 2;
  const glassZ = FZ + 0.02;
  const balconyW = 8.9;

  return (
    <group position={[0, 0.46, -1.1]}>
      {/* shell */}
      <Box args={[W, 0.16, D]} position={[0, 0.08, 0]} color={P.wallShade} roughness={0.88} />
      <Box args={[WT, EAVE, D]} position={[-HW + WT / 2, EAVE / 2, 0]} color={P.wall} />
      <Box args={[WT, EAVE, D]} position={[HW - WT / 2, EAVE / 2, 0]} color={P.wall} />
      <Box args={[W, EAVE, WT]} position={[0, EAVE / 2, -HD + WT / 2]} color={P.wall} />
      <Box args={[W - 0.2, 0.16, D - 0.1]} position={[0, GF_H, 0]} color={P.wallShade} />

      <FacadeWall
        x0={-HW + WT}
        x1={HW - WT}
        y0={0}
        y1={EAVE}
        z={frontZ}
        holes={[GF_LEFT, GF_CENTER, GF_RIGHT, ...L2_WINS]}
      />

      {/* GF sliders */}
      <Slider position={[GF_LEFT.x, GF_LEFT.y, glassZ]} width={GF_LEFT.w} panes={2} />
      <Slider position={[GF_CENTER.x, GF_CENTER.y, glassZ]} width={GF_CENTER.w} panes={3} />
      <Slider position={[GF_RIGHT.x, GF_RIGHT.y, glassZ]} width={GF_RIGHT.w} panes={1} />

      {/* L2 windows */}
      {L2_WINS.map((w) => (
        <Casement key={w.x} position={[w.x, w.y, glassZ]} width={w.w} height={w.h} />
      ))}

      {/* supporting column between living slider and right door */}
      <Box
        args={[0.46, GF_H - 0.02, 0.46]}
        position={[1.72, GF_H / 2 - 0.01, FZ + 0.22]}
        color="#eceae5"
        roughness={0.86}
      />

      {/* balcony slab + wood deck + rail */}
      <Box
        args={[balconyW, 0.16, 1.22]}
        position={[-2.35, GF_H - 0.02, FZ + 0.55]}
        color={P.wall}
      />
      <mesh
        position={[-2.35, GF_H + 0.075, FZ + 0.58]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[balconyW - 0.08, 1.12]} />
        <meshStandardMaterial color={P.wood} roughness={0.72} />
      </mesh>
      <group position={[-2.35, GF_H + 0.08, FZ + 1.12]}>
        <ThinRail width={balconyW - 0.1} />
      </group>
      {/* returns at balcony ends */}
      <group position={[-2.35 - balconyW / 2 + 0.04, GF_H + 0.08, FZ + 0.55]} rotation={[0, Math.PI / 2, 0]}>
        <ThinRail width={1.1} />
      </group>
      <group position={[-2.35 + balconyW / 2 - 0.04, GF_H + 0.08, FZ + 0.55]} rotation={[0, Math.PI / 2, 0]}>
        <ThinRail width={1.1} />
      </group>

      {/* dark soffit over the right-hand L2 pair */}
      <Box
        args={[3.55, 0.14, 1.35]}
        position={[4.55, 5.42, FZ + 0.35]}
        color={P.fascia}
        roughness={0.45}
        metalness={0.15}
      />

      {/* rear windows so orbit is not a blank box */}
      <Casement position={[-3.2, GF_H + 1.5, -HD + 0.04]} width={1.1} height={1.4} />
      <Casement position={[0.2, GF_H + 1.5, -HD + 0.04]} width={1.1} height={1.4} />
      <Casement position={[3.4, GF_H + 1.5, -HD + 0.04]} width={1.1} height={1.4} />
      <Slider position={[-1.4, 1.35, -HD + 0.04]} width={2.6} panes={2} />

      <GableRoof />
      <InteriorRooms />
      <TerraceAndPool />

      <pointLight position={[-0.4, 2.1, 3.4]} color="#fff6ea" intensity={0.95} distance={8} />
      <pointLight position={[-4.8, 2.0, 3.5]} color="#fff8ee" intensity={0.55} distance={6} />
      <pointLight position={[4.5, 2.0, 3.5]} color="#fff8ee" intensity={0.4} distance={5} />
    </group>
  );
}
