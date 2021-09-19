import QUnitType from "qunit"
import { Color, WebGLRenderer } from "three"

const threeJSTests = (QUnit: QUnitType) => {
  // https://threejs.org/docs/#api/en/math/Color
  // https://en.wikipedia.org/wiki/X11_color_names#Color_name_chart
  QUnit.test("Color", (assert) => {
    const colorA = new Color(0xffff00)
    const colorRed = new Color(0xff0000)

    assert.deepEqual(colorA.r, 1)
    assert.deepEqual(colorA.b, 0)
    assert.deepEqual(colorA.getHex(), 0xffff00)
    assert.deepEqual(colorA.getHexString(), "ffff00")
    assert.deepEqual(colorA.getStyle(), "rgb(255,255,0)")

    // substracts and removes the difference
    assert.deepEqual(colorA.sub(colorRed).getHexString(), "00ff00")

    // the previous operation mutated only the colorA color
    assert.deepEqual(colorA.getHexString(), "00ff00")
    assert.deepEqual(colorRed.getHexString(), "ff0000")
  })

  // https://threejs.org/docs/#api/en/renderers/WebGLRenderer
  QUnit.test("WebGLRenderer", (assert) => {
    const rendererA = new WebGLRenderer()

    // the renderer creates its own DOM element
    assert.deepEqual(rendererA.domElement instanceof HTMLCanvasElement, true)

    assert.deepEqual(rendererA.info.memory, { geometries: 0, textures: 0 })

    // by default the renderer automatically clears the canvas output before each frame
    assert.deepEqual(rendererA.autoClear, true)
  })
}

export default threeJSTests
