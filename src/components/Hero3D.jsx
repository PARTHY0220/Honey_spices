import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Suppress Three.js v184 Clock deprecation warnings triggered internally by React Three Fiber
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes('THREE.Clock: This module has been deprecated')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// Procedural Floating Powder Cloud Component representing drifting spice dust clumps
const PowderCloud = ({ position, scale = 1.0, speed = 1.0, initialRotation = [0, 0, 0], colorPalette, particleCount = 200, size = 0.05 }) => {
  const groupRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const threeColors = colorPalette.map(c => new THREE.Color(c));

    for (let i = 0; i < particleCount; i++) {
      // Gaussian cluster distribution (denser at the center, tapering outwards)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.pow(Math.random(), 1.5) * 0.9;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      pos[i * 3 + 2] = r * Math.cos(phi);

      const col = threeColors[Math.floor(Math.random() * threeColors.length)];
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    return [pos, cols];
  }, [particleCount, colorPalette]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    const mx = state.pointer.x * 0.45;
    const my = state.pointer.y * 0.35;

    // Drifting translation with mouse-based parallax spring effect
    const waveY = Math.sin(t) * 0.16;
    const targetX = position[0] + mx * (scale * 1.5);
    const targetY = position[1] + waveY + my * (scale * 1.1);

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);

    // Slow continuous rotation of the cloud to make it feel organic and moving
    groupRef.current.rotation.x = t * 0.06 + initialRotation[0];
    groupRef.current.rotation.y = t * 0.09 + initialRotation[1];
    groupRef.current.rotation.z = Math.cos(t * 0.05) * 0.12 + initialRotation[2];
  });

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]} scale={scale}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={size}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
};

