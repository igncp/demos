import {
  D3DragEvent,
  HierarchyRectangularNode,
  Selection,
  arc as arcD3,
  drag as dragD3,
  easeBounce,
  easeLinear,
  hierarchy,
  interpolate,
  partition as partitionD3,
  scaleOrdinal,
  schemePastel2,
  select,
} from "d3"

import { TRANSITION_DURATION } from "./ui-constants"

type Node<NodeData> = NodeData & {
  chidren: Array<Node<NodeData>>
}

type HierarchyRectNode<ChartData> = HierarchyRectangularNode<Node<ChartData>>

enum PartitionType {
  Count = "count",
  Size = "size",
}

const height = 700
const overColor = "#de7c03"
const easeFn = easeBounce

const extractTweenObj = <ChartData>(node: HierarchyRectNode<ChartData>) => ({
  depth: node.depth,
  x0: node.x0,
  x1: node.x1,
  y0: node.y0,
  y1: node.y1,
})

const getInterpolatorFn =
  <ChartData>({
    fn,
    initialData,
  }: {
    fn: (node: HierarchyRectNode<ChartData>) => string | null
    initialData: Array<HierarchyRectNode<ChartData>>
  }) =>
  (...[finalNode, nodeIndex]: [HierarchyRectNode<ChartData>, number]) => {
    const { [nodeIndex]: initialNode } = initialData

    const interpolateFn = interpolate(
      extractTweenObj(initialNode),
      extractTweenObj(finalNode)
    )

    return (t: number) => {
      const transitientState = interpolateFn(t)

      return fn(transitientState as HierarchyRectNode<ChartData>)!
    }
  }

type ChartConfig<ChartData> = {
  getNodeLabel: (node: Node<ChartData>) => string
  getNodeSize: (node: Node<ChartData>) => number | undefined
  getNodeTitle: (options: {
    nodeData: Node<ChartData>
    valueNum?: number
  }) => string
  partitionType: PartitionType
  rootData: Node<ChartData>
  rootElId: string
}

type ChartElements = {
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  svgDrag: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
}

class PartitionChart<ChartData> {
  private readonly config: ChartConfig<ChartData>
  private readonly elements: ChartElements

  private readonly state: {
    descendants: Array<HierarchyRectangularNode<Node<ChartData>>>
    drag: { x: number; y: number }
    partitionType: PartitionType
  }

  public constructor(config: ChartConfig<ChartData>) {
    this.config = config

    const { partitionType, rootElId } = config

    const svg = select(`#${rootElId}`).append("svg").text("")
    const svgDrag = svg.append("g")
    const svgG = svgDrag.append("g")

    this.state = {
      descendants: [],
      drag: { x: 0, y: 0 },
      partitionType,
    }

    this.state.descendants = this.getDataHierarchy()

    this.elements = {
      svg,
      svgDrag,
      svgG,
    }

    this.setupDrag()

    window.addEventListener("resize", this.handleResize)
  }

  public updatePartition(newPartitionType: PartitionType) {
    this.state.partitionType = newPartitionType

    const newDescendants = this.getDataHierarchy()

    this.state.descendants = newDescendants

    this.renderDescendants()
  }

  public render() {
    const { width } = this.getDimensions()
    const {
      elements: { svg, svgG },
    } = this

    svg.attr("width", width).attr("height", height)
    svgG.attr("transform", `translate(${width / 2},${height * 0.52})`)

    this.renderDescendants()
  }

  private getDimensions() {
    const {
      config: { rootElId },
    } = this
    const { width } = (
      document.getElementById(rootElId) as HTMLElement
    ).getBoundingClientRect()
    const chartWidth = Math.max(width, 700)
    const radius = Math.min(chartWidth, height) / 2

    return {
      chartWidth,
      radius,
      width,
    }
  }

  private getDataHierarchy() {
    const {
      config: { getNodeSize, rootData },
      state: { partitionType },
    } = this
    const { radius } = this.getDimensions()
    const dataHierarchySize = hierarchy(rootData).sum(
      (node: Node<ChartData>) => getNodeSize(node) ?? 0
    )
    const dataHierarchyCount = hierarchy(rootData).sum(() => 1)
    const partition = partitionD3<Node<ChartData>>().size([2 * Math.PI, radius])

    const hierarchyResult = partition(
      partitionType === "size" ? dataHierarchySize : dataHierarchyCount
    )

    return hierarchyResult.descendants()
  }

  private setupDrag() {
    const {
      elements: { svg, svgDrag },
    } = this

    const handler = (
      dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      this.state.drag.x += dragEvent.dx
      this.state.drag.y += dragEvent.dy

      svgDrag.attr(
        "transform",
        `translate(${this.state.drag.x},${this.state.drag.y})`
      )
    }

    const dragBehavior = dragD3<SVGSVGElement, unknown>().on("drag", handler)

    svg
      .style("cursor", "move")
      .call(dragBehavior)
      .on("drag", handler)
      .on("wheel", null)
  }

