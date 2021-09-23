import React from "react"
import { PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { StoryInfo, TemplateType, createRangeControl } from "../common"

const ROOT_ID = "example"

type Props = {
  speed: number
}

type State = {
  isStopped: boolean
  time: number
}

type SimulationElements = {
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  scene: Scene
}

type Simulation = {
  elements: SimulationElements
  props: Props
  state: State
  stop: () => void
}

const demo = ({
  prevSimulation,
  props,
}: {
  prevSimulation: Simulation | null
  props: Props
}): Simulation => {
  const state: State = {
    time: 0,
    ...(prevSimulation?.state ?? {}),
    isStopped: false,
  }
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()
  const height = 500

  const elements = ((): SimulationElements => {
    if (prevSimulation) {
      return prevSimulation.elements
    }

    const camera = new PerspectiveCamera(50, width / height, 1, 10)
    const renderer = new WebGLRenderer()
    const scene = new Scene()

    return {
      camera,
      renderer,
      scene,
    }
  })()

  const { camera, renderer, scene } = elements

  const createSimulation = (): Simulation => ({
    elements,
    props,
    state,
    stop: () => {
      state.isStopped = true
    },
  })

  const initSimulation = () => {
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.target.y = 0.5
    controls.update()
  }

  const render = () => {
    renderer.render(scene, camera)
  }

  const animate = () => {
    if (state.isStopped) {
      return
    }

    requestAnimationFrame(animate)

    render()
  }

  if (prevSimulation) {
    prevSimulation.stop()

    animate()

    return createSimulation()
  }

  initSimulation()
  animate()

  return createSimulation()
}

const SampleThreeJSStory = (props: Props) => {
  const simulationRef = React.useRef<Simulation | null>(null)

  React.useEffect(() => {
    simulationRef.current = demo({
      prevSimulation: simulationRef.current,
      props,
    })
  }, [props])

  return (
    <div>
      <StoryInfo docs={[]} source="" storyName={""} />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <SampleThreeJSStory {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [speedArg, speedControls] = createRangeControl({
  diffMin: 100,
  initialValue: 100,
  step: 1,
})

const args: Props = {
  speed: speedArg,
}

Common.args = args

export default {
  argTypes: {
    speed: speedControls,
  },
  component: SampleThreeJSStory,
  title: "",
}

export { Common }
