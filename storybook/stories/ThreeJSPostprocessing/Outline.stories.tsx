import React from "react"
import {
  AmbientLight,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  LoadingManager,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

const ROOT_ID = "example"

type State = {
  rafId: number | null
}

type SimulationElements = {
  camera: PerspectiveCamera
  composer: EffectComposer
  controls: OrbitControls
  group: Group
  mouse: Vector2
  obj3d: Object3D
  outlinePass: OutlinePass
  raycaster: Raycaster
  renderer: WebGLRenderer
  scene: Scene
}

type Props = {
  edgeGlow: number
  edgeStrength: number
  edgeThickness: number
  pulsePeriod: number
  rotate: boolean
  usePatternTexture: boolean
}

const getContainer = () => {
  const container = document.getElementById(ROOT_ID) as HTMLElement

  return container
}

class Simulation {
  private readonly state: State
  private readonly elements: SimulationElements
  private readonly dimensions: { height: number; width: number }

  private props: Props
  private selectedObjects: Mesh[]

  public constructor(props: Props) {
    this.state = {
      rafId: null,
    }

    this.props = props

    const container = getContainer()
    const { width } = container.getBoundingClientRect()
    const height = 500

    this.dimensions = {
      height,
      width,
    }

    document.body.appendChild(container)

    const camera = new PerspectiveCamera(45, width / height, 0.1, 100)
    const renderer = new WebGLRenderer()
    const scene = new Scene()

    scene.background = new Color(0xffffff)

    scene.add(new AmbientLight(0xaaaaaa, 0.2))

    const light = new DirectionalLight(0xddffdd, 0.6)

    light.position.set(1, 1, 1)
    light.castShadow = true
    light.shadow.mapSize.width = 1024
    light.shadow.mapSize.height = 1024

    const lightDistance = 10

    light.shadow.camera.left = -lightDistance
    light.shadow.camera.right = lightDistance
    light.shadow.camera.top = lightDistance
    light.shadow.camera.bottom = -lightDistance
    light.shadow.camera.far = 1000

    scene.add(light)

    renderer.shadowMap.enabled = true
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    camera.position.set(0, 0, 8)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.minDistance = 5
    controls.maxDistance = 20
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const raycaster = new Raycaster()
    const mouse = new Vector2()

    const obj3d = new Object3D()
    const group = new Group()

    const composer = new EffectComposer(renderer)

    scene.add(group)
    group.add(obj3d)

    this.selectedObjects = []

    const outlinePass = new OutlinePass(
      new Vector2(width, height),
      scene,
      camera
    )

    this.elements = {
      camera,
      composer,
      controls,
      group,
      mouse,
      obj3d,
      outlinePass,
      raycaster,
      renderer,
      scene,
    }

    this.init()
    this.animate()
  }

  public stop() {
    this.clearRafId()
  }

  public restart(props: Props) {
    this.clearRafId()
    this.props = props
    this.updateOutlinePass()
    this.animate()
  }

  private clearRafId() {
    const {
      state: { rafId },
    } = this

    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      this.state.rafId = null
    }
  }

  private animate() {
    this.state.rafId = requestAnimationFrame(() => {
      this.animate()
    })

    const {
      elements: { composer, controls, group },
    } = this

    const timer = performance.now()

    if (this.props.rotate) {
      group.rotation.y = timer * 0.0001
    }

    controls.update()
    composer.render()
  }

  private updateOutlinePass() {
    const {
      elements: { outlinePass },
    } = this

    outlinePass.edgeStrength = this.props.edgeStrength
    outlinePass.edgeGlow = this.props.edgeGlow
    outlinePass.edgeThickness = this.props.edgeThickness
    outlinePass.usePatternTexture = this.props.usePatternTexture
    outlinePass.pulsePeriod = this.props.pulsePeriod
  }

  private init() {
    const loadingManager = new LoadingManager()

    const {
      elements: {
        camera,
        composer,
        group,
        mouse,
        obj3d,
        outlinePass,
        raycaster,
        renderer,
        scene,
      },
    } = this

    const loader = new OBJLoader(loadingManager)

    loader.load("models/tree.obj", (object) => {
      let scale = 1.0

      object.traverse((child) => {
        if (child instanceof Mesh) {
          child.geometry.center()
          child.geometry.computeBoundingSphere()
          scale = 0.2 * child.geometry.boundingSphere.radius

          const phongMaterial = new MeshPhongMaterial({
            color: 0xffffff,
            shininess: 5,
            specular: 0x111111,
          })

          child.material = phongMaterial // eslint-disable-line id-denylist
          child.receiveShadow = true
          child.castShadow = true
        }
      })

      object.position.y = 1
      object.scale.divideScalar(scale)
      obj3d.add(object)
    })

    const sphereGeometry = new SphereGeometry(3, 48, 24)

    Array.from({ length: 20 }).forEach(() => {
      const sphereMaterial = new MeshLambertMaterial()

      sphereMaterial.color.setHSL(Math.random(), 1.0, 0.3)

      const sphereMesh = new Mesh(sphereGeometry, sphereMaterial)

      sphereMesh.position.x =
        Math.random() * 8 * (Math.random() > 0.5 ? 1 : -1) - 2
      sphereMesh.position.y = Math.random() * 5 - 1
      sphereMesh.position.z =
        Math.random() * 8 * (Math.random() > 0.5 ? 1 : -1) - 2
      sphereMesh.receiveShadow = true
      sphereMesh.castShadow = true
      sphereMesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1)

      group.add(sphereMesh)
    })

    const floorMaterial = new MeshLambertMaterial({
      color: 0x00ff00,
      side: DoubleSide,
    })

    const floorGeometry = new PlaneGeometry(50, 50)
    const floorMesh = new Mesh(floorGeometry, floorMaterial)

    floorMesh.rotation.x -= Math.PI * 0.5
    floorMesh.position.y -= 1.5
    floorMesh.receiveShadow = true

    group.add(floorMesh)

    const torusGeometry = new TorusGeometry(1, 0.3, 16, 100)
    const torusMaterial = new MeshPhongMaterial({ color: 0xffaaff })
    const torus = new Mesh(torusGeometry, torusMaterial)

    torus.position.z = -4
    group.add(torus)
    torus.receiveShadow = true
    torus.castShadow = true

    const renderPass = new RenderPass(scene, camera)

    composer.addPass(renderPass)

    this.updateOutlinePass()

    composer.addPass(outlinePass)

    const textureLoader = new TextureLoader()

    textureLoader.load("textures/tri_pattern.jpg", (texture) => {
      outlinePass.patternTexture = texture
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
    })

    // https://blog.codinghorror.com/fast-approximate-anti-aliasing-fxaa/
    const effectFXAA = new ShaderPass(FXAAShader)

    const {
      dimensions: { height, width },
    } = this

    effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height)
    composer.addPass(effectFXAA)

    const checkIntersection = () => {
      raycaster.setFromCamera(mouse, camera)

      const intersects = raycaster.intersectObject(scene, true)

      if (intersects.length > 0) {
        const [{ object: selectedObject }] = intersects

        this.selectedObjects = [selectedObject as Mesh]
      } else {
        this.selectedObjects = []
      }

      outlinePass.selectedObjects = this.selectedObjects
    }

    const onPointerMove = (pointerEvent: PointerEvent) => {
      if (!pointerEvent.isPrimary) {
        return
      }

      const { left, top } = getContainer().getBoundingClientRect()

      mouse.x = ((pointerEvent.clientX - left) / width) * 2 - 1
      mouse.y = -((pointerEvent.clientY - top) / height) * 2 + 1

      checkIntersection()
    }

    renderer.domElement.style.touchAction = "none"
    renderer.domElement.addEventListener("pointermove", onPointerMove)
  }
}

