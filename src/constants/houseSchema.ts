// /src/constants/houseSchema.ts

// House wall schema for Three.js rendering
// Each wall is defined by its start and end coordinates (x, y), and height

export interface Wall {
  start: [number, number];
  end: [number, number];
  height: number;
  thickness: number;
  baseHeight?: number;
}

export const houseWalls: Wall[] = [
  // Example: simple rectangular house plan (10x8 units, 3 units high, 0.2 thick)
  { start: [0, 0], end: [10, 0], height: 3, thickness: 0.2, baseHeight: 0 }, // Bottom wall
  { start: [10, 0], end: [10, 8], height: 3, thickness: 0.2, baseHeight: 0 }, // Right wall
  { start: [10, 8], end: [0, 8], height: 3, thickness: 0.2, baseHeight: 0 }, // Top wall
  { start: [0, 8], end: [0, 0], height: 3, thickness: 0.2, baseHeight: 0 }, // Left wall
  // Add more walls for interior rooms as needed
  { start: [7, 0], end: [7, 5], height: 3, thickness: 0.15, baseHeight: 0 }, // Interior wall
  { start: [7, 5], end: [10, 5], height: 3, thickness: 0.15, baseHeight: 0 }, // Interior wall
  { start: [3, 8], end: [3, 3], height: 3, thickness: 0.15, baseHeight: 0 }, // Interior wall
  { start: [3, 3], end: [0, 3], height: 3, thickness: 0.15, baseHeight: 0 }, // Interior wall

  //   second floor walls
  { start: [0, 0], end: [10, 0], height: 3, thickness: 0.2, baseHeight: 3 }, // Bottom wall
  { start: [10, 0], end: [10, 8], height: 3, thickness: 0.2, baseHeight: 3 }, // Right wall
  { start: [10, 8], end: [0, 8], height: 3, thickness: 0.2, baseHeight: 3 }, // Top wall
  { start: [0, 8], end: [0, 0], height: 3, thickness: 0.2, baseHeight: 3 }, // Left wall
  { start: [0, 5], end: [5, 5], height: 3, thickness: 0.15, baseHeight: 3 }, // Interior wall
  { start: [5, 5], end: [5, 8], height: 3, thickness: 0.15, baseHeight: 3 }, // Interior wall
  { start: [8, 3], end: [10, 3], height: 3, thickness: 0.15, baseHeight: 3 }, // Interior wall
  { start: [8, 3], end: [8, 0], height: 3, thickness: 0.15, baseHeight: 3 }, // Interior wall

  // Add more walls as needed

  // third floor walls (only partial)
  // { start: [0, 0], end: [10, 0], height: 3, thickness: 0.2, baseHeight: 6 }, // Bottom wall
  // { start: [0, 0], end: [10, 0], height: 3, thickness: 0.2, baseHeight: 6 }, // Bottom wall
  // { start: [10, 0], end: [10, 8], height: 3, thickness: 0.2, baseHeight: 6 }, // Right wall
  // { start: [10, 8], end: [0, 8], height: 3, thickness: 0.2, baseHeight: 6 }, // Top wall
  // { start: [0, 8], end: [0, 0], height: 3, thickness: 0.2, baseHeight: 6 }, // Left wall
];

export const HouseSchema = {
  door: {
    width: 1,
    height: 2,
    thickness: 0.1,
    position: [5, 1, -0.1], // Centered at (5,0), z=0
    material: "wood", // Example property
  },
  windows: [
    {
      width: 1.5,
      height: 1.5,
      thickness: 0.3,
      position: [2, 1.7, 0], // Centered at (5,0), z=0
      material: "glass", // Example property
    },
    {
      width: 1.5,
      height: 1.5,
      thickness: 0.3,
      position: [8, 1.7, 0], // Centered at (5,0), z=0
      material: "glass", // Example property
    },
  ],
  walls: houseWalls,
  baseFloor: {
    width: 10,
    depth: 8,
    thickness: 0.2,
    position: [5, 0, 4], // Centered at (5,4), z=0
    // Example property
  },
  baseSecondFloor: {
    width: 10,
    depth: 8,
    thickness: 0.2,
    position: [0, 3, 8], // Centered at (5,4), z=3
    material: "concrete", // Example property
    holes: [
      {
        // Define a square hole: position is center of hole, size is width and depth
        position: [5, 6], // Centered at (3,4) in floor coordinates
        size: [3, 3], // 2x2 units square hole
      },
    ],
  },
  baseThirdFloor: {
    width: 10,
    depth: 8,
    thickness: 0.2,
    position: [5, 6, 4], // Centered at (5,4), z=6
  },
  wires: [
    // Example wire paths (not implemented in rendering yet)
    {
      path: [
        [0.2, 2, 0],
        [0.2, 4, 0],
        [0.2, 4, 2],
        [0.2, 6, 2],
        [0.2, 6, 0],
      ],
    },
    {
      path: [
        [8, 6, 0],
        [8, 8, 0],
        [8, 8, 4],
        [6, 8, 4],
      ],
    },
    {
      path: [
        [0.2, 2, 4],
        [0.2, 0, 4],
        [2, 0, 4],
      ],
    },
    {
      path: [
        [0.2, 2, 0],
        [0.2, 2, 2],
        [0.2, 2, 4],
        [0.2, 7, 4],
      ],
    },
    {
      path: [
        [0.2, 2, 0],
        [8, 2, 0],
        [8, 6, 0],
        [2, 6, 0],
        [2, 0, 0],
      ],
      type: "electric",
    },
  ],
  tubes: [
    {
      path: [
        [1, 0, 0],
        [1, 0, 1],
        [1, 0, 2],
        [1, 0, 3],
        [1, 0, 4],
        [1, 0, 5],
        [1, 0, 6],
        [1, 0, 7],

        [2, 0, 7],
        [3, 0, 7],
        [4, 0, 7],
        [5, 0, 7],
        [6, 0, 7],
        [7, 0, 7],
        [8, 0, 7],

        [9, 0, 7],
        [9, 0, 6],
        [9, 0, 5],
        [9, 0, 4],
        [9, 0, 0.1],
      ],
      type: "water",
    },
    {
      path: [
        [9, 0, 0.1],
        [9, 1, 0.1],
        [9, 2, 0.1],
        [9, 3, 0.1],
        [9, 4, 0.1],
        [9, 5, 0.1],
      ],
    },
    {
      path: [
        [1, 0, 7],
        [1, 0, 7.1],
        [1, 0, 7.2],
        [1, 0, 7.3],
        [1, 0, 7.4],
        [1, 0, 7.5],
        [1, 0, 7.8],
        [1, 0, 7.9],
        [1, 0, 8],
        [1, 1, 8],
        [1, 2, 8],
        [1, 3, 8],
        [1, 4, 8],
        [2, 4, 8],
        [3, 4, 8],
      ],
    },
  ],
  roof: {
    width: 15,
    depth: 8,
    height: 2, // Height from base of roof to ridge
    position: [5, 7, 4], // Centered at (5,8), z=6 (on top of second floor)
    slopeDirection: "y", // Slope runs along the y-axis (front-back)
    material: "tile",
    color: "#b35c1e",
    // Optionally, you can add vertices for custom shapes
    // vertices: [...]
  },
};
