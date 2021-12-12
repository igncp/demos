// https://github.com/riccardoscalco/textures
declare module "textures" {
  import { Selection } from "d3"

  // https://github.com/riccardoscalco/textures/blob/master/src/lines.js
  type LineTexture = ((
    sel: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  ) => void) & {
    background: (background?: string) => LineTexture
    heavier: (heavier?: number) => LineTexture
    id: (() => string) & ((id: string) => LineTexture)
    lighter: (lighter?: number) => LineTexture
    orientation: (orientation?: string) => LineTexture
    shapeRendering: (shape: string) => LineTexture
    size: (size: number) => LineTexture
    stroke: (stroke: string) => LineTexture
    strokeWidth: (strokeWidth: number) => LineTexture
    thicker: (thicker?: number) => LineTexture
    thinner: (thinner?: number) => LineTexture
    url: () => string
  }

  const textures: { lines: () => LineTexture }

  export default textures
}
