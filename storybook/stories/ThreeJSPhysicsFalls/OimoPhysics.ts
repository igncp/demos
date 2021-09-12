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

type Compose = (options: {
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

  type HandleMesh = (options: {
    mass: number
    objectMesh: Mesh
    oimoGeometry: OIMOGeometry
  }) => void

  const handleMesh: HandleMesh = ({ mass, objectMesh, oimoGeometry }) => {
    const shapeConfig = new ShapeConfig()

    shapeConfig.geometry = oimoGeometry // eslint-disable-line id-denylist

    const bodyConfig = new RigidBodyConfig()

    bodyConfig.type = mass === 0 ? RigidBodyType.STATIC : RigidBodyType.DYNAMIC

    bodyConfig.position = new Vec3(
      objectMesh.position.x,
      objectMesh.position.y,
      objectMesh.position.z
    )

    const body = new RigidBody(bodyConfig)

    body.addShape(new Shape(shapeConfig))
    world.addRigidBody(body)

    if (mass > 0) {
      meshes.push(objectMesh)
      meshMap.set(objectMesh, body)
    }
  }

  type HandleInstancedMesh = (options: {
    mass: number
    objectMesh: InstancedMesh
    oimoGeometry: OIMOGeometry
  }) => void

  const handleInstancedMesh: HandleInstancedMesh = ({
    mass,
    objectMesh,
    oimoGeometry,
  }) => {
    const {
      instanceMatrix: { array: matrixArray },
    } = objectMesh

    const bodies: OIMOBody[] = []

    Array.from({ length: objectMesh.count }).forEach((...forEachArgs) => {
      const [, meshItemIndex] = forEachArgs
      const arrayIndex = meshItemIndex * 16

      const shapeConfig = new ShapeConfig()

      shapeConfig.geometry = oimoGeometry // eslint-disable-line id-denylist

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
      meshes.push(objectMesh)
      meshMap.set(objectMesh, bodies)
    }
  }

  const getOIMOGeometry = (threeGeometry: THREEGeometry): OIMOGeometry => {
    const { parameters } = threeGeometry

    if (threeGeometry.type === "BoxGeometry") {
      const sx = parameters.width !== undefined ? parameters.width / 2 : 0.5
      const sy = parameters.height !== undefined ? parameters.height / 2 : 0.5
      const sz = parameters.depth !== undefined ? parameters.depth / 2 : 0.5

      return new OBoxGeometry(new Vec3(sx, sy, sz))
    }

    const radius = parameters.radius !== undefined ? parameters.radius : 1

    return new OSphereGeometry(radius)
  }

  type AddMesh = (options: { mass?: number; objectMesh: MeshLike }) => void

  const addMesh: AddMesh = ({ mass = 0, objectMesh }) => {
    const oimoGeometry = getOIMOGeometry(objectMesh.geometry)

    if (oimoGeometry !== null) {
      if ("isInstancedMesh" in objectMesh) {
        handleInstancedMesh({ mass, objectMesh, oimoGeometry })
      } else if ("isMesh" in objectMesh) {
        handleMesh({ mass, objectMesh, oimoGeometry })
      }
    }
  }

  type SetMeshPosition = (options: {
    bodyIndex?: number
    objectMesh: MeshLike
    position: Vector3
  }) => void

  const setMeshPosition: SetMeshPosition = ({
    bodyIndex = 0,
    objectMesh,
    position,
  }) => {
    if ("isInstancedMesh" in objectMesh) {
      const bodies = meshMap.get(objectMesh)
      const { [bodyIndex]: body } = bodies

      body.setPosition(new Vec3(position.x, position.y, position.z))
    } else if ("isMesh" in objectMesh) {
      const body = meshMap.get(objectMesh)

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

    meshes.forEach((objectMesh) => {
      if ("isInstancedMesh" in objectMesh) {
        const matrixArray = objectMesh.instanceMatrix.array as number[]
        const bodies: OIMOBody[] = meshMap.get(objectMesh)

        bodies.forEach((...forEachArgs) => {
          const [body, bodyIndex] = forEachArgs

          compose({
            arrayBaseIndex: bodyIndex * 16,
            matrixArray,
            position: body.getPosition(),
            quaternion: body.getOrientation(),
          })
        })

        objectMesh.instanceMatrix.needsUpdate = true
      } else if ("isMesh" in objectMesh) {
        const body = meshMap.get(objectMesh)

        objectMesh.position.copy(body.getPosition())
        objectMesh.quaternion.copy(body.getOrientation())
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