  private renderDescendants() {
    const {
      config: { getNodeLabel, getNodeTitle },
      elements: { svgG },
      state: { descendants: usedDescendants },
    } = this

    const colorScale = scaleOrdinal(schemePastel2)

    const color = (node: HierarchyRectNode<ChartData>) =>
      node.children
        ? colorScale(getNodeLabel(node.data))
        : colorScale(getNodeLabel(node.parent!.data))

    const arc = arcD3<HierarchyRectNode<ChartData>>()
      .startAngle((node) => node.x0)
      .endAngle((node) => node.x1)
      .innerRadius((node) => node.y0)
      .outerRadius((node) => node.y1)
      .padAngle(0.01)

    const textsTransform = (node: HierarchyRectNode<ChartData>) => {
      if (!node.depth) {
        return ""
      }

      const centroid = arc.centroid({
        ...node,
        x0: node.x0 + (node.x0 > Math.PI ? -1 : 1) * 0.05,
      })
      const rotationDeg = (() => {
        const rotation =
          90 + ((node.x0 + (node.x1 - node.x0) / 2) * 180) / Math.PI

        return rotation > 90 && rotation < 270 ? rotation - 180 : rotation
      })()

      return [
        `rotate(${rotationDeg},${centroid[0]},${centroid[1]})`,
        `translate(${centroid[0]},${centroid[1]})`,
      ].join(" ")
    }

    const pathSel = svgG.selectAll<
      SVGPathElement,
      HierarchyRectNode<ChartData>
    >("path")
    const pathInitialData = pathSel.data()
    const path = pathSel.data(usedDescendants)

    path.exit().remove()

    const pathEnter = path
      .enter()
      .append("path")
      .attr("display", (node) => (node.depth ? null : "none"))
      .attr("data-index", (...[, nodeIndex]) => nodeIndex)
      .style("stroke", "#000")
      .style("stroke-width", "0.5px")
      .style("stroke-dasharray", "1,3")
      .style("fill", color)
      .attr("d", arc)

    path
      .transition()
      .duration(TRANSITION_DURATION)
      .ease(easeFn)
      .attrTween(
        "d",
        getInterpolatorFn({ fn: arc, initialData: pathInitialData })
      )

    const initialTextsSel = svgG.selectAll<
      SVGTextElement,
      HierarchyRectNode<ChartData>
    >("text")
    const textsInitialData = initialTextsSel.data()
    const initialTexts = initialTextsSel.data(usedDescendants)

    initialTexts.exit().remove()

    const opacityFn = (node: HierarchyRectangularNode<Node<ChartData>>) => {
      const arcLength = Math.abs(node.x0 - node.x1) * node.y1

      // this number is obtained empirically
      if (arcLength < 25) {
        return 0
      }

      const isAlmostVertical = Math.abs((node.x0 + node.x1) / 2 - Math.PI) < 0.2

      return isAlmostVertical ? 0 : 1
    }

    const textsEnter = initialTexts
      .enter()
      .append("text")
      .style("fill", "#333")
      .style("cursor", "default")
      .style("font", "bold 12px Arial")
      .attr("text-anchor", "middle")
      .text((...[node, nodeIndex]) => {
        if (nodeIndex === 0) {
          return ""
        }

        const label = getNodeLabel(node.data)
        const limit = 9

        return label.length > limit ? `${label.slice(0, limit)}...` : label
      })
      .attr("data-index", (...[, nodeIndex]) => nodeIndex)
      .attr("transform", textsTransform)
      .style("opacity", opacityFn)

    initialTexts
      .transition("movement")
      .duration(TRANSITION_DURATION)
      .ease(easeFn)
      .attrTween(
        "transform",
        getInterpolatorFn({
          fn: textsTransform,
          initialData: textsInitialData,
        })
      )

    svgG
      .selectAll<SVGTextElement, HierarchyRectNode<ChartData>>("text")
      .transition("opacity")
      .duration(TRANSITION_DURATION)
      .ease(easeLinear)
      .style("opacity", opacityFn)

    const updatedGroups = [pathEnter, textsEnter]

    updatedGroups.forEach((set) => {
      set.on("mouseover", function onMouseOver() {
        const nodeIndex = select(this).attr("data-index")

        select(`path[data-index="${nodeIndex}"]`).style("fill", overColor)
        select(`text[data-index="${nodeIndex}"]`).style("fill", "white")
      })

      set.on("mouseout", function onMouseOut() {
        const nodeIndex = select(this).attr("data-index")

        select<SVGPathElement, HierarchyRectNode<ChartData>>(
          `path[data-index="${nodeIndex}"]`
        ).style("fill", color)
        select(`text[data-index="${nodeIndex}"]`).style("fill", "#000")
      })

      set.append("title").text((node) =>
        getNodeTitle({
          nodeData: node.data,
          valueNum: node.value,
        })
      )
    })
  }

  private readonly handleResize = () => {
    this.render()
  }
}

export { PartitionChart, PartitionType, Node, ChartConfig }
