// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/physics/OimoPhysics.js
import { InstancedMesh, Mesh, Vector3 } from "three"
import {
  OBoxGeometry,
  OSphereGeometry,
  RigidBody,
  RigidBodyConfig,
  RigidBodyType,
  Shape,
  ShapeConfig,
  Vec3,
  World, // @ts-ignore
} from "three/examples/jsm/libs/OimoPhysics/index.js"

/* eslint-disable @typescript-eslint/no-explicit-any */
type OIMOBody = any
type OIMOGeometry = any
type THREEGeometry = any
/* eslint-enable @typescript-eslint/no-explicit-any */

type Point = { x: number; y: number; z: number }
type MeshLike = InstancedMesh | Mesh

type Compose = (o: {
  arrayBaseIndex: number
  matrixArray: number[]
  position: Point
  quaternion: Point & { w: number }
}) => void

const compose: Compose = ({
  arrayBaseIndex,
  matrixArray,
  position,
  quaternion,
}) => {
  const { x } = quaternion
  const { y } = quaternion
  const { z } = quaternion
  const { w } = quaternion
  const x2 = x + x
  const y2 = y + y
  const z2 = z + z
  const xx = x * x2
  const xy = x * y2
  const xz = x * z2
  const yy = y * y2
  const yz = y * z2
  const zz = z * z2
  const wx = w * x2
  const wy = w * y2
  const wz = w * z2

  matrixArray[arrayBaseIndex + 0] = 1 - (yy + zz)
  matrixArray[arrayBaseIndex + 1] = xy + wz
  matrixArray[arrayBaseIndex + 2] = xz - wy
  matrixArray[arrayBaseIndex + 3] = 0

  matrixArray[arrayBaseIndex + 4] = xy - wz
  matrixArray[arrayBaseIndex + 5] = 1 - (xx + zz)
  matrixArray[arrayBaseIndex + 6] = yz + wx
  matrixArray[arrayBaseIndex + 7] = 0

  matrixArray[arrayBaseIndex + 8] = xz + wy
  matrixArray[arrayBaseIndex + 9] = yz - wx
  matrixArray[arrayBaseIndex + 10] = 1 - (xx + yy)
  matrixArray[arrayBaseIndex + 11] = 0

  matrixArray[arrayBaseIndex + 12] = position.x
  matrixArray[arrayBaseIndex + 13] = position.y
  matrixArray[arrayBaseIndex + 14] = position.z
  matrixArray[arrayBaseIndex + 15] = 1
}

const createOimoPhysics = ({ frameRate = 90 } = {}) => {
  const world = new World(2, new Vec3(0, -9.8, 0))

  const meshes: MeshLike[] = []
  const meshMap = new WeakMap()

  type HandleMesh = (o: {
    mass: number
    mesh: Mesh
    oimoGeometry: OIMOGeometry
  }) => void

  const handleMesh: HandleMesh = ({ mass, mesh, oimoGeometry }) => {
    const shapeConfig = new ShapeConfig()

    shapeConfig.geometry = oimoGeometry

    const bodyConfig = new RigidBodyConfig()

    bodyConfig.type = mass === 0 ? RigidBodyType.STATIC : RigidBodyType.DYNAMIC

    bodyConfig.position = new Vec3(
      mesh.position.x,
      mesh.position.y,
      mesh.position.z
    )

    const body = new RigidBody(bodyConfig)

    body.addShape(new Shape(shapeConfig))
    world.addRigidBody(body)

    if (mass > 0) {
      meshes.push(mesh)
      meshMap.set(mesh, body)
    }
  }

  type HandleInstancedMesh = (o: {
    mass: number
    mesh: InstancedMesh
    oimoGeometry: OIMOGeometry
  }) => void

  const handleInstancedMesh: HandleInstancedMesh = ({
    mass,
    mesh,
    oimoGeometry,
  }) => {
    const {
      instanceMatrix: { array: matrixArray },
    } = mesh

    const bodies: OIMOBody[] = []

    Array.from({ length: mesh.count }).forEach((...forEachArgs) => {
      const [, meshItemIndex] = forEachArgs
      const arrayIndex = meshItemIndex * 16

      const shapeConfig = new ShapeConfig()

      shapeConfig.geometry = oimoGeometry

      const bodyConfig = new RigidBodyConfig()

      bodyConfig.type =
        mass === 0 ? RigidBodyType.STATIC : RigidBodyType.DYNAMIC
      bodyConfig.position = new Vec3(
        matrixArray[arrayIndex + 12],
        matrixArray[arrayIndex + 13],
        matrixArray[arrayIndex + 14]
      )

      const body = new RigidBody(bodyConfig)

      body.addShape(new Shape(shapeConfig))
      world.addRigidBody(body)

      bodies.push(body)
    })

    if (mass > 0) {
      meshes.push(mesh)
      meshMap.set(mesh, bodies)
    }
  }

  const getOIMOGeometry = (geometry: THREEGeometry): OIMOGeometry => {
    const { parameters } = geometry

    if (geometry.type === "BoxGeometry") {
      const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5
      const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5
      const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5

      return new OBoxGeometry(new Vec3(sx, sy, sz))
    }

    const radius = parameters.radius !== undefined ? parameters.radius : 1

    return new OSphereGeometry(radius)
  }

  type AddMesh = (o: { mass?: number; mesh: MeshLike }) => void

  const addMesh: AddMesh = ({ mass = 0, mesh }) => {
    const oimoGeometry = getOIMOGeometry(mesh.geometry)

    if (oimoGeometry !== null) {
      if ("isInstancedMesh" in mesh) {
        handleInstancedMesh({ mass, mesh, oimoGeometry })
      } else if ("isMesh" in mesh) {
        handleMesh({ mass, mesh, oimoGeometry })
      }
    }
  }

  type SetMeshPosition = (o: {
    bodyIndex?: number
    mesh: MeshLike
    position: Vector3
  }) => void

  const setMeshPosition: SetMeshPosition = ({
    bodyIndex = 0,
    mesh,
    position,
  }) => {
    if ("isInstancedMesh" in mesh) {
      const bodies = meshMap.get(mesh)
      const { [bodyIndex]: body } = bodies

      body.setPosition(new Vec3(position.x, position.y, position.z))
    } else if ("isMesh" in mesh) {
      const body = meshMap.get(mesh)

      body.setPosition(new Vec3(position.x, position.y, position.z))
    }
  }

  let lastTime = 0

  const step = () => {
    const time = performance.now()

    if (lastTime > 0) {
      world.step(1 / frameRate)
    }

    lastTime = time

    meshes.forEach((mesh) => {
      if ("isInstancedMesh" in mesh) {
        const matrixArray = mesh.instanceMatrix.array as number[]
        const bodies: OIMOBody[] = meshMap.get(mesh)

        bodies.forEach((...forEachArgs) => {
          const [body, bodyIndex] = forEachArgs

          compose({
            arrayBaseIndex: bodyIndex * 16,
            matrixArray,
            position: body.getPosition(),
            quaternion: body.getOrientation(),
          })
        })

        mesh.instanceMatrix.needsUpdate = true
      } else if ("isMesh" in mesh) {
        const body = meshMap.get(mesh)

        mesh.position.copy(body.getPosition())
        mesh.quaternion.copy(body.getOrientation())
      }
    })
  }

  const intervalId = setInterval(() => {
    requestAnimationFrame(step)
  }, 1000 / frameRate)

  const stop = () => {
    clearInterval(intervalId)
  }

  return {
    addMesh,
    setMeshPosition,
    stop,
  }
}

export { createOimoPhysics }
