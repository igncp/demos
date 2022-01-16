import {
  zTestGetArc,
  zTestGetTextsOpacity,
  zTestGetTextsTransform,
  zTestGetX0CentroidCorrection,
} from "../partition-chart"

import { dummyNode, testRadius } from "./partition-chart.testData"

const getTextsTransform = zTestGetTextsTransform!
const getArc = zTestGetArc!
const getX0CentroidCorrection = zTestGetX0CentroidCorrection!
const getTextsOpacity = zTestGetTextsOpacity!

const parseTransform = (transformStr: string) => {
  const [, rotateDegStr, rotateXStr, rotateYStr, translateXStr, translateYStr] =
    /rotate\((.*?),(.*?),(.*?)\) translate\((.*?),(.*?)\)/.exec(transformStr)!

  return {
    rotateDeg: Number(rotateDegStr),
    rotateX: Number(rotateXStr),
    rotateY: Number(rotateYStr),
    translateX: Number(translateXStr),
    translateY: Number(translateYStr),
  }
}

describe("getTextsTransform", () => {
  const arc = getArc()
  const textsTransform = getTextsTransform(arc)

  it("returns no transform when depth is 0", () => {
    const transform = textsTransform({
      ...dummyNode,
      depth: 0,
    })

    expect(transform).toEqual("")
  })

  it("returns the expected result for half vertical slide", () => {
    const node = {
      ...dummyNode,
      depth: 1,
      x0: 0,
      x1: Math.PI,
      y0: 0,
      y1: testRadius,
    }
    const transformStr = textsTransform(node)
    const transform = parseTransform(transformStr)
    const centroid = arc.centroid({
      ...node,
      x0: getX0CentroidCorrection(node.x0),
    })

    expect(transform.rotateDeg).toEqual(0)
    expect(transform.rotateX).toBeCloseTo(testRadius / 2, 1)
    expect(transform.rotateX).toEqual(centroid[0])
    expect(transform.rotateY).toEqual(centroid[1])
    expect(transform.translateX).toBeCloseTo(50, 1)
    expect(transform.translateX).toEqual(centroid[0])
    expect(transform.translateY).toEqual(centroid[1])
  })

  it("returns the expected result for quarter slide (top right)", () => {
    const node = {
      ...dummyNode,
      depth: 1,
      x0: 0,
      x1: Math.PI / 2,
      y0: 0,
      y1: testRadius,
    }
    const transformStr = textsTransform(node)
    const transform = parseTransform(transformStr)
    const centroid = arc.centroid({
      ...node,
      x0: getX0CentroidCorrection(node.x0),
    })

    expect(transform.rotateDeg).toEqual(-45)
    expect(transform.rotateX).toBeCloseTo(
      (testRadius / 2) * Math.cos(Math.PI / 4),
      -1
    )
    expect(transform.rotateX).toEqual(centroid[0])
    expect(transform.rotateY).toEqual(centroid[1])
    expect(transform.translateX).toBeCloseTo(
      (testRadius / 2) * Math.cos(Math.PI / 4),
      -1
    )
    expect(transform.translateX).toEqual(centroid[0])
    expect(transform.translateY).toEqual(centroid[1])
  })

  it("returns the expected rotate for quarter slide (bottom right)", () => {
    const node = {
      ...dummyNode,
      depth: 1,
      x0: Math.PI / 2,
      x1: Math.PI,
      y0: 0,
      y1: testRadius,
    }
    const transformStr = textsTransform(node)
    const transform = parseTransform(transformStr)

    expect(transform.rotateDeg).toEqual(45)
  })

  it("returns the expected rotate when half slice in the bottom (special case)", () => {
    const node = {
      ...dummyNode,
      depth: 1,
      x0: Math.PI / 2,
      x1: (Math.PI * 3) / 2,
      y0: 0,
      y1: testRadius,
    }
    const transformStr = textsTransform(node)
    const transform = parseTransform(transformStr)

    expect(transform.rotateDeg).toEqual(0)
  })
})

describe("getTextsOpacity", () => {
  it("returns 0 for bottom slice less than half (almost vertical)", () => {
    const opacity = getTextsOpacity({
      ...dummyNode,
      depth: 1,
      x0: Math.PI / 2 + 0.1,
      x1: (Math.PI * 3) / 2,
      y0: 0,
      y1: testRadius,
    })

    expect(opacity).toEqual(0)
  })

  it("returns 0 for small angle", () => {
    const opacity = getTextsOpacity({
      ...dummyNode,
      depth: 1,
      x0: Math.PI / 2,
      x1: Math.PI / 2 + 0.1,
    })

    expect(opacity).toEqual(0)
  })

  it("returns 1 for bottom slice more than half (special case)", () => {
    const opacity = getTextsOpacity({
      ...dummyNode,
      depth: 1,
      x0: Math.PI / 2,
      x1: (Math.PI * 3) / 2,
    })

    expect(opacity).toEqual(1)
  })
})
