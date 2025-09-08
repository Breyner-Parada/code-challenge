import React from 'react'
import * as THREE from 'three'
import { HouseScheme } from '../constants/scheme'

export const HouseObjModel = () => {
    const loader = new THREE.ObjectLoader()
    const house = loader.parse(HouseScheme)
    return <primitive object={house} scale={0.5} position={[0, 0, 0]} />
}
