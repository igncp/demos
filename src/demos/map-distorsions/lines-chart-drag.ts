import { D3DragEvent, Selection, drag as dragD3 } from "d3"

class DragModule<DragDatum> {
  private readonly elements: {
    chart: Selection<SVGGElement, DragDatum, HTMLElement, unknown>
    dragArea: Selection<SVGGElement, DragDatum, HTMLElement, unknown>
    svg: Selection<SVGSVGElement, DragDatum, HTMLElement, unknown>
  }

  private readonly state: {
    dragX: number
    marginLeft: number
    width: number
  } = {
    dragX: 0,
    marginLeft: 0,
    width: 0,
  }

  public constructor({
    chart,
    dragArea,
    svg,
  }: DragModule<DragDatum>["elements"]) {
    this.elements = {
      chart,
      dragArea,
      svg,
    }
  }

  public setDimensions({
    marginLeft,
    width,
  }: {
    marginLeft: number
    width: number
  }) {
    this.state.width = width
    this.state.marginLeft = marginLeft
  }

  public refresh() {
    const {
      elements: { svg },
    } = this

    const diffWidth = this.getDragDiffWidth()

    svg.style("cursor", diffWidth > 0 ? "move" : "default")
  }

  public reset() {
    this.refresh()

    const {
      elements: { svg },
    } = this

    this.state.dragX = 0

    const handler = (
      dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      this.state.dragX += dragEvent.dx

      const diffWidth = this.getDragDiffWidth()

      if (diffWidth > 0) {
        this.state.dragX = Math.min(this.state.dragX, 0)
        this.state.dragX = Math.max(this.state.dragX, -diffWidth)
      } else {
        this.state.dragX = 0
      }

      this.updateDrag()
    }

    const dragBehavior = dragD3<SVGSVGElement, DragDatum>().on("drag", handler)

    this.updateDrag()

    svg.call(dragBehavior).on("drag", handler)
  }

  private updateDrag() {
    this.elements.dragArea.attr("transform", `translate(${this.state.dragX},0)`)
  }

  private getDragDiffWidth() {
    const {
      elements: { chart },
      state: { marginLeft, width: currentWidth },
    } = this

    const comparedWidth = currentWidth - marginLeft

    const { width: svgGWidth } = chart.node()!.getClientRects()[0]

    return svgGWidth - comparedWidth
  }
}

export { DragModule }
