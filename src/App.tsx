import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
// import { house } from "./constants/scheme";
// import { HouseModel } from "./assets/White_silver_green_residence";
// import { HouseModel2 } from "./assets/House";
// import { HouseObjModel } from "./assets/HouseObj";
import HouseModel from "./assets/HouseModel";
import { Loader } from "./utils/Loader";

function App() {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw" }}
      camera={{ position: [-8.97, 7.46, -13.82] }}
      gl={{ antialias: true }}
      shadows
    >
      <Environment preset="sunset" />
      <OrbitControls target={[0, 0, 0]} />

      <Suspense fallback={<Loader />}>
        {/* <HouseModel2 /> */}
        {/* <HouseObjModel /> */}
        <HouseModel />
        {/* <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} /> */}
      </Suspense>
    </Canvas>
  );
}

export default App;
