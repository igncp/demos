import { scaleLinear } from "d3"
import debounce from "lodash/debounce"
import React from "react"
import {
  BoxGeometry,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  ShadowMaterial,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

import { createOimoPhysics } from "./OimoPhysics"

const ROOT_ID = "example"

type Physics = ReturnType<typeof createOimoPhysics>

type State = {
  isStopped: boolean
  timeCounter: number
}

type SimulationEls = {
  boxes: InstancedMesh
  camera: PerspectiveCamera
  floor: Mesh
  hemiLight: HemisphereLight
  position: Vector3
  renderer: WebGLRenderer
  scene: Scene
  spheres: InstancedMesh
}

type Props = {
  itemsNumber: number
  speed: number
}

type Simulation = {
  elements: SimulationEls
  physics: Physics
  props: Props
  state: State
  stop: () => void
}

const createPhysics = (previousSimulation: Simulation | null): Physics =>
  previousSimulation?.physics ? previousSimulation.physics : createOimoPhysics()

const speedScale = scaleLinear().domain([0, 200]).range([200, 1])

type CreateDemo = (options: {
  physics: Physics
  previousSimulation: Simulation | null
  props: Props
}) => Simulation

const createDemo: CreateDemo = ({
  physics,
  previousSimulation,
  props,
}): Simulation => {
  const state: State = {
    timeCounter: 0,
    ...(previousSimulation?.state ?? {}),
    isStopped: false,
  }
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 500

  const elements: SimulationEls = (() => {
    if (previousSimulation) {
      return previousSimulation.elements
    }

    const floor = new Mesh(
      new BoxGeometry(1000, 5, 1000),
      new ShadowMaterial({ color: 0x777777 })
    )

    const objectsMaterial = new MeshLambertMaterial()
    const geometryBox = new BoxGeometry(0.1, 0.1, 0.1)
    const geometrySphere = new IcosahedronGeometry(0.075, 3)

    const shapesTypes = 2

    return {
      boxes: new InstancedMesh(
        geometryBox,
        objectsMaterial,
        Math.ceil(props.itemsNumber / shapesTypes)
      ),
      camera: new PerspectiveCamera(50, width / height, 0.1, 100),
      floor,
      hemiLight: new HemisphereLight(),
      position: new Vector3(),
      renderer: new WebGLRenderer({ antialias: true }),
      scene: new Scene(),
      spheres: new InstancedMesh(
        geometrySphere,
        objectsMaterial,
        Math.ceil(props.itemsNumber / shapesTypes)
      ),
    }
  })()

  const {
    boxes,
    camera,
    floor,
    hemiLight,
    position,
    renderer,
    scene,
    spheres,
  } = elements

  const createSimulation = (): Simulation => ({
    elements,
    physics,
    props,
    state,
    stop: () => {
      state.isStopped = true
    },
  })

  const meshList = [boxes, spheres] as const

  const setupInitialSimulation = () => {
    camera.position.set(-1, 1.5, 2)
    camera.lookAt(0, 0.5, 0)

    scene.background = new Color(0xffffff)

    hemiLight.intensity = 0.35
    scene.add(hemiLight)

    const dirLight = new DirectionalLight()

    dirLight.position.set(5, 5, 5)
    dirLight.castShadow = true
    dirLight.shadow.camera.zoom = 2
    scene.add(dirLight)

    floor.position.y = -2.5
    floor.receiveShadow = true
    scene.add(floor)
    physics.addMesh({ objectMesh: floor })

    meshList.forEach((objectMesh) => {
      objectMesh.instanceMatrix.setUsage(DynamicDrawUsage)
      objectMesh.castShadow = true
      objectMesh.receiveShadow = true
      scene.add(objectMesh)

      const matrix = new Matrix4()
      const color = new Color()

      Array.from({ length: objectMesh.count }).forEach((...forEachArgs) => {
        const [, meshItemIndex] = forEachArgs

        matrix.setPosition(
          Math.random() - 0.5,
          Math.random() * 2,
          Math.random() - 0.5
        )

        objectMesh.setMatrixAt(meshItemIndex, matrix)
        objectMesh.setColorAt(
          meshItemIndex,
          color.setHex(0xffffff * Math.random())
        )
      })

      physics.addMesh({ mass: 1, objectMesh })
    })

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.outputEncoding = sRGBEncoding

    container.innerHTML = ""
    container.append(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.target.y = 0.5
    controls.update()
  }

  const animate = () => {
    if (state.isStopped) {
      return
    }

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

    state.timeCounter += 1

    if (!props.speed) {
      return
    }

    const realSpeed = speedScale(props.speed)
    const diff = Math.floor(state.timeCounter % realSpeed)

    if (diff !== 0) {
      return
    }

    meshList
      .filter(() => Math.random() > 0.5)
      .forEach((objectMesh) => {
        const bodyIndex = Math.floor(Math.random() * objectMesh.count)

        position.set(0, Math.random() + 1, 0)
        physics.setMeshPosition({ bodyIndex, objectMesh, position })
      })
  }

  if (previousSimulation) {
    animate()

    return createSimulation()
  }

  setupInitialSimulation()

  animate()

  return createSimulation()
}

type Demo = (config: {
  previousSimulation: Simulation | null
  props: Props
}) => Simulation

const demo: Demo = ({ previousSimulation, props }) => {
  if (previousSimulation?.props.itemsNumber !== props.itemsNumber) {
    previousSimulation?.physics.stop()

    const physics = createPhysics(null)

    return createDemo({ physics, previousSimulation: null, props })
  }

  const physics = createPhysics(previousSimulation)

  return createDemo({ physics, previousSimulation, props })
}

const ThreeJSPhysicsFalls = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  const runSimulation = React.useCallback(
    debounce((latestProps: Props) => {
      simulationRef.current?.stop()

      simulationRef.current = demo({
        previousSimulation: simulationRef.current,
        props: latestProps,
      })
    }, 200),
    []
  )

  React.useEffect(
    () => () => {
      simulationRef.current!.stop()
    },
    []
  )

  React.useEffect(() => runSimulation(props), [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://github.com/mrdoob/three.js/blob/dev/examples/physics_oimo_instancing.html"
        sourceText="Source (official example, ported to TS)"
        storyName="ThreeJSPhysicsFalls"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <ThreeJSPhysicsFalls {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [speedArgs, speedControls] = createRangeControl({
  diffMin: 100,
  initialValue: 100,
  step: 1,
})
const [itemsNumberArgs, itemsNumberControls] = createRangeControl({
  diffMax: 900,
  diffMin: 99,
  initialValue: 100,
  step: 1,
})

const args: Props = {
  itemsNumber: itemsNumberArgs,
  speed: speedArgs,
}

Common.args = args

export default {
  argTypes: {
    itemsNumber: itemsNumberControls,
    speed: speedControls,
  },
  component: ThreeJSPhysicsFalls,
  title: "ThreeJS/Physics Falls",
}

export { Common }
