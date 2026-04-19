"use client"

import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"

type MProps = {
  /** Footprint in tile units: X width, Z depth on floor */
  w: number
  h: number
  accent: string
}

/** Shared material — DoubleSide avoids broken lighting when parent uses negative scale (flip). */
function Mat({
  color,
  roughness = 0.45,
  metalness = 0.12,
  transparent,
  opacity,
}: {
  color: string
  roughness?: number
  metalness?: number
  transparent?: boolean
  opacity?: number
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      transparent={transparent}
      opacity={opacity}
      side={THREE.DoubleSide}
      polygonOffset={Boolean(transparent)}
      polygonOffsetFactor={transparent ? -0.5 : 0}
      polygonOffsetUnits={transparent ? -0.5 : 0}
    />
  )
}

function inset(v: number, ratio = 0.9) {
  return Math.max(0.12, v * ratio)
}

export function GenericFurniture({ w, h, accent }: MProps) {
  const hx = inset(w)
  const hz = inset(h)
  const hy = Math.min(0.55, 0.28 + Math.min(w, h) * 0.08)
  return (
    <RoundedBox
      args={[hx, hy, hz]}
      radius={0.05}
      smoothness={3}
      castShadow
      receiveShadow
      position={[0, hy / 2 + 0.001, 0]}
    >
      <Mat color={accent} />
    </RoundedBox>
  )
}

/** Bathtub: low rim + curved inner volume */
export function BathTubMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.88)
  const rimH = 0.22
  return (
    <group position={[0, 0, 0]}>
      <RoundedBox
        args={[lx, rimH, lz]}
        radius={0.06}
        smoothness={3}
        castShadow
        receiveShadow
        position={[0, rimH / 2 + 0.001, 0]}
      >
        <Mat color="#ece8e2" roughness={0.32} metalness={0.28} />
      </RoundedBox>
      <mesh position={[0, rimH * 0.35 + 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[lx * 0.82, 0.08, lz * 0.78]} />
        <Mat color="#f8f6f3" roughness={0.25} metalness={0.15} />
      </mesh>
      <mesh position={[0, rimH + 0.02, -lz * 0.22]} castShadow>
        <boxGeometry args={[lx * 0.32, 0.14, lz * 0.28]} />
        <Mat color={accent} roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  )
}

export function BathToiletMesh({ w, h, accent }: MProps) {
  const bowlR = Math.min(0.22, w * 0.32)
  const tankW = inset(w, 0.58)
  const tankD = inset(h, 0.55)
  const tankH = 0.42
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, bowlR * 0.5 + 0.02, h * 0.05]} rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[bowlR, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <Mat color="#f2f0ec" roughness={0.48} />
      </mesh>
      <mesh castShadow position={[0, tankH * 0.5 + bowlR * 0.35, -tankD * 0.2]}>
        <boxGeometry args={[tankW, tankH, tankD]} />
        <Mat color="#e5e3df" roughness={0.52} />
      </mesh>
      <mesh castShadow position={[0, tankH + bowlR * 0.3 + 0.04, -tankD * 0.22]}>
        <boxGeometry args={[tankW * 0.92, 0.05, tankD * 0.75]} />
        <Mat color={accent} roughness={0.38} metalness={0.18} />
      </mesh>
    </group>
  )
}

export function BathSinkMesh({ w, h, accent }: MProps) {
  const r = Math.min(0.26, w * 0.38)
  const pedH = Math.min(0.42, 0.28 + h * 0.08)
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, pedH + r * 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.85, r * 0.12, 12, 28]} />
        <Mat color="#fafafa" roughness={0.22} metalness={0.4} />
      </mesh>
      <mesh castShadow position={[0, pedH * 0.5, 0]}>
        <cylinderGeometry args={[r * 0.55, r * 0.62, pedH, 20]} />
        <Mat color="#e4e0da" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, pedH + r * 0.55, h * 0.08]}>
        <boxGeometry args={[r * 0.22, r * 0.35, inset(h, 0.35)]} />
        <Mat color={accent} metalness={0.72} roughness={0.22} />
      </mesh>
    </group>
  )
}

