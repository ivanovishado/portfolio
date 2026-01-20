"use client";

import { useRef } from "react";
import { useFrame, useThree, extend, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * Cinematic Black Hole Shader Material
 */
const BlackHoleMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uMouse: new THREE.Vector2(0, 0),
    uColorCore: new THREE.Color("#000000"), // Event Horizon
    uColorDiskInner: new THREE.Color("#ffaa55"), // Inner hot disk
    uColorDiskOuter: new THREE.Color("#cc4422"), // Outer cooler disk
    uScale: 1.0, // Scale factor (1.0 = default, >1.0 = zoom in)
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uColorCore;
    uniform vec3 uColorDiskInner;
    uniform vec3 uColorDiskOuter;
    uniform float uScale;
    varying vec2 vUv;

    // Standard Simplex-like Noise
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec2 x) {
      vec2 p = floor(x);
      vec2 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      float n = p.x + p.y * 57.0;
      return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                 mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
    }

    // Original FBM for the "Good" animation style
    float fbm(vec2 p) {
      float f = 0.0;
      f += 0.50000 * noise(p); p = p * 2.02; // Restored original lacunarity
      f += 0.25000 * noise(p); p = p * 2.03;
      f += 0.12500 * noise(p); p = p * 2.01;
      f += 0.06250 * noise(p); p = p * 2.04;
      f += 0.03125 * noise(p);
      return f / 0.984375;
    }

    void main() {
      // Use gl_FragCoord for screen-space UVs
      vec2 drawingResolution = uResolution;
      vec2 screenUv = gl_FragCoord.xy / drawingResolution.xy;
      vec2 uv = (screenUv - 0.5) * 2.0;

      // Fix Aspect Ratio: Scale based on the shortest dimension
      float minDim = min(drawingResolution.x, drawingResolution.y);
      uv.x *= drawingResolution.x / minDim;
      uv.y *= drawingResolution.y / minDim;

      // Apply Scale (Zoom)
      uv /= uScale;

      // Mouse interactive tilt/pan (subtle)
      uv += uMouse * 0.1;

      // Parameters
      float radius = length(uv);
      float eventHorizon = 0.3; // Black hole size
      float diskInner = 0.5;
      float diskOuter = 1.4;

      // Distortion (Gravitational Lensing approximation)
      float distortion = 1.0 / pow(radius, 0.8) * 0.05;
      vec2 distortedUv = uv * (1.0 - distortion * smoothstep(eventHorizon, 0.0, radius));

      // Accretion Disk Physics
      float tilt = 3.0;
      vec2 diskUv = vec2(uv.x, uv.y * tilt);
      float diskRadius = length(diskUv);

      // Angle for rotation
      float angle = atan(diskUv.y, diskUv.x);

      // Spiral/Rotation dynamics
      // Restored original speed curve for the "Good" animation
      float speed = 2.0 / (diskRadius + 0.1);
      float rotation = angle + uTime * speed;

      // SEAMLESS POLAR NOISE TRICK:
      // Instead of using the angle directly (which jumps from PI to -PI),
      // we sample noise using 2D coordinates derived from the angle (Time, Cos, Sin).
      // This is mathematically seamless.
      // We essentially map the 1D ring of the disk to a circle in the 2D noise domain.

      float noiseScale = 3.0;
      vec2 noiseCoord = vec2(cos(rotation), sin(rotation)) * (diskRadius * noiseScale);

      // Add time to flow outward/inward
      noiseCoord += vec2(uTime * 0.2);

      // Disk Texture Generation via FBM
      float noiseVal = fbm(noiseCoord);

      // Ring Mask (Soft edges)
      float diskMask = smoothstep(diskInner, diskInner + 0.1, diskRadius) *
                       smoothstep(diskOuter, diskOuter - 0.4, diskRadius);

      // Doppler Beaming (Relativistic Brightening)
      float doppler = 1.0 + 0.5 * -cos(angle);

      // Compose Disk Color
      vec3 diskColor = mix(uColorDiskOuter, uColorDiskInner, noiseVal + (1.0 - diskRadius));
      diskColor *= noiseVal * 2.0; // Intensity
      diskColor *= diskMask; // Shape
      diskColor *= doppler; // Physics

      // Gravitational Lensing of the background
      float lensRing = smoothstep(eventHorizon + 0.02, eventHorizon, radius) *
                       smoothstep(eventHorizon - 0.05, eventHorizon, radius) * 2.0;

      // Composition
      vec3 finalColor = vec3(0.0);

      // 1. Add Disk
      finalColor += diskColor;

      // 2. Add Event Horizon (Black hole core)
      float coreMask = smoothstep(eventHorizon, eventHorizon - 0.01, radius);
      finalColor = mix(finalColor, vec3(0.0), coreMask);

      // 3. Add Glow/Atmosphere
      float glow = 1.0 / (radius * 3.0) * 0.1;
      finalColor += vec3(glow * 0.5, glow * 0.4, glow * 0.8);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
);

extend({ BlackHoleMaterial });

// Add types for the custom shader material via module augmentation
declare module "@react-three/fiber" {
  interface ThreeElements {
    blackHoleMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      uTime?: number;
      uResolution?: THREE.Vector2;
      uMouse?: THREE.Vector2;
      uColorCore?: THREE.Color;
      uColorDiskInner?: THREE.Color;
      uColorDiskOuter?: THREE.Color;
      uScale?: number;
    };
  }
}

export default function BlackHoleScene() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);
  const { size, viewport, pointer } = useThree();

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Animation Speed Control
      // Active for 5s (initial expansion/swirl), then slows to a drift
      const timeLimit = 5.0;
      const elapsed = state.clock.elapsedTime;

      // Speed logic: Fast initially (0.3), then minimal drift (0.05)
      const speed = elapsed < timeLimit ? 0.3 : 0.05;

      // Accumulate time manually to allow variable speed
      timeRef.current += delta * speed;
      materialRef.current.uniforms.uTime.value = timeRef.current;

      // Fix for High-DPI screens (Mobile/Retina)
      // We must use the drawing buffer size (physical pixels) for gl_FragCoord to map correctly to 0..1
      const drawingSize = new THREE.Vector2();
      state.gl.getDrawingBufferSize(drawingSize);
      materialRef.current.uniforms.uResolution.value.copy(drawingSize);

      // Responsive Scaling:
      // 1. Mobile (Portrait): Scale up (2.5x) to create "Cosmic Eye" effect
      // 2. Ultrawide (Aspect > 2.0): Scale up (1.5x) to fill empty massive space
      // 3. Standard (Landscape): Default scale (1.0x)
      const aspectRatio = size.width / size.height;
      let targetScale = 1.0;

      if (size.width < size.height) {
        targetScale = 2.5;
      } else if (aspectRatio > 2.0) {
        targetScale = 1.5;
      }

      materialRef.current.uniforms.uScale.value = targetScale;

      // Subtle parallax based on mouse
      // Smoothly interpolate current value to target
      materialRef.current.uniforms.uMouse.value.lerp(pointer, 0.05);
    }
  });

  // Calculate scale to cover viewport
  // We use a plane that covers the screen
  const scale = Math.max(viewport.width, viewport.height) * 2; // Extra large just in case

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <mesh scale={[scale, scale, 1]}>
        <planeGeometry args={[1, 1]} />
        <blackHoleMaterial ref={materialRef} transparent depthWrite={false} />
      </mesh>
    </>
  );
}
