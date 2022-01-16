import {
  Arc,
  ScaleOrdinal,
  Selection,
  arc as arcD3,
  easeExpInOut,
  interpolate,
  scaleOrdinal,
  schemePastel1,
  schemePastel2,
  select,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"
import { v1 as uuid } from "uuid"

import { ATTR_DATA_ID, TRANSITION_DURATION } from "../ui-constants"

import { DragModule } from "./chart-drag"
import {
  HierarchyNode,
  Node,
  PartitionData,
  PartitionDataConfig,
  extractTweenObj,
  getInterpolatorFn,
} from "./partition-data"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

const colorHover = "#de7c03"
const colorDefaultStroke = "#000"
const colorFillSelected = "#f6ddf2"

const easeFn = easeExpInOut
const height = 700

const isTouchDevice = () =>
  "ontouchstart" in window || navigator.maxTouchPoints > 0

// With this correction the text looks more aligned
const getX0CentroidCorrection = (x0: number) =>
  x0 + (x0 > Math.PI ? -1 : 1) * 0.05

const getTextsTransform =
  <ChartData>(arc: Arc<unknown, HierarchyNode<ChartData>>) =>
  (node: HierarchyNode<ChartData>) => {
    if (!node.depth) {
      return ""
    }

    const centroid = arc.centroid({
      ...node,
      x0: getX0CentroidCorrection(node.x0),
    })
    const rotationDeg = (() => {
      if (node.x0 <= Math.PI / 2 && node.x1 >= (Math.PI * 3) / 2) {
        return 0
      }

      const rotation =
        90 + ((node.x0 + (node.x1 - node.x0) / 2) * 180) / Math.PI

      return rotation > 90 && rotation < 270 ? rotation - 180 : rotation
    })()

    return [
      `rotate(${rotationDeg},${centroid[0]},${centroid[1]})`,
      `translate(${centroid[0]},${centroid[1]})`,
    ].join(" ")
  }

const getTextsOpacity = <ChartData>(node: HierarchyNode<ChartData>) => {
  const arcLength = Math.abs(node.x0 - node.x1) * node.y1

  // This number is obtained empirically to check small angles
  if (arcLength < 25) {
    return 0
  }

  if (node.x0 <= Math.PI / 2 && node.x1 >= (Math.PI * 3) / 2) {
    return 1
  }

  const isAlmostVertical = Math.abs((node.x0 + node.x1) / 2 - Math.PI) < 0.2

  return isAlmostVertical && node.depth !== 0 ? 0 : 1
}

const getArc = <ChartData>() =>
  arcD3<HierarchyNode<ChartData>>()
    .startAngle((node) => node.x0)
    .endAngle((node) => node.x1)
    .innerRadius((node) => node.y0)
    .outerRadius((node) => node.y1)
    .padAngle(0.01)

function moveToBottom<SVGType extends SVGElement>(this: SVGType) {
  const selection = select(this)
  const node = selection.node()!

  node.parentNode!.prepend(node)
}

type ChartConfig<ChartData> = Omit<
  PartitionDataConfig<ChartData>,
  "getMaxRadius"
> & {
  getColorOptions: (opts: {
    depths: number[]
    nodes: Array<Node<ChartData>>
  }) => number[]
  getNodeColorOption: (opts: { depth: number; node: Node<ChartData> }) => number
  getNodeLabel: (node: Node<ChartData>) => string
  getNodeTitle: (options: {
    nodeData: Node<ChartData>
    valueNum?: number
  }) => string
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
  private readonly colorScale: ScaleOrdinal<number, string>
  private readonly dataModule: PartitionData<ChartData>
  private readonly selectors: {
    path: string
    text: string
  }

  private readonly state: {
    drag: { x: number; y: number }
    isClearingSelection: boolean
  }

  public constructor(config: ChartConfig<ChartData>) {
    this.config = config

    const { getHierarchySum, getNodeId, rootData } = config

    this.dataModule = new PartitionData({
      getHierarchySum,
      getMaxRadius: () => this.getDimensions().radius,
      getNodeId,
      rootData,
    })

    const { rootElId } = config

    const svg = select(`#${rootElId}`).append("svg")
    const svgDrag = svg.append("g")
    const svgG = svgDrag.append("g")

    new DragModule({
      container: svg,
      dragSurface: svgDrag,
    })

    this.state = {
      drag: { x: 0, y: 0 },
      isClearingSelection: false,
    }

    this.selectors = {
      path: `path-${uuid().slice(0, 6)}`,
      text: `text-${uuid().slice(0, 6)}`,
    }

    this.dataModule.setDescendants()

    this.colorScale = scaleOrdinal<number, string>(
      schemePastel1.concat(schemePastel2)
    )

    this.elements = {
      svg,
      svgDrag,
      svgG,
    }

    window.addEventListener("resize", this.handleResize)
  }

  public update() {
    this.dataModule.setDescendants()

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

  private renderDescendants() {
    const {
      config: { getColorOptions, getNodeId, getNodeLabel, getNodeTitle },
      elements: { svgG },
      selectors,
    } = this
    const usedDescendants = this.dataModule.getDescendants()

    const depths = new Set<number>()

    usedDescendants.forEach((node) => {
      depths.add(node.depth)
    })

    this.colorScale.domain(
      getColorOptions({
        depths: Array.from(depths),
        nodes: usedDescendants.map((node) => node.data),
      })
    )

    const arc = getArc()

    const textsTransform = getTextsTransform(arc)

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
      !isTouchDevice() || node.depth === 0

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
        .attr(ATTR_DATA_ID, (node) => getNodeId(node.data))
        .style("fill", this.fillColor)
        .style("stroke", this.getPathStrokeColor)
        .call(cursorFn)
    }

    const pathEnter = path
      .enter()
      .append("path")
      .attr("class", selectors.path)
      .style("stroke-width", "3px")
      .style("stroke-dasharray", "1,3")
      .attr("d", arc)
      .call(pathCommon)

    const exitPaths = path.exit<HierarchyNode<ChartData>>()

    exitPaths.each(moveToBottom)

    exitPaths
      .transition()
      .duration(usedDuration)
      .ease(easeFn)
      .attrTween("d", (node) => {
        const initialNode = extractTweenObj(node)
        const fn = interpolate(initialNode, {
          ...initialNode,
          x0: 0,
          x1: 0,
        })

        return (t: number) => {
          const tempNode = fn(t) as HierarchyNode<ChartData>

          return arc(tempNode)!
        }
      })
      .remove()

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

    const textCommon = (selection: CommonSelection<SVGTextElement>) => {
      selection
        .text((node: HierarchyNode<ChartData>) => {
          const label = getNodeLabel(node.data)
          const limit = 8

          return label.length > limit ? `${label.slice(0, limit)}...` : label
        })
        .attr(ATTR_DATA_ID, (node) => getNodeId(node.data))
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
      .style("opacity", getTextsOpacity)
      .call(textCommon)

    // The texts need to be moved to the bottom before the paths
    textsEnter.each(moveToBottom)
    pathEnter.each(moveToBottom)

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
      .style("opacity", getTextsOpacity)

    const updatedGroups = [pathEnter, textsEnter]

    updatedGroups.forEach((set) => {
      set.on("mouseover", (...[, node]) => {
        const nodeId = getNodeId(node.data)

        if (getShouldHighlightNode(node)) {
          svgG
            .selectAll<SVGPathElement, HierarchyNode<ChartData>>(
              `path[${ATTR_DATA_ID}="${nodeId}"]`
            )
            .style("fill", colorHover)

          svgG
            .select(`text[${ATTR_DATA_ID}="${nodeId}"]`)
            .style("fill", "white")
        }
      })

      set.on("mouseout", (...[, node]) => {
        const nodeId = getNodeId(node.data)

        svgG
          .selectAll<SVGPathElement, HierarchyNode<ChartData>>(
            `path[${ATTR_DATA_ID}="${nodeId}"]`
          )
          .style("fill", this.fillColor)
        svgG.select(`text[${ATTR_DATA_ID}="${nodeId}"]`).style("fill", "#000")
      })

      set.on("click", (...[, node]) => {
        const focusedPath = this.dataModule.getFocusedPathRef()
        const nodeId = getNodeId(node.data)

        if (!node.parent) {
          this.dataModule.setFocusedPath([])
          this.state.isClearingSelection = true
        } else if (focusedPath.includes(nodeId)) {
          const idIndex = focusedPath.indexOf(nodeId)

          this.dataModule.setFocusedPath(focusedPath.slice(0, idIndex))
        } else {
          this.dataModule.setFocusedPathFromNode(node)
        }

        svgG
          .selectAll<SVGPathElement, HierarchyNode<ChartData>>(
            `path[${ATTR_DATA_ID}="${nodeId}"]`
          )
          .style("fill", this.fillColor)
        svgG.select(`text[${ATTR_DATA_ID}="${nodeId}"]`).style("fill", null)

        this.dataModule.setDescendants()
        this.renderDescendants()
      })

      set.attr("title", (node) =>
        getNodeTitle({
          nodeData: node.data,
          valueNum: node.value,
        })
      )
    })

    if (!isTouchDevice()) {
      $(`.${selectors.path}`).tooltip({
        track: true,
      })

      $(`.${selectors.text}`).tooltip({
        track: true,
      })
    }
  }

  private readonly getPathStrokeColor = (node: HierarchyNode<ChartData>) => {
    const focusedPath = this.dataModule.getFocusedPathRef()
    const {
      config: { getNodeId },
    } = this

    if (focusedPath.includes(getNodeId(node.data))) {
      return "darkred"
    }

    return colorDefaultStroke
  }

  private readonly fillColor = (node: HierarchyNode<ChartData>) => {
    const focusedPath = this.dataModule.getFocusedPathRef()
    const {
      colorScale,
      config: { getNodeColorOption, getNodeId },
    } = this

    if (focusedPath.includes(getNodeId(node.data))) {
      return colorFillSelected
    }

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

const zTestGetArc = process.env.NODE_ENV === "test" ? getArc : null
const zTestGetTextsTransform =
  process.env.NODE_ENV === "test" ? getTextsTransform : null
const zTestGetX0CentroidCorrection =
  process.env.NODE_ENV === "test" ? getX0CentroidCorrection : null
const zTestGetTextsOpacity =
  process.env.NODE_ENV === "test" ? getTextsOpacity : null

export type { Node }

export {
  ChartConfig,
  PartitionChart,
  zTestGetArc,
  zTestGetTextsOpacity,
  zTestGetTextsTransform,
  zTestGetX0CentroidCorrection,
}
