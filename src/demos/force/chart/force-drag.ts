import { D3DragEvent, Selection, drag as dragD3 } from "d3"

type CustomDragEvent = DragEvent & { active: boolean }

type ChartElements<SVGType extends SVGElement, SVGDrag extends SVGElement> = {
  svg: Selection<SVGType, unknown, HTMLElement, unknown>
  svgDrag: Selection<SVGDrag, unknown, HTMLElement, unknown>
}

class BackgroundDrag<SVGType extends SVGElement, SVGDrag extends SVGElement> {
  private readonly elements: ChartElements<SVGType, SVGDrag>

  private readonly state: {
    dragX: number
    dragY: number
  }

  public constructor(elements: ChartElements<SVGType, SVGDrag>) {
    this.elements = elements

    this.state = {
      dragX: 0,
      dragY: 0,
    }
  }

  public setupBackgroundDrag() {
    const {
      elements: { svg, svgDrag },
    } = this

    const handler = (
      dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      this.state.dragX += dragEvent.dx
      this.state.dragY += dragEvent.dy

      svgDrag.attr(
        "transform",
        `translate(${this.state.dragX},${this.state.dragY})`
      )
    }

    const dragBehavior = dragD3<SVGType, unknown>().on("drag", handler)

    svg
      .style("cursor", "move")
      .call(dragBehavior)
      .on("drag", handler)
      .on("wheel", null)
  }
}

type NodeDragOpts<NodeType> = {
  onDrag: (args: { dragEvent: CustomDragEvent; node: NodeType }) => void
  onDragEnded: (args: { dragEvent: CustomDragEvent; node: NodeType }) => void
  onDragStart: (args: { dragEvent: CustomDragEvent; node: NodeType }) => void
}

class NodeDrag<NodeType, El extends SVGElement> {
  private readonly opts: NodeDragOpts<NodeType>

  public constructor(opts: NodeDragOpts<NodeType>) {
    this.opts = opts
  }

  public setupNodes = (
    selection: Selection<El, NodeType, SVGGElement, unknown>
  ) => {
    const dragstarted = (...[dragEvent, node]: [CustomDragEvent, NodeType]) => {
      this.opts.onDragStart({
        dragEvent,
        node,
      })
    }

    const dragged = (...[dragEvent, node]: [CustomDragEvent, NodeType]) => {
      this.opts.onDrag({
        dragEvent,
        node,
      })
    }

    const dragended = (...[dragEvent, node]: [CustomDragEvent, NodeType]) => {
      this.opts.onDragEnded({
        dragEvent,
        node,
      })
    }

    selection.call(
      dragD3<El, NodeType>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
  }
}

export { BackgroundDrag, NodeDrag, CustomDragEvent }
