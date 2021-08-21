import {
  HierarchyRectangularNode,
  Selection,
  arc as arcD3,
  easeBounce,
  hierarchy,
  interpolate,
  json,
  partition as partitionD3,
  scaleOrdinal,
  schemePastel2,
  select,
} from "d3"

type DataNode = {
  children: DataNode[]
  name: string
  size?: number
}

type HierarchyRectNode = HierarchyRectangularNode<DataNode>
type PartitionType = "count" | "size"

const fetchData = () =>
  (json(
    `${ROOT_PATH}data/d3js/partition/flare.json`
  ) as unknown) as Promise<DataNode>

const height = 700
const overColor = "#de7c03"
const transitionDuration = 2000
const easeFn = easeBounce

const addTitle = <A extends SVGElement, B extends SVGElement>(
  selector: Selection<A, HierarchyRectNode, B, unknown>
) => {
  selector.append("title").text((node) => `${node.data.name}\n${node.value}`)
}

const getNodeText = (node: HierarchyRectNode) => {
  const dx = Math.abs(node.x0 - node.x1)

  if (dx > 0.07 && node.parent && node.data.name.length < 10) {
    return node.data.name
  }

  return ""
}

type RenderChart = (o: {
  partitionType: PartitionType
  rootData: DataNode
  rootElId: string
}) => {
  updatePartition: (partitionType: PartitionType) => void
}

const getDataHierarchy = (
  rootData: DataNode,
  partitionType: PartitionType,
  radius: number
) => {
  const dataHierarchySize = hierarchy(rootData).sum(
    (d: DataNode) => d.size ?? 0
  )
  const dataHierarchyCount = hierarchy(rootData).sum(() => 1)
  const partition = partitionD3<DataNode>().size([2 * Math.PI, radius])

  const hierarchyResult = partition(
    partitionType === "size" ? dataHierarchySize : dataHierarchyCount
  )

  return hierarchyResult.descendants()
}

const extractTweenObj = (node: HierarchyRectNode) => ({
  depth: node.depth,
  x0: node.x0,
  x1: node.x1,
  y0: node.y0,
  y1: node.y1,
})

const getInterpolatorFn = (
  initialData: HierarchyRectNode[],
  fn: (n: HierarchyRectNode) => string | null
) => (finalNode: HierarchyRectNode, nodeIndex: number) => {
  const { [nodeIndex]: initialNode } = initialData

  const interpolateFn = interpolate(
    extractTweenObj(initialNode),
    extractTweenObj(finalNode)
  )

  return (t: number) => {
    const transitientState = interpolateFn(t)

    return fn(transitientState as HierarchyRectNode)!
  }
}

const addFilter = (
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter")

  filter.attr("id", "drop-shadow")
  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 9)
  filter.append("feOffset").attr("dx", 2).attr("dy", 5)
  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", ".5")
    .attr("type", "linear")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

const renderChart: RenderChart = ({ partitionType, rootData, rootElId }) => {
  const { width } = (document.getElementById(
    "chart"
  ) as HTMLElement).getBoundingClientRect()
  const radius = Math.min(width, height) / 2
  const colorScale = scaleOrdinal(schemePastel2)

  const color = (node: HierarchyRectNode) =>
    node.children
      ? colorScale(node.data.name)
      : colorScale(node.parent!.data.name)

  const svg = select(`#${rootElId}`)
    .append("svg")
    .text("")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height * 0.52})`)

  addFilter(svg)

  const descendants = getDataHierarchy(rootData, partitionType, radius)

  const arc = arcD3<HierarchyRectNode>()
    .startAngle((node) => node.x0)
    .endAngle((node) => node.x1)
    .innerRadius((node) => node.y0)
    .outerRadius((node) => node.y1)

  const textsTransform = (node: HierarchyRectNode) => {
    if (!node.depth) {
      return ""
    }

    const centroid = arc.centroid(node)
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

  const renderDescendants = (
    usedDescendants: Array<HierarchyRectangularNode<DataNode>>
  ) => {
    const pathSel = svg.selectAll<SVGPathElement, HierarchyRectNode>("path")
    const pathInitialData = pathSel.data()
    const path = pathSel.data(usedDescendants)

    path.exit().remove()

    const pathEnter = path
      .enter()
      .append("path")
      .attr("display", (node) => (node.depth ? null : "none"))
      .attr("data-index", (_d, i: number) => i)
      .style("stroke", "#000")
      .style("stroke-width", "0.5px")
      .style("stroke-dasharray", "1,3")
      .style("fill", color)
      .style("filter", (_node, index) =>
        // not adding drop-shadow in all to avoid too much saturation
        index % 3 !== 0 ? "url(#drop-shadow)" : null
      )
      .attr("d", arc)

    path
      .transition()
      .duration(transitionDuration)
      .ease(easeFn)
      .attrTween("d", getInterpolatorFn(pathInitialData, arc))

    const textsSel = svg.selectAll<SVGTextElement, HierarchyRectNode>("text")
    const textsInitialData = textsSel.data()
    const texts = textsSel.data(usedDescendants)

    texts.exit().remove()

    const textsEnter = texts
      .enter()
      .append("text")
      .text(getNodeText)
      .attr("transform", textsTransform)
      .attr("data-index", (_d, index) => index)
      .style("fill", "#333")
      .attr("text-anchor", "middle")
      .style("font", "bold 12px Arial")
      .style("cursor", "default")
      .attr("transform", textsTransform)

    texts
      .transition()
      .duration(transitionDuration)
      .ease(easeFn)
      .attrTween(
        "transform",
        getInterpolatorFn(textsInitialData, textsTransform)
      )

    const updatedGroups = [pathEnter, textsEnter]

    updatedGroups.forEach((set) => {
      set.on("mouseover", function () {
        const index = select(this).attr("data-index")

        select(`path[data-index="${index}"]`).style("fill", overColor)
        select(`text[data-index="${index}"]`).style("fill", "white")
      })

      set.on("mouseout", function () {
        const index = select(this).attr("data-index")

        select<SVGPathElement, HierarchyRectNode>(
          `path[data-index="${index}"]`
        ).style("fill", color)
        select(`text[data-index="${index}"]`).style("fill", "#000")
      })
    })

    addTitle(path)
    addTitle(texts)
  }

  renderDescendants(descendants)

  return {
    updatePartition: (newPartitionType: PartitionType) => {
      const newDescendants = getDataHierarchy(
        rootData,
        newPartitionType,
        radius
      )

      renderDescendants(newDescendants)
    },
  }
}

const main = async () => {
  const rootData = await fetchData()

  const formEl = document.getElementById("type-form") as HTMLFormElement

  const getCurrentSelectedRadio = (): PartitionType => {
    const result = Array.from(
      (formEl.elements as unknown) as HTMLInputElement[]
    ).reduce((acc, el: HTMLInputElement) => {
      if (acc) {
        return acc
      }

      if (el.checked) {
        return el.value
      }

      return ""
    }, "")

    return result as PartitionType
  }

  const partitionType = getCurrentSelectedRadio()

  const { updatePartition } = renderChart({
    partitionType,
    rootData,
    rootElId: "chart",
  })

  formEl.addEventListener("change", () => {
    const newPartitionType = getCurrentSelectedRadio()

    updatePartition(newPartitionType)
  })
}

export default main
