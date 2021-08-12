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

export const canvasDocs = {
  arc: getCanvasRenderingDoc("arc"),
  beginPath: getCanvasRenderingDoc("beginPath"),
  clearRect: getCanvasRenderingDoc("clearRect"),
  globalCompositeOperation: getCanvasRenderingDoc("globalCompositeOperation"),
  strokeStyle: getCanvasRenderingDoc("strokeStyle"),
} as const

export const svgDocs = {
  animateTransform: getSVGElementDoc("animateTransform"),
  begin: getSVGAttributeDoc("begin"),
} as const
