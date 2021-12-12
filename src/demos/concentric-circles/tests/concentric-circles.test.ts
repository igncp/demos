import { _test as circlesChartPrivate } from "../circles-chart"
import { getChartConfig } from "../concentric-circles-config"

jest.mock("d3", () => ({}))

const addYear = <InputObj extends Record<string, unknown>>(
  obj: InputObj
): InputObj & { year: string } => ({
  ...obj,
  year: "2012",
})

describe("getChartConfig", () => {
  it("retuns the expected circlesData", () => {
    const namesMetrics = [
      { count: 10, name: "nameC" },
      { count: 3, name: "nameA" },
      { count: 5, name: "nameA" },
      { count: 2, name: "nameA" },
      { count: 1, name: "nameB" },
    ].map(addYear)

    const { circlesData } = getChartConfig({
      namesMetrics,
    })

    // It leaves one item of `nameA` (the one with bigger count) and sorts them
    // by ascending count
    expect(circlesData).toEqual(
      [
        { count: 1, name: "nameB" },
        { count: 5, name: "nameA" },
        { count: 10, name: "nameC" },
      ].map(addYear)
    )
  })
})

describe("circlesChartPrivate", () => {
  const { getNewDrag } = circlesChartPrivate!

  it("returns the expected new drag", () => {
    const newDrag = getNewDrag({
      baseZoom: 10,
      newZoom: 20,
      prevDragX: 0,
      prevDragY: 0,
      prevZoom: 10,
      zoomPoint: { x: 50, y: 50 },
    })

    // Without drag, the zoom point is in [100,100] because it doubled the
    // scale, so it has to move to -50 to keep the same center
    expect(newDrag).toEqual({ x: -50, y: -50 })
  })
})
