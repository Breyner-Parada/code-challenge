/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import * as THREE from "three";
import { useControls, button, folder } from "leva";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { HouseSchema } from "../constants/houseSchema";

const HouseModel: React.FC = () => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [showWalls, setShowWalls] = React.useState<boolean>(true);
  const { camera } = useThree();
  const raycaster = new THREE.Raycaster();
  const lineRef = React.useRef<THREE.Group>(null);
  const tubesRef = React.useRef<THREE.Group>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const coords = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1)
      );

      raycaster.setFromCamera(coords, camera);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Leva controls for interactivity
  const [
    {
      opacityWalls,
      opacityRoof,
      opacityWire,
      opacityTubes,
      wireColor,
      tubeColor,
      thicknessTubes,
      heightRoof,
      positionY,
    },
    set,
  ] = useControls(() => ({
    walls: folder({
      opacityWalls: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.1,
        label: "Walls Opacity",
      },
      "Toggle Walls": button(() => setShowWalls((prev) => !prev)),
    }),

    wire: folder({
      opacityWire: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.1,
        label: "Wires Opacity",
      },
      wireColor: { value: "#ff0000", label: "Wire Color" },
    }),
    tubes: folder({
      opacityTubes: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.1,
        label: "Tubes Opacity",
      },
      tubeColor: { value: "#0000ff", label: "Tube Color" },
      thicknessTubes: {
        value: 0.15,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "Tube Thickness",
      },
    }),
    roof: folder({
      opacityRoof: {
        value: 1,
        min: 0,
        max: 1,
        step: 0.1,
        label: "Roof Opacity",
      },
      heightRoof: {
        value: HouseSchema.roof.height,
        min: 1,
        max: 10,
        step: 0.1,
        label: "Roof Height",
      },
      positionY: {
        value: HouseSchema.roof.position[1],
        min: 0,
        max: 20,
        step: 0.1,
      },
    }),
    reset: button(() => {
      set({
        opacityWalls: 1,
        opacityRoof: 1,
        opacityWire: 1,
        opacityTubes: 1,
        wireColor: "#ff0000",
        tubeColor: "#0000ff",
        thicknessTubes: 0.15,
      });
      setShowWalls(true);
    }),
  }));

  // Create shapes for the floor with a hole
  const floorShape = new THREE.Shape();
  floorShape.moveTo(0, 0);
  floorShape.lineTo(HouseSchema.baseSecondFloor.width, 0);
  floorShape.lineTo(
    HouseSchema.baseSecondFloor.width,
    HouseSchema.baseSecondFloor.depth
  );
  floorShape.lineTo(0, HouseSchema.baseSecondFloor.depth);
  floorShape.lineTo(0, 0);
  floorShape.holes = [];
  HouseSchema.baseSecondFloor.holes?.forEach((hole) => {
    const holePath = new THREE.Path();
    const [hx, hy] = hole.position;
    const [hw, hd] = hole.size;
    holePath.moveTo(hx - hw / 2, hy - hd / 2);
    holePath.lineTo(hx + hw / 2, hy - hd / 2);
    holePath.lineTo(hx + hw / 2, hy + hd / 2);
    holePath.lineTo(hx - hw / 2, hy + hd / 2);
    holePath.lineTo(hx - hw / 2, hy - hd / 2);
    floorShape.holes?.push(holePath);
  });

  const floorGeometry = new THREE.ExtrudeGeometry(floorShape, {
    depth: HouseSchema.baseSecondFloor.thickness,
    bevelEnabled: false,
  });
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: "#a0a0a0",
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(
    HouseSchema.baseSecondFloor.position[0],
    HouseSchema.baseSecondFloor.position[1],
    HouseSchema.baseSecondFloor.position[2]
  );

  // Function to create Three.js wall meshes from houseWalls
  function createFloorWalls(material?: THREE.Material): THREE.Mesh[] {
    return HouseSchema.walls.map((wall) => {
      const [x1, y1] = wall.start;
      const [x2, y2] = wall.end;
      const length = Math.hypot(x2 - x1, y2 - y1);
      const positionZ = (wall.baseHeight ?? 0) + wall.height / 2;

      // Wall geometry: length x height x thickness
      const geometry = new THREE.BoxGeometry(
        length,
        wall.height,
        wall.thickness
      );

      // Default material if not provided
      const wallMaterial =
        material ||
        new THREE.MeshStandardMaterial({
          color: "#a0a0a0",
          opacity: opacityWalls,
          transparent: true,
        });

      const mesh = new THREE.Mesh(geometry, wallMaterial);

      // Position wall at midpoint between start and end
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;

      mesh.position.set(midX, positionZ, midY);

      // Rotate wall to match direction
      const angle = Math.atan2(y2 - y1, x2 - x1);
      mesh.rotation.y = -angle;

      return mesh;
    });
  }

  useFrame(() => {
    if (lineRef.current) {
      const children = (lineRef.current?.children ?? []) as THREE.Object3D[];
      const intersects = raycaster.intersectObjects(children, true);
      if (intersects.length > 0) {
        const { point } = intersects[0];
        // Handle intersection with the line
        // For example, change hoverIndex or modify line appearance
        console.log("Intersected line at point:", point);
      }
    }
    if (tubesRef.current) {
      tubesRef.current.children.forEach((tube, index) => {
        const intersects = raycaster.intersectObject(tube);
        if (intersects.length > 0) {
          const { point } = intersects[0];
          // Handle intersection with the tube
          console.log("Intersected tube at index:", index, point);
        }
      });
    }
  });

  return (
    <group>
      {/* Door */}
      <mesh
        position={HouseSchema.door.position as [number, number, number]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry
          args={[
            HouseSchema.door.width,
            HouseSchema.door.height,
            HouseSchema.door.thickness,
          ]}
        />
        <meshStandardMaterial color={HouseSchema.door.material} />
      </mesh>
      {/* Window */}
      {HouseSchema.windows.map((window, index) => (
        <mesh
          key={index}
          position={window.position as [number, number, number]}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[window.width, window.height, window.thickness]} />
          <meshPhysicalMaterial
            color={window.material}
            transmission={1} // enables glass effect
            transparent={true}
            opacity={0.5}
            roughness={0}
            metalness={0}
            thickness={0.2}
            ior={1.5}
            reflectivity={0.8}
            clearcoat={1}
            clearcoatRoughness={0}
            depthWrite={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Walls */}
      {showWalls &&
        createFloorWalls().map((mesh, index) => (
          <primitive key={index} object={mesh} />
        ))}
      {/* Base floor */}
      <mesh
        position={HouseSchema.baseFloor.position as [number, number, number]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry
          args={[
            HouseSchema.baseFloor.width,
            HouseSchema.baseFloor.thickness,
            HouseSchema.baseFloor.depth,
          ]}
        />
        <meshStandardMaterial color={"#a0a0a0"} />
      </mesh>

      {/* second base floor */}
      <mesh
        position={
          HouseSchema.baseThirdFloor.position as [number, number, number]
        }
        rotation={[0, 0, 0]}
      >
        <boxGeometry
          args={[
            HouseSchema.baseThirdFloor.width,
            HouseSchema.baseThirdFloor.thickness,
            HouseSchema.baseThirdFloor.depth,
          ]}
        />
        <meshStandardMaterial color={"#a0a0a0"} />
      </mesh>
      {/* Wires */}
      <group
        ref={lineRef}
        onPointerEnter={() => setHoverIndex(1)}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {HouseSchema.wires.map((wire, index) => {
          const points = wire.path.map(
            ([x, y, z]) => new THREE.Vector3(x, z || 0.1, y)
          );
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({
            color: wireColor,
            opacity: opacityWire,
            transparent: true,
          });
          const line = new THREE.Line(geometry, material);
          return <primitive key={index} object={line} />;
        })}
      </group>
      {hoverIndex === 1 && (
        <Html>
          <div
            style={{
              background: "white",
              padding: "5px",
              borderRadius: "5px",
              width: "max-content",
            }}
          >
            Some Wire Info
          </div>
        </Html>
      )}

      {/* Tubes */}
      <group
        ref={tubesRef}
        onPointerEnter={() => setHoverIndex(2)}
        onPointerLeave={() => setHoverIndex(null)}
      >
        {HouseSchema.tubes.map((tube, index) => {
          const points = tube.path.map(
            ([x, y, z]) => new THREE.Vector3(x, y, z)
          );
          // Use TubeGeometry for thickness
          const curve = new THREE.CatmullRomCurve3(points);
          const geometry = new THREE.TubeGeometry(
            curve,
            200,
            thicknessTubes,
            8,
            false
          ); // 0.05 is the tube radius
          const material = new THREE.MeshStandardMaterial({
            color: tubeColor,
            opacity: opacityTubes,
            transparent: true,
            side: THREE.DoubleSide,
          });
          return <mesh key={index} geometry={geometry} material={material} />;
        })}
      </group>
      {hoverIndex === 2 && (
        <Html>
          <div
            style={{
              background: "white",
              padding: "5px",
              borderRadius: "5px",
              width: "max-content",
            }}
          >
            Some Tube Info
          </div>
        </Html>
      )}

      {/* Second Floor with holes */}
      <primitive object={floorMesh} />

      {/* Roof */}
      <mesh
        position={[HouseSchema.roof.position[0], positionY, HouseSchema.roof.position[2]] as [number, number, number]}
        rotation={[0, 45 * (Math.PI / 180), 0]}
      >
        <coneGeometry args={[HouseSchema.roof.width / 2, heightRoof, 4]} />
        <meshStandardMaterial
          color={HouseSchema.roof.color}
          opacity={opacityRoof}
          transparent
        />
      </mesh>
    </group>
  );
};

export default HouseModel;
