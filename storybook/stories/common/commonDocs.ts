const getCanvasRenderingDoc = (name: string) => ({
  link: `https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/${name}`,
  name,
})

const getSVGElementDoc = (name: string) => ({
  link: `https://developer.mozilla.org/en-US/docs/Web/SVG/Element/${name}`,
  name: `${name} Element`,
})

const getSVGAttributeDoc = (name: string) => ({
  link: `https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/${name}`,
  name: `${name} attribute`,
})

const getThreeDoc = (path: string[]) => ({
  link: `https://threejs.org/docs/#api/en/${path.join("/")}`,
  name: `${path.join(".")} docs`,
})

const getThreeExampleDoc = (path: string[]) => ({
  link: `https://github.com/mrdoob/three.js/blob/dev/examples/jsm/${path.join(
    "/"
  )}.js`,
  name: `${path.join(".")} example source code`,
})

export const canvasDocs = {
  arc: getCanvasRenderingDoc("arc"),
  beginPath: getCanvasRenderingDoc("beginPath"),
  clearRect: getCanvasRenderingDoc("clearRect"),
  getImageData: getCanvasRenderingDoc("getImageData"),
  globalCompositeOperation: getCanvasRenderingDoc("globalCompositeOperation"),
  strokeStyle: getCanvasRenderingDoc("strokeStyle"),
} as const

export const svgDocs = {
  animateTransform: getSVGElementDoc("animateTransform"),
  begin: getSVGAttributeDoc("begin"),
} as const

export const threeDocs = {
  canvasTexture: getThreeDoc(["textures", "CanvasTexture"]),
  color: getThreeDoc(["math", "color"]),
  improveNoiseExample: getThreeExampleDoc(["math", "ImprovedNoise"]),
  meshPhysicalMaterial: getThreeDoc(["materials", "MeshPhysicalMaterial"]),
  vector3: getThreeDoc(["math", "Vector3"]),
  webGLRenderer: getThreeDoc(["renderers", "WebGLRenderer"]),
}
