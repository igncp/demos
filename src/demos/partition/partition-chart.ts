import {
  D3DragEvent,
  HierarchyRectangularNode,
  ScaleOrdinal,
  Selection,
  arc as arcD3,
  drag as dragD3,
  easeExpInOut,
  hierarchy,
  interpolate,
  partition as partitionD3,
  scaleOrdinal,
  schemePastel1,
  schemePastel2,
  select,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"
import { v1 as uuid } from "uuid"

import { TRANSITION_DURATION } from "./ui-constants"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

type Node<NodeData> = NodeData & {
  children?: Array<Node<NodeData>>
}

type HierarchyNode<ChartData> = HierarchyRectangularNode<Node<ChartData>>

const height = 700
const hoverColor = "#de7c03"
const easeFn = easeExpInOut

const extractTweenObj = <ChartData>(node?: HierarchyNode<ChartData>) => ({
  depth: node?.depth ?? 0,
  x0: node?.x0 ?? 0,
  x1: node?.x1 ?? 0,
  y0: node?.y0 ?? 0,
  y1: node?.y1 ?? 0,
})

type ChartConfig<ChartData> = {
  getColorOptions: (opts: {
    depths: number[]
    nodes: Array<Node<ChartData>>
  }) => number[]
  getHierarchySum: (node: Node<ChartData>) => number
  getNodeColorOption: (opts: { depth: number; node: Node<ChartData> }) => number
  getNodeId: (node: Node<ChartData>) => number
  getNodeLabel: (node: Node<ChartData>) => string
  getNodeTitle: (options: {
    nodeData: Node<ChartData>
    valueNum?: number
  }) => string
  rootData: Node<ChartData>
  rootElId: string
}

const getInterpolatorFn =
  <ChartData>({
    fn,
    getNodeId,
    initialData,
    isText,
  }: {
    fn: (node: HierarchyNode<ChartData>) => string | null
    getNodeId: ChartConfig<ChartData>["getNodeId"]
    initialData: Array<HierarchyNode<ChartData> | undefined>
    isText: boolean
  }) =>
  (finalNode: HierarchyNode<ChartData>) => {
    const initialNode = initialData.find(
      (node) => node && getNodeId(node.data) === getNodeId(finalNode.data)
    )

    const finalTween = extractTweenObj(finalNode)
    const initialTween = extractTweenObj(initialNode)

    const initialTweenUpdated = (() => {
      if (finalTween.x0 === finalTween.x1) {
        return finalTween
      }

      if (isText && finalNode.depth === 0) {
        return finalTween
      }

      return {
        ...initialTween,
        y0: finalTween.y0,
        y1: finalTween.y1,
      }
    })()

    const interpolateFn = interpolate(initialTweenUpdated, finalTween)

    return (t: number) => {
      const transitientState = interpolateFn(t)

      return fn(transitientState as HierarchyNode<ChartData>)!
    }
  }

type ChartElements = {
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  svgDrag: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgG: Selection<SVGGElement, unknown, HTMLElement, unknown>
}

class PartitionChart<ChartData> {
  private readonly config: ChartConfig<ChartData>
  private readonly elements: ChartElements
  private readonly colorScale: ScaleOrdinal<number, string>
  private readonly selectors: {
    path: string
    text: string
  }

  private readonly state: {
    descendants: Array<HierarchyNode<ChartData>>
    drag: { x: number; y: number }
    isClearingSelection: boolean
    rootNode: Node<ChartData> | null
  }

  public constructor(config: ChartConfig<ChartData>) {
    this.config = config

    const { rootElId } = config

    const svg = select(`#${rootElId}`).append("svg").text("")
    const svgDrag = svg.append("g")
    const svgG = svgDrag.append("g")

    this.state = {
      descendants: [],
      drag: { x: 0, y: 0 },
      isClearingSelection: false,
      rootNode: null,
    }

    this.selectors = {
      path: `path-${uuid().slice(0, 6)}`,
      text: `text-${uuid().slice(0, 6)}`,
    }

    this.state.descendants = this.getDataHierarchy()

    this.colorScale = scaleOrdinal<number, string>(
      schemePastel1.concat(schemePastel2)
    )

    this.elements = {
      svg,
      svgDrag,
      svgG,
    }

    this.setupDrag()

    window.addEventListener("resize", this.handleResize)
  }

  public update() {
    this.state.descendants = this.getDataHierarchy()

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
      config: { getHierarchySum, rootData },
      state: { rootNode },
    } = this
    const { radius } = this.getDimensions()

    const cloneRecursive = <T>(node: Node<T>): Node<T> => ({
      ...node,
      ...("children" in node && {
        children: node.children!.map(cloneRecursive),
      }),
    })

    const newNode = rootNode
      ? cloneRecursive(rootNode)
      : cloneRecursive(rootData)

    const partition = partitionD3<Node<ChartData>>().size([2 * Math.PI, radius])
    const newHierarchy = hierarchy(newNode).sum(getHierarchySum)
    const hierarchyResult = partition(newHierarchy)

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
      color,
      config: { getColorOptions, getNodeId, getNodeLabel, getNodeTitle },
      elements: { svgG },
      selectors,
      state: { descendants: usedDescendants },
    } = this

    const depths = new Set<number>()

    this.state.descendants.forEach((node) => {
      depths.add(node.depth)
    })

    this.colorScale.domain(
      getColorOptions({
        depths: Array.from(depths),
        nodes: this.state.descendants.map((node) => node.data),
      })
    )

    const arc = arcD3<HierarchyNode<ChartData>>()
      .startAngle((node) => node.x0)
      .endAngle((node) => node.x1)
      .innerRadius((node) => node.y0)
      .outerRadius((node) => node.y1)
      .padAngle(0.01)

    const textsTransform = (node: HierarchyNode<ChartData>) => {
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

    const pathSel = svgG.selectAll<SVGPathElement, HierarchyNode<ChartData>>(
      "path"
    )
    const pathInitialData = pathSel.data()

    const path = pathSel.data(
      usedDescendants,
      (node) => `path-${getNodeId(node.data)}`
    )

    const usedDuration = this.state.isClearingSelection
      ? 0
      : TRANSITION_DURATION

    this.state.isClearingSelection = false

    const getShouldHighlightNode = (node: HierarchyNode<ChartData>) =>
      node.depth !== 0 || this.state.rootNode

    type CommonSelection<ElementType extends SVGElement> = Selection<
      ElementType,
      HierarchyNode<ChartData>,
      SVGGElement,
      unknown
    >

    const cursorFn = <ElementType extends SVGElement>(
      selection: CommonSelection<ElementType>
    ) => {
      selection.style("cursor", (node) =>
        getShouldHighlightNode(node) ? "pointer" : "move"
      )
    }

    const pathCommon = (selection: CommonSelection<SVGPathElement>) => {
      selection
        .attr("data-index", (...[, nodeIndex]) => nodeIndex)
        .style("fill", color)
        .call(cursorFn)
    }

    const pathEnter = path
      .enter()
      .append("path")
      .attr("class", selectors.path)
      .style("stroke", "#000")
      .style("stroke-width", "2px")
      .style("stroke-dasharray", "1,3")
      .attr("d", arc)
      .call(pathCommon)

    path.exit().remove()

    path
      .call(pathCommon)
      .transition()
      .duration(usedDuration)
      .ease(easeFn)
      .attrTween(
        "d",
        getInterpolatorFn({
          fn: arc,
          getNodeId,
          initialData: pathInitialData,
          isText: false,
        })
      )

    const initialTextsSel = svgG.selectAll<
      SVGTextElement,
      HierarchyNode<ChartData>
    >("text")
    const textsInitialData = initialTextsSel.data()

    const initialTexts = initialTextsSel.data(
      usedDescendants,
      (node) => `text-${getNodeId(node.data)}`
    )

    initialTexts.exit().remove()

    const opacityFn = (...[node]: [HierarchyNode<ChartData>, number]) => {
      const arcLength = Math.abs(node.x0 - node.x1) * node.y1

      // this number is obtained empirically
      if (arcLength < 25) {
        return 0
      }

      const isAlmostVertical = Math.abs((node.x0 + node.x1) / 2 - Math.PI) < 0.2

      return isAlmostVertical && node.depth !== 0 ? 0 : 1
    }

    const textCommon = (selection: CommonSelection<SVGTextElement>) => {
      selection
        .text((node: HierarchyNode<ChartData>) => {
          const label = getNodeLabel(node.data)
          const limit = 9

          return label.length > limit ? `${label.slice(0, limit)}...` : label
        })
        .attr("data-index", (...[, nodeIndex]) => nodeIndex)
        .call(cursorFn)
    }

    const textsEnter = initialTexts
      .enter()
      .append("text")
      .attr("class", selectors.text)
      .style("fill", "#333")
      .style("cursor", "default")
      .style("font", "bold 12px Arial")
      .attr("text-anchor", "middle")
      .attr("transform", textsTransform)
      .style("opacity", opacityFn)
      .call(textCommon)

    initialTexts
      .call(textCommon)
      .transition("movement")
      .duration(usedDuration)
      .ease(easeFn)
      .attrTween(
        "transform",
        getInterpolatorFn({
          fn: textsTransform,
          getNodeId,
          initialData: textsInitialData,
          isText: true,
        })
      )

    initialTexts
      .transition("opacity")
      .duration(usedDuration)
      .ease(easeFn)
      .style("opacity", opacityFn)

    const updatedGroups = [pathEnter, textsEnter]

    updatedGroups.forEach((set) => {
      set.on("mouseover", function onMouseOver(...[, node]) {
        const nodeIndex = select(this).attr("data-index")

        if (getShouldHighlightNode(node)) {
          select(`path[data-index="${nodeIndex}"]`).style("fill", hoverColor)
          select(`text[data-index="${nodeIndex}"]`).style("fill", "white")
        }
      })

      set.on("mouseout", function onMouseOut() {
        const nodeIndex = select(this).attr("data-index")

        select<SVGPathElement, HierarchyNode<ChartData>>(
          `path[data-index="${nodeIndex}"]`
        ).style("fill", color)
        select(`text[data-index="${nodeIndex}"]`).style("fill", "#000")
      })

      set.on("click", (...[, node]) => {
        if (
          this.state.rootNode &&
          getNodeId(this.state.rootNode) === getNodeId(node.data)
        ) {
          this.state.rootNode = null
          this.state.isClearingSelection = true
        } else {
          this.state.rootNode = node.data
        }

        this.state.descendants = this.getDataHierarchy()
        this.renderDescendants()
      })

      set.attr("title", (node) =>
        getNodeTitle({
          nodeData: node.data,
          valueNum: node.value,
        })
      )
    })

    $(`.${selectors.path}`).tooltip({
      track: true,
    })

    $(`.${selectors.text}`).tooltip({
      track: true,
    })
  }

  private readonly color = (node: HierarchyNode<ChartData>) => {
    const {
      colorScale,
      config: { getNodeColorOption },
    } = this

    const nodeOption = getNodeColorOption({
      depth: node.depth,
      node: node.data,
    })

    return colorScale(nodeOption)
  }

  private readonly handleResize = () => {
    this.render()
  }
}

export { ChartConfig, Node, PartitionChart }
