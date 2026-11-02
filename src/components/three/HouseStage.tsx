"use client";

import {
  Suspense,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { cn } from "@/lib/cn";
import { HOUSE_MODEL_URLS } from "@/lib/constants";

type OrbitZoomControls = OrbitControlsImpl;

export type HouseStageHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
};

const ZOOM_STEP = 0.82;
const TARGET_MODEL_SIZE = 14;

function GltfHouse({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const clone = scene.clone(true) as Group;
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material?.isMeshStandardMaterial) {
          material.envMapIntensity = 1.15;
          material.needsUpdate = true;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const scale = TARGET_MODEL_SIZE / maxDim;

    clone.scale.setScalar(scale);
    clone.position.set(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale,
    );

    return clone;
  }, [scene]);

  return <primitive object={model} />;
}

function StageModel({ modelUrl }: { modelUrl?: string }) {
  const url = modelUrl?.trim() ?? "";
  if (!url) return null;
  return (
    <Suspense fallback={null}>
      <GltfHouse url={url} />
    </Suspense>
  );
}

function SoftGround() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.012, 0]}
        receiveShadow
      >
        <circleGeometry args={[30, 96]} />
        <meshStandardMaterial
          color="#e8eaef"
          roughness={0.96}
          metalness={0}
          envMapIntensity={0.2}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.018, 0]}>
        <ringGeometry args={[20, 42, 96]} />
        <meshBasicMaterial color="#f4f5f9" transparent opacity={0.92} />
      </mesh>
    </group>
  );
}

function setDeckOrbitLock(locked: boolean) {
  const deck = document.querySelector<HTMLElement>("[data-property-deck]");
  if (!deck) return;
  if (locked) {
    deck.dataset.orbitLock = "1";
    deck.style.overflowX = "hidden";
  } else {
    delete deck.dataset.orbitLock;
    deck.style.overflowX = "";
  }
}

function StageScene({
  modelUrl,
  controlsRef,
}: {
  modelUrl?: string;
  controlsRef: RefObject<OrbitZoomControls | null>;
}) {
  return (
    <>
      <color attach="background" args={["#f4f5f9"]} />
      <fog attach="fog" args={["#f4f5f9", 34, 70]} />

      <ambientLight intensity={0.42} color="#f6f7f9" />
      <hemisphereLight args={["#ffffff", "#c8ccd2", 0.58]} />
      <directionalLight
        position={[9, 17, 11]}
        intensity={1.55}
        color="#fff1df"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={55}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={20}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-12, 8, 6]} intensity={0.42} color="#dce7f2" />
      <directionalLight position={[3, 6, -12]} intensity={0.32} color="#fff8f0" />
      <directionalLight position={[0, 14, 2]} intensity={0.18} color="#ffffff" />

      <StageModel modelUrl={modelUrl} />
      <SoftGround />

      <Environment preset="apartment" environmentIntensity={0.58} />

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.4}
        scale={42}
        blur={2.6}
        far={20}
        color="#141618"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.85}
        zoomSpeed={0.68}
        minDistance={7.5}
        maxDistance={48}
        minPolarAngle={0.08}
        maxPolarAngle={Math.PI / 2 - 0.03}
        target={[0, 2.7, 0]}
        autoRotate
        autoRotateSpeed={0.32}
        onStart={() => {
          const controls = controlsRef.current;
          if (controls) controls.autoRotate = false;
          setDeckOrbitLock(true);
        }}
        onEnd={() => {
          const controls = controlsRef.current;
          if (controls) controls.autoRotate = true;
          setDeckOrbitLock(false);
        }}
      />
    </>
  );
}

type HouseStageProps = {
  className?: string;
  modelUrl?: string;
};

const HouseStage = forwardRef<HouseStageHandle, HouseStageProps>(
  function HouseStage({ className, modelUrl = "" }, ref) {
    const controlsRef = useRef<OrbitZoomControls | null>(null);

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        controlsRef.current?.dollyIn(ZOOM_STEP);
      },
      zoomOut: () => {
        controlsRef.current?.dollyOut(ZOOM_STEP);
      },
    }));

    return (
      <div
        className={cn(
          "h-full min-h-0 w-full overflow-hidden bg-surface touch-none",
          className,
        )}
        style={{ touchAction: "none" }}
        // Bubble phase only — capture + stopPropagation was blocking OrbitControls.
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <Canvas
          className="h-full w-full touch-none"
          style={{ touchAction: "none" }}
          shadows="soft"
          dpr={[1, 1.75]}
          camera={{
            position: [-11.5, 6.2, 17.5],
            fov: 30,
            near: 0.1,
            far: 140,
          }}
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
          }}
        >
          <StageScene modelUrl={modelUrl} controlsRef={controlsRef} />
        </Canvas>
      </div>
    );
  },
);

export default HouseStage;

for (const url of HOUSE_MODEL_URLS) {
  useGLTF.preload(url);
}
