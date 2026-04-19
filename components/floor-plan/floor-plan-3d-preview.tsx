"use client"

import { Canvas } from "@react-three/fiber"
import { ContactShadows, OrbitControls, useTexture } from "@react-three/drei"
import { Suspense, useEffect, useMemo } from "react"
import * as THREE from "three"
import { cn } from "@/lib/utils"
import { getFloorPlanItemDef } from "./catalog"
import { FurnitureMeshByCatalogId } from "./furniture-meshes-3d"
import type { PlacedFloorItem } from "./types"
import { effectiveFootprint } from "./types"

function categoryColor(catalogItemId: string): string {
  if (catalogItemId.startsWith("bath")) return "#38bdf8"
  if (catalogItemId.startsWith("living")) return "#a78bfa"
  if (catalogItemId.startsWith("dining")) return "#fbbf24"
  if (catalogItemId.startsWith("bed")) return "#fb7185"
  if (catalogItemId.startsWith("kit")) return "#4ade80"
  return "#94a3b8"
}

function PlacedFurniture({ placement }: { placement: PlacedFloorItem }) {
  const def = getFloorPlanItemDef(placement.catalogItemId)
  if (!def) return null
  const { w, h } = effectiveFootprint(
    def.footprintW,
    def.footprintH,
    placement.rotation,
  )
  const cx = placement.gridX + w / 2
  const cz = placement.gridY + h / 2
  const accent = categoryColor(placement.catalogItemId)
  const ry = (placement.rotation * Math.PI) / 180

  return (
    <group
      position={[cx, 0, cz]}
      rotation={[0, ry, 0]}
      scale={[placement.flipH ? -1 : 1, 1, placement.flipV ? -1 : 1]}
    >
      <FurnitureMeshByCatalogId
        catalogItemId={placement.catalogItemId}
        w={w}
        h={h}
        accent={accent}
      />
    </group>
  )
}

/** One texture repeat per grid cell, matching the 2D tile image per cell. */
function TiledFloorMesh({
  dw,
  dh,
  imagePath,
}: {
  dw: number
  dh: number
  imagePath: string
}) {
  const source = useTexture(imagePath)
  const map = useMemo(() => {
    const t = source.clone()
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(dw, dh)
    t.anisotropy = 8
    t.colorSpace = THREE.SRGBColorSpace
    t.needsUpdate = true
    return t
  }, [source, dw, dh])

  useEffect(() => () => map.dispose(), [map])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[dw / 2, 0, dh / 2]}
      receiveShadow
    >
      <planeGeometry args={[dw, dh]} />
      <meshStandardMaterial map={map} roughness={0.88} metalness={0.04} />
    </mesh>
  )
}

/** Grid lines like the 2D `border border-gray-300` cell edges. */
function FloorGroutGrid({ dw, dh }: { dw: number; dh: number }) {
  const geom = useMemo(() => {
    const y = 0.004
    const verts: number[] = []
    for (let i = 0; i <= dw; i++) {
      verts.push(i, y, 0, i, y, dh)
    }
    for (let j = 0; j <= dh; j++) {
      verts.push(0, y, j, dw, y, j)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3))
    return g
  }, [dw, dh])

  useEffect(() => () => geom.dispose(), [geom])

  return (
    <lineSegments geometry={geom} frustumCulled={false}>
      <lineBasicMaterial
        color="#d1d5db"
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </lineSegments>
  )
}

function RoomScene({
  dimensions,
  placements,
  tileImagePath,
}: {
  dimensions: { width: number; height: number }
  placements: PlacedFloorItem[]
  tileImagePath: string
}) {
  const dw = dimensions.width
  const dh = dimensions.height
  const maxD = Math.max(dw, dh, 1)

  return (
    <>
      <ambientLight intensity={0.52} />
      <directionalLight
        castShadow
        position={[dw * 1.4, 18, dh * 1.2]}
        intensity={1.15}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-maxD * 2.5, maxD * 2.5, maxD * 2.5, -maxD * 2.5, 0.5, 80]}
        />
      </directionalLight>
      <directionalLight
        position={[-dw * 0.9, 10, -dh * 0.6]}
        intensity={0.35}
        color="#e2e8f0"
      />
      <hemisphereLight args={["#f8fafc", "#64748b", 0.42]} />

      <Suspense
        fallback={
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[dw / 2, 0, dh / 2]}
            receiveShadow
          >
            <planeGeometry args={[dw, dh]} />
            <meshStandardMaterial
              color="#ebe4d8"
              roughness={0.88}
              metalness={0.04}
            />
          </mesh>
        }
      >
        <TiledFloorMesh dw={dw} dh={dh} imagePath={tileImagePath} />
      </Suspense>
      <FloorGroutGrid dw={dw} dh={dh} />

      {placements.map((p) => (
        <PlacedFurniture key={p.instanceId} placement={p} />
      ))}

      <ContactShadows
        position={[dw / 2, 0.01, dh / 2]}
        opacity={0.45}
        scale={maxD * 3}
        blur={2.8}
        far={12}
        color="#0f172a"
      />
    </>
  )
}

export interface FloorPlan3DPreviewProps {
  dimensions: { width: number; height: number }
  placements: PlacedFloorItem[]
  /** Same JPEG as the 2D grid (e.g. from `getTileImagePath`). */
  tileImagePath: string
  className?: string
}

export function FloorPlan3DPreview({
  dimensions,
  placements,
  tileImagePath,
  className,
}: FloorPlan3DPreviewProps) {
  const maxDim = Math.max(dimensions.width, dimensions.height, 1)
  const target = useMemo(
    () =>
      [dimensions.width / 2, 0, dimensions.height / 2] as [
        number,
        number,
        number,
      ],
    [dimensions.height, dimensions.width],
  )

  return (
    <div
      className={cn(
        "h-[min(440px,55vh)] w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-zinc-100 to-zinc-200/90 shadow-inner shadow-zinc-900/5",
        className,
      )}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [maxDim * 1.35, maxDim * 1.1, maxDim * 1.5],
          fov: 38,
          near: 0.1,
          far: 500,
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#f1f5f9"]} />
        <Suspense fallback={null}>
          <RoomScene
            dimensions={dimensions}
            placements={placements}
            tileImagePath={tileImagePath}
          />
          <OrbitControls
            makeDefault
            target={target}
            minDistance={Math.max(1.8, maxDim * 0.42)}
            maxDistance={maxDim * 5.5}
            maxPolarAngle={Math.PI / 2 - 0.05}
            enablePan
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
