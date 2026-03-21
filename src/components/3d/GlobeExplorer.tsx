"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";

interface UniPin {
  name: string;
  slug: string;
  country: string;
  countrySlug: string;
  lat: number;
  lng: number;
  ranking: string;
  fees: string;
}

const UNIVERSITIES: UniPin[] = [
  // India
  { name: "IIT Bombay", slug: "iit-bombay", country: "India", countrySlug: "india", lat: 19.1334, lng: 72.9133, ranking: "#1 NIRF", fees: "₹12L total" },
  { name: "IIT Delhi", slug: "iit-delhi", country: "India", countrySlug: "india", lat: 28.5459, lng: 77.1926, ranking: "#2 NIRF", fees: "₹12L total" },
  // USA
  { name: "MIT", slug: "mit", country: "USA", countrySlug: "usa", lat: 42.3601, lng: -71.0942, ranking: "#1 Global", fees: "₹68L/yr" },
  { name: "Stanford", slug: "stanford", country: "USA", countrySlug: "usa", lat: 37.4275, lng: -122.1697, ranking: "#2 Global", fees: "₹70L/yr" },
  { name: "Carnegie Mellon", slug: "cmu", country: "USA", countrySlug: "usa", lat: 40.4433, lng: -79.9436, ranking: "#1 CS", fees: "₹52L/yr" },
  { name: "Georgia Tech", slug: "georgia-tech", country: "USA", countrySlug: "usa", lat: 33.7756, lng: -84.3963, ranking: "Top 5-10", fees: "₹46L/yr" },
  // Germany
  { name: "TU Munich", slug: "tu-munich", country: "Germany", countrySlug: "germany", lat: 48.1497, lng: 11.5679, ranking: "#1 Germany", fees: "Almost free" },
  { name: "RWTH Aachen", slug: "rwth-aachen", country: "Germany", countrySlug: "germany", lat: 50.7784, lng: 6.0594, ranking: "#1 Eng DE", fees: "Almost free" },
  { name: "TU Berlin", slug: "tu-berlin", country: "Germany", countrySlug: "germany", lat: 52.5125, lng: 13.3269, ranking: "Top 3-5 DE", fees: "Almost free" },
  // UK
  { name: "Imperial College", slug: "imperial", country: "UK", countrySlug: "uk", lat: 51.4988, lng: -0.1749, ranking: "#3 QS Global", fees: "₹40L/yr" },
  { name: "Cambridge", slug: "cambridge", country: "UK", countrySlug: "uk", lat: 52.2043, lng: 0.1149, ranking: "#2 QS Global", fees: "₹35L/yr" },
  // Canada
  { name: "U of Toronto", slug: "u-toronto", country: "Canada", countrySlug: "canada", lat: 43.6629, lng: -79.3957, ranking: "#1 Canada", fees: "₹30L/yr" },
  { name: "Waterloo", slug: "waterloo", country: "Canada", countrySlug: "canada", lat: 43.4723, lng: -80.5449, ranking: "Top 3 Eng CA", fees: "₹28L/yr" },
  // Australia
  { name: "U of Melbourne", slug: "u-melbourne", country: "Australia", countrySlug: "australia", lat: -37.7983, lng: 144.9610, ranking: "#1 Australia", fees: "₹25L/yr" },
  { name: "UNSW", slug: "unsw", country: "Australia", countrySlug: "australia", lat: -33.9173, lng: 151.2313, ranking: "Top 3 AU", fees: "₹24L/yr" },
];

function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

function GlobeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#1a1a2e"
        wireframe={false}
        transparent
        opacity={0.9}
        roughness={0.8}
        metalness={0.2}
      />
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.005, 32, 32]} />
        <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.08} />
      </mesh>
    </mesh>
  );
}

function Pin({ uni, onClick, isSelected }: { uni: UniPin; onClick: () => void; isSelected: boolean }) {
  const [hovered, setHovered] = useState(false);
  const pos = latLngToVector3(uni.lat, uni.lng, 2.05);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const scale = hovered || isSelected ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#3B82F6"
          emissiveIntensity={hovered || isSelected ? 2 : 0.8}
        />
      </mesh>
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.08, 32]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={hovered || isSelected ? 0.6 : 0.2} side={THREE.DoubleSide} />
      </mesh>
      {hovered && !isSelected && (
        <Html distanceFactor={6} center style={{ pointerEvents: "none" }}>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <div className="text-xs font-semibold text-[var(--foreground)]">{uni.name}</div>
            <div className="text-[10px] text-[var(--muted-foreground)]">{uni.country} · {uni.ranking}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function InfoPanel({ uni, onClose }: { uni: UniPin; onClose: () => void }) {
  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 overflow-y-auto shadow-2xl z-10 animate-slide-in">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm cursor-pointer"
      >
        ✕
      </button>
      <h2 className="text-lg font-bold text-[var(--foreground)] mb-1 pr-6">{uni.name}</h2>
      <p className="text-xs text-[var(--muted-foreground)] mb-4">{uni.country} · {uni.ranking}</p>

      <div className="space-y-3 mb-4">
        <div className="p-3 rounded-lg bg-[var(--muted)]">
          <div className="text-[10px] text-[var(--muted-foreground)] uppercase">Annual Cost (INR)</div>
          <div className="text-sm font-semibold text-blue-500">{uni.fees}</div>
        </div>
      </div>

      <a
        href={`/engineering/${uni.countrySlug}/${uni.slug}`}
        className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-500 text-white text-xs font-semibold no-underline hover:bg-blue-600 transition-colors"
      >
        View Full Profile →
      </a>
    </div>
  );
}

export function GlobeExplorer() {
  const [selected, setSelected] = useState<UniPin | null>(null);

  return (
    <div className="relative w-full h-[80vh]">
      {selected && (
        <InfoPanel uni={selected} onClose={() => setSelected(null)} />
      )}
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3B82F6" />

        <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />

        <GlobeSphere />

        {UNIVERSITIES.map((uni) => (
          <Pin
            key={uni.slug}
            uni={uni}
            onClick={() => setSelected(uni)}
            isSelected={selected?.slug === uni.slug}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