export function BathShowerMesh({ w, h, accent }: MProps) {
  const sx = inset(w, 0.9)
  const sz = inset(h, 0.9)
  const sy = Math.min(h * 0.95 + 0.2, Math.max(1.1, h * 1.05))
  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, sy * 0.02 + 0.01, 0]}>
        <boxGeometry args={[sx, 0.05, sz]} />
        <Mat color="#b8b4ae" roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0, sy * 0.5 + 0.04, 0]}>
        <boxGeometry args={[sx * 0.98, sy, sz * 0.98]} />
        <Mat
          color="#cfe8f5"
          roughness={0.06}
          metalness={0.08}
          transparent
          opacity={0.28}
        />
      </mesh>
      <mesh castShadow position={[0, sy * 0.55, -sz * 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.12, 10]} />
        <Mat color={accent} metalness={0.8} roughness={0.18} />
      </mesh>
    </group>
  )
}

export function BathVanityMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.88)
  const baseH = 0.36
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, baseH / 2 + 0.001, 0]}>
        <boxGeometry args={[lx, baseH, lz]} />
        <Mat color="#4a3428" roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0, baseH + 0.05, -lz * 0.06]}>
        <boxGeometry args={[lx * 0.96, 0.09, lz * 0.58]} />
        <Mat color="#f4f2ee" roughness={0.28} metalness={0.12} />
      </mesh>
      <mesh position={[0, baseH + 0.38, -lz * 0.28]}>
        <boxGeometry args={[lx * 0.55, 0.52, 0.045]} />
        <Mat color="#c5dce8" roughness={0.15} metalness={0.35} transparent opacity={0.55} />
      </mesh>
      <mesh castShadow position={[lx * 0.32, baseH * 0.55, lz * 0.32]}>
        <cylinderGeometry args={[0.055, 0.055, 0.26, 14]} />
        <Mat color={accent} metalness={0.55} roughness={0.28} />
      </mesh>
    </group>
  )
}

export function SofaMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.92)
  const lz = inset(h, 0.88)
  const seatH = 0.26
  const seatY = seatH / 2 + 0.002
  return (
    <group position={[0, 0, 0]}>
      <RoundedBox
        args={[lx, seatH, lz * 0.72]}
        radius={0.06}
        smoothness={3}
        castShadow
        receiveShadow
        position={[0, seatY, lz * 0.06]}
      >
        <Mat color={accent} roughness={0.88} />
      </RoundedBox>
      <RoundedBox
        args={[lx * 0.98, 0.4, 0.12]}
        radius={0.05}
        smoothness={2}
        castShadow
        position={[0, seatY + 0.22, -lz * 0.34]}
      >
        <Mat color={accent} roughness={0.9} />
      </RoundedBox>
      <mesh castShadow position={[0, seatY + 0.32, -lz * 0.04]}>
        <boxGeometry args={[lx * 0.82, 0.1, lz * 0.5]} />
        <Mat color="#d8d4d0" roughness={0.88} />
      </mesh>
    </group>
  )
}

export function TvUnitMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.88)
  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[lx, 0.12, lz]} />
        <Mat color="#3d2e24" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.34, 0]}>
        <boxGeometry args={[lx * 0.96, 0.44, lz * 0.72]} />
        <Mat color="#2a2a2a" roughness={0.52} metalness={0.12} />
      </mesh>
      <mesh castShadow position={[0, 0.62, 0.02]}>
        <boxGeometry args={[lx * 0.88, 0.38, 0.055]} />
        <Mat color="#0a0a0a" roughness={0.18} metalness={0.55} />
      </mesh>
      <mesh castShadow position={[lx * 0.28, 0.38, lz * 0.28]}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <Mat color={accent} metalness={0.35} roughness={0.35} />
      </mesh>
    </group>
  )
}

