type Vec3 = [number, number, number];

export type HouseJSON = {
  meta?: { name?: string; units?: "m" | "cm" | "mm" };
  bounds?: { size: Vec3; origin?: Vec3 };
  rooms?: Array<{
    id: string;
    name?: string;
    position: Vec3; // center position
    size: Vec3; // width, height, depth
    color?: string;
  }>;
  walls?: Array<{
    id: string;
    from: Vec3; // start point
    to: Vec3; // end point
    height: number; // meters
    thickness?: number; // meters
  }>;
  wires?: Array<{
    id: string;
    label?: string;
    path: Vec3[]; // polyline of points
    gauge?: number; // visual thickness in meters
    color?: string; // default: orange
  }>;
  tubes?: Array<{
    id: string;
    label?: string;
    path: Vec3[]; // polyline of points
    diameter?: number; // meters
    color?: string; // default: steel gray
  }>;
  fixtures?: Array<{
    id: string;
    type: "outlet" | "switch" | "junction" | "valve" | "sensor";
    position: Vec3;
    size?: number; // uniform size
    color?: string;
  }>;
};
