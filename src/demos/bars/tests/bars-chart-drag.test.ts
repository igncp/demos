/**
 * @jest-environment jsdom
 */
import { select } from "d3"

import { DragModule } from "../bars-chart-drag"

const body = select("body")

beforeEach(() => {
  body.text("")
})

type ChartData = unknown

const mockChartWidth = 100

const getMockSelections = () => {
  const svg = body.append("svg")
  const dragArea = svg.append("g")
  const chart = dragArea.append("g")

  chart.node()!.getClientRects = () => [
    // @ts-expect-error
    {
      width: mockChartWidth,
    },
  ]

  return {
    chart,
    dragArea,
    svg,
  }
}

describe("DragModule.reset", () => {
  it("updates the transform on reset", () => {
    const selections = getMockSelections()
    const dragModule = new DragModule<ChartData>(selections)

    dragModule.setDimensions({
      marginLeft: 10,
      width: 100,
    })

    expect(selections.dragArea.attr("transform")).toEqual(null)

    dragModule.reset()

    expect(selections.dragArea.attr("transform")).toEqual("translate(0,0)")
  })
})

describe("DragModule drag event", () => {
  const marginLeft = 10
  const width = 100

  it.each([
    [-50, mockChartWidth - marginLeft - width], // out of limits
    [50, 0], // out of limits
    [-5, -5],
  ])("when dx: %s, drags to %s", (...[dx, transform]) => {
    const selections = getMockSelections()
    const dragModule = new DragModule<ChartData>(selections)

    dragModule.setDimensions({
      marginLeft,
      width,
    })

    dragModule.reset()

    const dragEvent = new Event("drag")

    ;(dragEvent as unknown as { dx: number }).dx = dx

    selections.svg.node()!.dispatchEvent(dragEvent)

    expect(selections.dragArea.attr("transform")).toEqual(
      `translate(${transform},0)`
    )
  })
})