export function CoffeeTableMesh({ w, h, accent }: MProps) {
  const topR = Math.min(0.42, Math.min(w, h) * 0.38)
  const legH = 0.26
  const topY = legH + 0.03
  const ox = Math.min(w, h) * 0.36
  const oz = Math.min(w, h) * 0.36
  const legs = [
    [ox, oz],
    [-ox, oz],
    [ox, -oz],
    [-ox, -oz],
  ] as const
  return (
    <group position={[0, 0, 0]}>
      {legs.map(([lx, lz], i) => (
        <mesh key={i} castShadow position={[lx, legH / 2 + 0.01, lz]}>
          <cylinderGeometry args={[0.035, 0.04, legH, 10]} />
          <Mat color="#2a2a2a" metalness={0.45} roughness={0.35} />
        </mesh>
      ))}
      <mesh castShadow position={[0, topY, 0]}>
        <cylinderGeometry args={[topR, topR, 0.045, 40]} />
        <Mat color="#b8956a" roughness={0.42} metalness={0.06} />
      </mesh>
      <mesh position={[0, topY + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[topR * 0.45, 0.012, 8, 28]} />
        <Mat color={accent} metalness={0.55} roughness={0.28} />
      </mesh>
    </group>
  )
}

export function ArmchairMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.92)
  const lz = inset(h, 0.92)
  const seatH = 0.24
  const sy = seatH / 2 + 0.002
  return (
    <group position={[0, 0, 0]}>
      <RoundedBox
        args={[lx, seatH, lz * 0.72]}
        radius={0.06}
        castShadow
        position={[0, sy, lz * 0.04]}
      >
        <Mat color={accent} roughness={0.88} />
      </RoundedBox>
      <RoundedBox
        args={[lx * 0.95, 0.36, 0.11]}
        radius={0.045}
        castShadow
        position={[0, sy + 0.2, -lz * 0.32]}
      >
        <Mat color={accent} roughness={0.9} />
      </RoundedBox>
    </group>
  )
}

export function FloorLampMesh({ w, h, accent }: MProps) {
  const poleH = Math.min(1.45, 0.95 + 0.25 * Math.max(w, h))
  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.13, 0.14, 0.045, 20]} />
        <Mat color="#1c1c1c" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0, poleH * 0.5 + 0.025, 0]}>
        <cylinderGeometry args={[0.038, 0.045, poleH, 12]} />
        <Mat color="#2d2d2d" metalness={0.5} roughness={0.32} />
      </mesh>
      <mesh castShadow position={[0, poleH + 0.12, 0]}>
        <coneGeometry args={[0.2, 0.26, 16, 1, false]} />
        <Mat color="#fff6e0" roughness={0.38} metalness={0.04} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, poleH + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.018, 8, 22]} />
        <Mat color={accent} metalness={0.45} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function DiningTableMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.92)
  const lz = inset(h, 0.92)
  const legH = 0.3
  const topY = legH + 0.04
  const ox = lx * 0.38
  const oz = lz * 0.38
  return (
    <group position={[0, 0, 0]}>
      {[
        [ox, oz],
        [-ox, oz],
        [ox, -oz],
        [-ox, -oz],
      ].map(([px, pz], i) => (
        <mesh key={i} castShadow position={[px, legH / 2 + 0.01, pz]}>
          <cylinderGeometry args={[0.045, 0.04, legH, 10]} />
          <Mat color="#352a22" roughness={0.55} />
        </mesh>
      ))}
      <mesh castShadow position={[0, topY, 0]}>
        <boxGeometry args={[lx, 0.055, lz]} />
        <Mat color="#7a5c28" roughness={0.48} metalness={0.04} />
      </mesh>
      <mesh position={[0, topY + 0.04, 0]}>
        <boxGeometry args={[lx * 0.22, 0.035, lz * 0.22]} />
        <Mat color={accent} roughness={0.38} />
      </mesh>
    </group>
  )
}

