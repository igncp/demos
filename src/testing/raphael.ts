import QUnitType from "qunit"

const Raphael = typeof window === "undefined" ? null : require("raphael")

const raphaelTests = (QUnit: QUnitType) => {
  QUnit.test("basic", (assert) => {
    const div = document.createElement("div")
    const paper = Raphael(div, 100, 100)

    assert.deepEqual(paper instanceof Raphael, true)
    assert.deepEqual(paper.canvas instanceof SVGSVGElement, true)
    assert.deepEqual(paper.width, 100)
    assert.deepEqual(paper.height, 100)
    assert.deepEqual((paper as any).getSize(), { height: 0, width: 0 })
  })
}

export default raphaelTests
