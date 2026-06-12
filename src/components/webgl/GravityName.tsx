import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const LETTERS = 'SAI NIKHIL'.split('');

/** letter texture drawn on canvas — uses the loaded Archivo webfont */
const makeLetterTexture = (letter: string) => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#211E1A';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#3D382F';
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, size, size);
  ctx.fillStyle = '#EAE5DA';
  ctx.font = `700 170px 'Archivo Variable', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, size / 2, size / 2 + 10);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
};

const LetterBlock = ({
  letter,
  index,
  resetKey,
}: {
  letter: string;
  index: number;
  resetKey: number;
}) => {
  const body = useRef<RapierRigidBody>(null);
  const texture = useMemo(() => makeLetterTexture(letter), [letter]);

  const startX = (index - LETTERS.length / 2) * 1.25 + 0.6;

  const flick = () => {
    body.current?.applyImpulse(
      {
        x: (Math.random() - 0.5) * 14,
        y: 10 + Math.random() * 8,
        z: 0,
      },
      true
    );
    body.current?.applyTorqueImpulse(
      { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4, z: (Math.random() - 0.5) * 4 },
      true
    );
  };

  return (
    <RigidBody
      key={resetKey}
      ref={body}
      position={[startX, 6 + index * 0.7, 0]}
      rotation={[0, 0, (Math.random() - 0.5) * 0.5]}
      restitution={0.4}
      friction={0.8}
      colliders="cuboid"
    >
      <mesh onPointerDown={flick} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  );
};

const Scene = ({ resetKey }: { resetKey: number }) => (
  <>
    <ambientLight intensity={1.1} />
    <directionalLight position={[4, 8, 6]} intensity={1.4} />

    <Physics gravity={[0, -14, 0]}>
      {LETTERS.map((l, i) =>
        l === ' ' ? null : (
          <LetterBlock key={`${i}-${resetKey}`} letter={l} index={i} resetKey={resetKey} />
        )
      )}

      {/* floor + side walls keep blocks in frame */}
      <CuboidCollider position={[0, -2.6, 0]} args={[16, 0.5, 8]} />
      <CuboidCollider position={[-9.5, 2, 0]} args={[0.5, 12, 8]} />
      <CuboidCollider position={[9.5, 2, 0]} args={[0.5, 12, 8]} />
      <CuboidCollider position={[0, 2, -2.5]} args={[16, 12, 0.5]} />
      <CuboidCollider position={[0, 2, 2.5]} args={[16, 12, 0.5]} />
    </Physics>
  </>
);

/**
 * Bruno-homage physics toy in the footer — letterblocks spelling the name
 * fall under gravity; click/tap a block to flick it. Desktop-only mount
 * (guarded by Footer).
 */
const GravityName = () => {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.4, 11], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene resetKey={resetKey} />
        </Suspense>
      </Canvas>
      <button
        onClick={() => setResetKey((k) => k + 1)}
        className="text-label absolute right-6 top-4 z-10 text-[#EAE5DA]/50 transition-colors hover:text-[#6670FF]"
      >
        Reset ↺
      </button>
    </div>
  );
};

export default GravityName;