const Outline = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.restart(props)
    } else {
      simulationRef.current = new Simulation(props)
    }

    return () => {
      simulationRef.current!.stop()
    }
  }, [props])

  React.useEffect(
    () => () => {
      const container = getContainer()

      container.innerHTML = ""
    },
    []
  )

  return (
    <div>
      <StoryInfo
        docs={[
          {
            link: "https://blog.codinghorror.com/fast-approximate-anti-aliasing-fxaa/",
            name: "FXAA Shader",
          },
          {
            link: "https://threejs.org/docs/#examples/en/postprocessing/EffectComposer",
            name: "EffectComposer",
          },
        ]}
        source={[
          "https://github.com/mrdoob/three.js/blob/dev/examples/webgl_postprocessing_outline.html",
          "https://threejs.org/examples/#webgl_postprocessing_outline",
        ]}
        storyName={["ThreeJSPostprocessing", "Outline"]}
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <Outline {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [edgeStrengthArg, edgeStrengthControls] = createRangeControl({
  diffMax: 5,
  diffMin: 2,
  initialValue: 3,
  step: 1,
})

const [edgeGlowArg, edgeGlowControls] = createRangeControl({
  diffMax: 5,
  diffMin: 0,
  initialValue: 0,
  step: 1,
})

const [edgeThicknessArg, edgeThicknessControls] = createRangeControl({
  diffMax: 5,
  diffMin: 1,
  initialValue: 1,
  step: 0.1,
})

const [pulsePeriodArg, pulsePeriodControls] = createRangeControl({
  diffMax: 5,
  diffMin: 0,
  initialValue: 0,
  step: 1,
})

const args: Props = {
  edgeGlow: edgeGlowArg,
  edgeStrength: edgeStrengthArg,
  edgeThickness: edgeThicknessArg,
  pulsePeriod: pulsePeriodArg,
  rotate: false,
  usePatternTexture: false,
}

Common.args = args

export default {
  argTypes: {
    edgeGlow: edgeGlowControls,
    edgeStrength: edgeStrengthControls,
    edgeThickness: edgeThicknessControls,
    pulsePeriod: pulsePeriodControls,
  },
  component: Outline,
  title: "ThreeJS/Postprocessing/Outline",
}

export { Common }
