import QUnitType from "qunit"
import { Color, MeshLambertMaterial, Vector3, WebGLRenderer } from "three"

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

  // https://threejs.org/docs/#api/en/materials/MeshLambertMaterial
  QUnit.test("MeshLambertMaterial", (assert) => {
    const testMaterial = new MeshLambertMaterial()

    // has properties specific to the MeshLambertMaterial
    assert.deepEqual(testMaterial.lightMap, null)

    // has common properties from the base Material
    assert.deepEqual(testMaterial.alphaTest, 0)
    assert.deepEqual(testMaterial.type, "MeshLambertMaterial")
    assert.deepEqual(testMaterial.opacity, 1)
    assert.deepEqual(testMaterial.toJSON().reflectivity, 1)

    // has the expected default
    assert.deepEqual(testMaterial.emissive, new Color(0x000000))
  })

  QUnit.test("Vector3", (assert) => {
    const vect1 = new Vector3(1, 1, 1)
    const vect0 = new Vector3()

    assert.deepEqual(
      vect1.distanceTo(vect0).toFixed(3),
      Math.pow(3, 0.5).toFixed(3)
    )

    assert.deepEqual(vect1.divideScalar(0.5), new Vector3(2, 2, 2))

    // the vector has been mutated in the previous operation
    assert.deepEqual(vect1.x, 2)
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
