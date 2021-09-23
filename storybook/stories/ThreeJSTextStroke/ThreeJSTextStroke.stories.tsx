import React from "react"
import {
  Color,
  DoubleSide,
  Font,
  Group,
  Mesh,
  MeshBasicMaterial,
  Path,
  PerspectiveCamera,
  Scene,
  Shape,
  ShapeGeometry,
  WebGLRenderer,
} from "three"
import FontData from "three/examples/fonts/helvetiker_regular.typeface.json"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js"

import { StoryInfo, TemplateType } from "../common"

const ROOT_ID = "examples"

type State = {
  isStopped: boolean
}

type Props = {
  text: string
}

type Simulation = {
  camera: PerspectiveCamera
  props: Props
  renderer: WebGLRenderer
  scene: Scene
  stop: () => void
}

const font = new Font(FontData)

type CreateDemo = (config: {
  prevSimulation: Simulation | null
  props: Props
}) => Simulation

const createDemo: CreateDemo = ({ prevSimulation, props }) => {
  const { text: message } = props
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 500

  const state: State = {
    isStopped: false,
  }

  const scene = prevSimulation?.scene ?? new Scene()
  const camera =
    prevSimulation?.camera ??
    new PerspectiveCamera(45, width / height, 1, 10000)
  const renderer =
    prevSimulation?.renderer ?? new WebGLRenderer({ antialias: true })

  const createSimulation = () => ({
    camera,
    props,
    renderer,
    scene,
    stop: () => {
      state.isStopped = true
    },
  })

  scene.background = new Color(0xffffff)

  const color = new Color(0x006699)

  const matDark = new MeshBasicMaterial({
    color,
    side: DoubleSide,
  })

  const matLite = new MeshBasicMaterial({
    color,
    opacity: 0.4,
    side: DoubleSide,
    transparent: true,
  })

  const generateText = () => {
    scene.clear()

    const shapes = font.generateShapes(message, 100) as Array<Path | Shape>
    const textGeometry = new ShapeGeometry(shapes as Shape[])

    textGeometry.computeBoundingBox()

    const xMid =
      -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x)

    textGeometry.translate(xMid, 0, 0)

    const text = new Mesh(textGeometry, matLite)

    text.position.z = -150
    scene.add(text)

    const holeShapes: Path[] = []

    ;(shapes as Shape[]).forEach((shape) => {
      if ((shape.holes.length || 0) > 0) {
        shape.holes.forEach((hole) => {
          holeShapes.push(hole)
        })
      }
    })
    shapes.push(...holeShapes)

    const style = SVGLoader.getStrokeStyle(5, color.getStyle())

    const strokeText = new Group()

    shapes.forEach((shape) => {
      const points = shape.getPoints()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const svgGeo = SVGLoader.pointsToStroke(points as any, style)

      svgGeo.translate(xMid, 0, 0)

      const strokeMesh = new Mesh(svgGeo, matDark)

      strokeText.add(strokeMesh)
    })

    scene.add(strokeText)
  }

  const animate = () => {
    if (state.isStopped) {
      return
    }

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }

  if (prevSimulation) {
    generateText()
    animate()

    return createSimulation()
  }

  camera.position.set(0, -400, 600)

  generateText()

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  container.innerHTML = ""
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.target.set(0, 0, 0)
  controls.update()

  animate()

  return createSimulation()
}

const ThreeJSTextStroke = (props: Props) => {
  const [prevSimulation, setPrevSimulation] = React.useState<Simulation | null>(
    null
  )

  React.useEffect(() => {
    const newSimulation = createDemo({ prevSimulation, props })

    setPrevSimulation(newSimulation)

    return () => {
      newSimulation.stop()
    }
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[]}
        source="https://threejs.org/examples/?q=text#webgl_geometry_text_stroke"
        sourceText="Source (official example, ported to TS)"
        storyName="ThreeJSTextStroke"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <ThreeJSTextStroke {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const args: Props = {
  text: "Demos\nExample",
}

Common.args = args

export default {
  argTypes: {},
  component: ThreeJSTextStroke,
  title: "ThreeJS/Text Stroke",
}

export { Common }