// Curated Background Spice Dust Particles (Drifting background particles)
const SpiceParticles = ({ count = 300 }) => {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const colorsPalette = [
      new THREE.Color('#d97706'), // Gold
      new THREE.Color('#ea580c'), // Orange-copper
      new THREE.Color('#cf1b1b'), // Chili red
      new THREE.Color('#ca8a04'), // Mustard gold
      new THREE.Color('#b45309'), // Dark amber
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;

      const randomColor = colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
      cols[i * 3] = randomColor.r;
      cols[i * 3 + 1] = randomColor.g;
      cols[i * 3 + 2] = randomColor.b;
    }

    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = state.pointer.x * 0.25;
    const my = state.pointer.y * 0.2;

    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let px = posAttr.getX(i);
      let py = posAttr.getY(i);
      let pz = posAttr.getZ(i);

      // Continuous upward drift
      py += 0.002 + (i % 6) * 0.0006;

      // Sinusoidal swaying with mouse influence
      px += Math.sin(t * 0.8 + i) * 0.0018 + mx * 0.003;
      py += my * 0.002;

      // Wrap-around bounds check
      if (py > 4) py = -4;
      if (px > 5.5) px = -5.5;
      if (px < -5.5) px = 5.5;

      posAttr.setXYZ(i, px, py, pz);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

// Swirling Turmeric Powder Vortex Component (glowing center spiral)
const TurmericVortex = ({ count = 600 }) => {
  const pointsRef = useRef();

  const [positions, colors, particleData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const data = [];

    const c1 = new THREE.Color('#f59e0b'); // Golden turmeric
    const c2 = new THREE.Color('#ca8a04'); // Yellow mustard seed
    const c3 = new THREE.Color('#ea580c'); // Orange zest

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.5;
      const y = (Math.random() - 0.5) * 2.0 - 0.6; // lower in viewport

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const rand = Math.random();
      const col = rand < 0.5 ? c1 : rand < 0.85 ? c2 : c3;
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;

      data.push({
        angle,
        radius,
        y,
        speed: 0.1 + Math.random() * 0.3,
        swaySpeed: 0.5 + Math.random() * 1.0,
        swayAmp: 0.03 + Math.random() * 0.06,
      });
    }

    return [pos, cols, data];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = state.pointer.x * 0.3;

    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const data = particleData[i];

      // Update spiral angle
      data.angle += 0.003 * data.speed + mx * 0.001;

      const x = Math.cos(data.angle) * data.radius;
      const z = Math.sin(data.angle) * data.radius;
      const y = data.y + Math.sin(t * data.swaySpeed) * data.swayAmp;

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

// Slow-moving Procedural Smoke/Steam Component
const SmokeEffect = () => {
  const groupRef = useRef();
  const count = 12;

  // Programmatically generate radial smoke textures
  const smokeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.08)');  // Very soft warm amber glow
    grad.addColorStop(0.3, 'rgba(249, 115, 22, 0.03)'); // Muted orange mist
    grad.addColorStop(0.7, 'rgba(253, 251, 247, 0.005)'); // Fade out
    grad.addColorStop(1, 'rgba(253, 251, 247, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
  }, []);

  const smokeData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 5.0,
        y: -3.5 + Math.random() * 3.0,
        z: -2.0 + Math.random() * 2.5,
        scale: 3.0 + Math.random() * 3.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        riseSpeed: 0.03 + Math.random() * 0.05, // Slower smoke rise
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, index) => {
      const data = smokeData[index];

      // Rise vertical position slowly
      data.y += data.riseSpeed * delta;
      const waveX = data.x + Math.sin(t * 0.25 + data.phase) * 0.4;
      child.position.set(waveX, data.y, data.z);

      // Rotate extremely slowly
      child.rotation.z += data.rotSpeed * delta;

      // Soft opacity fades near top/bottom boundaries
      let opacity = 1.0;
      if (data.y > 1.8) {
        opacity = Math.max(0, 1.0 - (data.y - 1.8) / 1.6);
      } else if (data.y < -1.5) {
        opacity = Math.min(1.0, (data.y + 3.5) / 2.0);
      }
      child.material.opacity = opacity * 0.4;

      // Loop back to bottom
      if (data.y > 3.4) {
        data.y = -3.5;
        data.x = (Math.random() - 0.5) * 5.0;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {smokeData.map((data, idx) => (
        <mesh key={idx} position={[data.x, data.y, data.z]} rotation={[0, 0, data.rotation]}>
          <planeGeometry args={[data.scale, data.scale]} />
          <meshBasicMaterial
            map={smokeTexture}
            transparent
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Subtle interactive scene camera movement
const SceneController = () => {
  useFrame((state) => {
    const mx = state.pointer.x * 0.4;
    const my = state.pointer.y * 0.25;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mx, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, my, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// Main 3D Canvas wrapper with transparency settings
const Hero3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-transparent overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.8} />
        {/* Golden key spot light */}
        <spotLight
          position={[6, 8, 5]}
          angle={0.4}
          penumbra={1}
          intensity={2.5}
          color="#f59e0b"
          castShadow
        />
        {/* Soft fill blue light for contrast */}
        <directionalLight position={[-5, 5, 2]} intensity={0.7} color="#3b82f6" />
        {/* Warm saffron point glow at bottom center */}
        <pointLight position={[0, -2, 1]} intensity={2.2} distance={6} color="#f97316" />

        {/* 3D Elements */}
        <SpiceParticles count={350} />
        <TurmericVortex count={650} />
        <SmokeEffect />

        {/* Floating Spice Powder Clouds (replacing chilis) */}
        {/* 1. Turmeric Powder (Golden-yellow, left side) */}
        <PowderCloud
          position={[-2.2, 0.6, 1.2]}
          scale={1.2}
          speed={0.8}
          initialRotation={[0.2, 0.5, 0.1]}
          colorPalette={['#f59e0b', '#ca8a04', '#eab308']}
          particleCount={250}
          size={0.045}
        />

        {/* 2. Red Chili Powder (Vibrant crimson, right side) */}
        <PowderCloud
          position={[2.2, -0.6, 0.8]}
          scale={1.1}
          speed={1.1}
          initialRotation={[1.1, -0.6, 0.4]}
          colorPalette={['#ef4444', '#dc2626', '#b91c1c']}
          particleCount={250}
          size={0.04}
        />

        {/* 3. Cinnamon Powder (Warm brown/tan, center background) */}
        <PowderCloud
          position={[0.6, 1.5, -1.5]}
          scale={0.9}
          speed={0.7}
          initialRotation={[0.5, 1.8, 0.2]}
          colorPalette={['#78350f', '#92400e', '#b45309']}
          particleCount={220}
          size={0.05}
        />

        <SceneController />
      </Canvas>

      {/* Luxury Vignette Shader Overlay - transparent black to blend with dark video background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.85)_100%)]"></div>
    </div>
  );
};

export default Hero3D;