export function DiningChairMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.9)
  const lz = inset(h, 0.9)
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, 0.06, 0.08]}>
        <boxGeometry args={[lx * 0.88, 0.07, lz * 0.75]} />
        <Mat color="#4a433c" roughness={0.65} />
      </mesh>
      <mesh castShadow position={[0, 0.28, -lz * 0.28]}>
        <boxGeometry args={[lx * 0.86, 0.34, 0.09]} />
        <Mat color={accent} roughness={0.78} />
      </mesh>
      {[-lx * 0.28, lx * 0.28].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.14, lz * 0.28]}>
          <cylinderGeometry args={[0.028, 0.024, 0.22, 8]} />
          <Mat color="#222" metalness={0.35} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export function SideboardMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.88)
  const bodyH = 0.44
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, bodyH / 2 + 0.001, 0]}>
        <boxGeometry args={[lx, bodyH, lz]} />
        <Mat color="#453a32" roughness={0.55} />
      </mesh>
      <mesh position={[0, bodyH * 0.55, lz * 0.48]}>
        <boxGeometry args={[lx * 0.78, bodyH * 0.72, 0.04]} />
        <Mat color={accent} roughness={0.35} metalness={0.18} transparent opacity={0.9} />
      </mesh>
      {[-lx * 0.28, 0, lx * 0.28].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.1, -lz * 0.42]}>
          <boxGeometry args={[0.055, 0.18, lz * 0.38]} />
          <Mat color="#2a2420" roughness={0.52} />
        </mesh>
      ))}
    </group>
  )
}

export function BarStoolMesh({ w, h, accent }: MProps) {
  const seatR = Math.min(0.2, Math.min(w, h) * 0.38)
  const stemH = 0.34
  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.15, 0.04, 18]} />
        <Mat color="#2a2a2a" roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0, stemH * 0.5 + 0.04, 0]}>
        <cylinderGeometry args={[0.038, 0.042, stemH, 10]} />
        <Mat color="#a8a8a8" metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh castShadow position={[0, stemH + 0.06 + seatR * 0.12, 0]}>
        <cylinderGeometry args={[seatR, seatR * 0.96, 0.07, 22]} />
        <Mat color={accent} roughness={0.42} />
      </mesh>
    </group>
  )
}

export function DisplayCabinetMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.9)
  const lz = inset(h, 0.9)
  const tall = Math.max(1.15, h * 0.92)
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, tall * 0.5 + 0.01, 0]}>
        <boxGeometry args={[lx, tall, lz * 0.55]} />
        <Mat color="#3a3330" roughness={0.48} />
      </mesh>
      <mesh position={[0, tall * 0.5 + 0.01, lz * 0.28]}>
        <boxGeometry args={[lx * 0.88, tall * 0.88, 0.04]} />
        <Mat color="#b8d4ea" roughness={0.12} metalness={0.3} transparent opacity={0.42} />
      </mesh>
      <mesh position={[0, tall * 0.72, lz * 0.26]}>
        <boxGeometry args={[lx * 0.55, 0.04, 0.055]} />
        <Mat color={accent} />
      </mesh>
    </group>
  )
}

export function BedMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.92)
  const lz = inset(h, 0.92)
  const mattressH = 0.32
  const my = mattressH / 2 + 0.08
  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[lx, 0.08, lz]} />
        <Mat color="#5c4a4a" roughness={0.65} />
      </mesh>
      <mesh castShadow position={[0, my, 0]}>
        <boxGeometry args={[lx * 0.96, mattressH, lz * 0.94]} />
        <Mat color="#ebe6f2" roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, my + mattressH * 0.55, -lz * 0.42]}>
        <boxGeometry args={[lx * 0.96, 0.58, 0.11]} />
        <Mat color="#5d4d66" roughness={0.72} />
      </mesh>
      <mesh position={[0, my + 0.12, 0]}>
        <boxGeometry args={[lx * 0.82, 0.1, lz * 0.78]} />
        <Mat color={accent} roughness={0.82} />
      </mesh>
    </group>
  )
}

