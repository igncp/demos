import { D3DragEvent, Selection, drag as dragD3 } from "d3"

type Elements<ContainerEl extends SVGElement, SurfaceEl extends SVGElement> = {
  container: Selection<ContainerEl, unknown, HTMLElement, unknown>
  dragSurface: Selection<SurfaceEl, unknown, HTMLElement, unknown>
}

class DragModule<ContainerEl extends SVGElement, SurfaceEl extends SVGElement> {
  private readonly elements: Elements<ContainerEl, SurfaceEl>

  private readonly state: {
    x: number
    y: number
  }

  public constructor(elements: Elements<ContainerEl, SurfaceEl>) {
    this.state = {
      x: 0,
      y: 0,
    }

    this.elements = elements

    this.setupDrag()
  }

  private setupDrag() {
    const {
      elements: { container, dragSurface },
    } = this

    const handler = (
      dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      this.state.x += dragEvent.dx
      this.state.y += dragEvent.dy

      dragSurface.attr(
        "transform",
        `translate(${this.state.x},${this.state.y})`
      )
    }

    const dragBehavior = dragD3<ContainerEl, unknown>().on("drag", handler)

    container
      .style("cursor", "move")
      .call(dragBehavior)
      .on("drag", handler)
      .on("wheel", null)
  }
}

export { DragModule }