export function WardrobeMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.88)
  const tall = 0.92
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, tall / 2 + 0.01, 0]}>
        <boxGeometry args={[lx, tall, lz]} />
        <Mat color="#f0eeea" roughness={0.52} />
      </mesh>
      <mesh position={[-lx * 0.08, tall * 0.5 + 0.01, lz * 0.48]}>
        <boxGeometry args={[0.035, tall * 0.88, lz * 0.42]} />
        <Mat color="#c8c4c0" metalness={0.22} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[lx * 0.32, tall * 0.62, lz * 0.42]}>
        <cylinderGeometry args={[0.035, 0.035, 0.055, 12]} />
        <Mat color={accent} metalness={0.6} roughness={0.28} />
      </mesh>
    </group>
  )
}

export function NightstandMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.9)
  const lz = inset(h, 0.9)
  const bh = 0.34
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, bh / 2 + 0.001, 0]}>
        <boxGeometry args={[lx, bh, lz]} />
        <Mat color="#4a3c32" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, bh + 0.05, -lz * 0.22]}>
        <boxGeometry args={[lx * 0.88, 0.07, lz * 0.55]} />
        <Mat color="#f2f0ec" roughness={0.35} />
      </mesh>
      <mesh castShadow position={[lx * 0.28, bh + 0.12, lz * 0.22]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <Mat color={accent} />
      </mesh>
    </group>
  )
}

export function DeskMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.82)
  const topY = 0.42
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[-lx * 0.32, topY * 0.45, 0]}>
        <boxGeometry args={[0.09, topY * 0.88, lz * 0.88]} />
        <Mat color="#2c2c2c" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[lx * 0.3, topY * 0.25, 0]}>
        <boxGeometry args={[lx * 0.42, topY * 0.48, lz * 0.75]} />
        <Mat color="#2c2c2c" />
      </mesh>
      <mesh castShadow position={[0, topY, 0]}>
        <boxGeometry args={[lx, 0.055, lz]} />
        <Mat color="#b88952" roughness={0.44} metalness={0.04} />
      </mesh>
      <mesh position={[lx * 0.28, topY + 0.08, -lz * 0.12]}>
        <boxGeometry args={[0.025, 0.32, lz * 0.35]} />
        <Mat color={accent} metalness={0.38} roughness={0.32} />
      </mesh>
    </group>
  )
}

export function BedsideLampMesh({ w, h, accent }: MProps) {
  const baseR = Math.min(0.14, w * 0.4)
  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[baseR, baseR * 1.05, 0.05, 18]} />
        <Mat color="#f0eeeb" />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.28, 10]} />
        <Mat color="#c4c2be" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial
          color="#fff9e8"
          roughness={0.32}
          emissive="#ffe9b8"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <coneGeometry args={[0.1, 0.12, 12, 1, false]} />
        <Mat color={accent} roughness={0.4} />
      </mesh>
    </group>
  )
}

export function FridgeMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.9)
  const lz = inset(h, 0.9)
  const bodyH = Math.min(2.05, 1.2 + 0.35 * h)
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, bodyH / 2 + 0.01, 0]}>
        <boxGeometry args={[lx, bodyH, lz]} />
        <Mat color="#eef1f4" roughness={0.32} metalness={0.18} />
      </mesh>
      <mesh position={[lx * 0.46, bodyH * 0.52, 0]}>
        <boxGeometry args={[0.04, bodyH * 0.82, lz * 0.82]} />
        <Mat color="#1a1a1a" metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh position={[lx * 0.22, bodyH * 0.72, lz * 0.42]}>
        <boxGeometry args={[0.1, 0.07, 0.04]} />
        <Mat color={accent} />
      </mesh>
    </group>
  )
}

export function StoveMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.88)
  const baseH = 0.18
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, baseH / 2 + 0.01, 0]}>
        <boxGeometry args={[lx, baseH, lz]} />
        <Mat color="#2a2a2a" roughness={0.42} metalness={0.28} />
      </mesh>
      <mesh position={[0, baseH + 0.03, 0]}>
        <boxGeometry args={[lx * 0.82, 0.035, lz * 0.68]} />
        <Mat color="#141414" metalness={0.65} roughness={0.22} />
      </mesh>
      {[-lx * 0.24, 0, lx * 0.24].map((x, i) => (
        <mesh
          key={i}
          position={[x, baseH + 0.052, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.075, 0.075, 0.018, 22]} />
          <Mat color="#0a0a0a" metalness={0.75} roughness={0.2} />
        </mesh>
      ))}
      <mesh castShadow position={[0, baseH + 0.16, -lz * 0.28]}>
        <boxGeometry args={[lx * 0.28, 0.18, 0.12]} />
        <Mat color={accent} roughness={0.38} />
      </mesh>
    </group>
  )
}

export function KitchenIslandMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.94)
  const lz = inset(h, 0.88)
  const bodyH = 0.4
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, bodyH / 2 + 0.01, 0]}>
        <boxGeometry args={[lx, bodyH, lz]} />
        <Mat color="#eae6e0" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, bodyH + 0.04, 0]}>
        <boxGeometry args={[lx * 0.98, 0.065, lz * 0.98]} />
        <Mat color="#c4b8a8" roughness={0.22} metalness={0.22} />
      </mesh>
      <mesh castShadow position={[0, bodyH * 0.45, lz * 0.42]}>
        <boxGeometry args={[lx * 0.38, bodyH * 0.65, 0.08]} />
        <Mat color={accent} />
      </mesh>
    </group>
  )
}

export function MicrowaveMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.88)
  const lz = inset(h, 0.88)
  const bh = 0.26
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, bh / 2 + 0.01, 0]}>
        <boxGeometry args={[lx, bh, lz]} />
        <Mat color="#d8d8d8" metalness={0.38} roughness={0.35} />
      </mesh>
      <mesh position={[0, bh / 2 + 0.01, lz * 0.48]}>
        <boxGeometry args={[lx * 0.78, bh * 0.65, 0.025]} />
        <Mat color="#1a1a1a" roughness={0.22} metalness={0.5} />
      </mesh>
      <mesh position={[lx * 0.32, bh * 0.55, lz * 0.46]}>
        <boxGeometry args={[0.07, 0.05, 0.035]} />
        <Mat color={accent} />
      </mesh>
    </group>
  )
}

export function HoodMesh({ w, h, accent }: MProps) {
  const lx = inset(w, 0.92)
  const lz = inset(h, 0.92)
  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[lx * 0.95, 0.06, lz * 0.95]} />
        <Mat color="#2a2a2a" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 0.18, -lz * 0.08]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[lx * 0.92, 0.1, lz * 0.75]} />
        <Mat color="#b8b8b8" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[lx * 0.22, 0.015, 8, 24]} />
        <Mat color={accent} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

const REGISTRY: Record<string, React.ComponentType<MProps>> = {
  "bath-tub": BathTubMesh,
  "bath-toilet": BathToiletMesh,
  "bath-sink": BathSinkMesh,
  "bath-shower": BathShowerMesh,
  "bath-vanity": BathVanityMesh,
  "living-sofa": SofaMesh,
  "living-tv": TvUnitMesh,
  "living-coffee": CoffeeTableMesh,
  "living-armchair": ArmchairMesh,
  "living-lamp": FloorLampMesh,
  "dining-table": DiningTableMesh,
  "dining-chair": DiningChairMesh,
  "dining-sideboard": SideboardMesh,
  "dining-barstool": BarStoolMesh,
  "dining-cabinet": DisplayCabinetMesh,
  "bed-room-bed": BedMesh,
  "bed-room-wardrobe": WardrobeMesh,
  "bed-room-night": NightstandMesh,
  "bed-room-desk": DeskMesh,
  "bed-room-lamp": BedsideLampMesh,
  "kit-fridge": FridgeMesh,
  "kit-stove": StoveMesh,
  "kit-island": KitchenIslandMesh,
  "kit-mwave": MicrowaveMesh,
  "kit-hood": HoodMesh,
}

export function FurnitureMeshByCatalogId(
  props: MProps & { catalogItemId: string },
) {
  const { catalogItemId, ...rest } = props
  const C = REGISTRY[catalogItemId] ?? GenericFurniture
  return <C {...rest} />
}
