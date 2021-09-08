import {
  Selection,
  axisLeft,
  extent,
  line as lineD3,
  range,
  scaleLinear,
  scalePoint,
  scaleSqrt,
  select,
  tsv,
} from "d3"
import qs from "query-string"

import * as styles from "./map-distorsions.module.css"

const CONTAINER_ID = "chart"

type ProjectionItem = {
  "Acc. 40º 150%": string
  "Angular": string
  "Areal": string
  "Scale": string
  "name": string
}

const fetchData = () =>
  (tsv(`${ROOT_PATH}data/d3js/map-distorsions/data.tsv`) as unknown) as Promise<
    ProjectionItem[]
  >

const maxNameLength = 20
const getShortName = (name: string) =>
  name.length > maxNameLength ? `${name.slice(0, maxNameLength)}...` : name

const margin = {
  bottom: 20,
  left: 200,
  right: 40,
  top: 90,
}
const height = 750 - margin.top - margin.bottom
const axisYOffset = -9

const colors = ["#7C7CC9", "#429742", "#63BD28", "#D14141"]

const texts = {
  title:
    "Comparison of 41 map projections by four different types of distortion. Lower is better.",
}

type RenderChart = (o: {
  mapsDistorsions: ProjectionItem[]
  rootElId: string
}) => void

enum DimensionName {
  Acc40 = "Acc. 40º 150%",
  Angular = "Angular",
  Areal = "Areal",
  Scale = "Scale",
}

enum DimensionType {
  Number = "number",
  String = "string",
}

const tooltipText = function (projectionItem: ProjectionItem) {
  const dimensionsNames = [
    DimensionName.Acc40,
    DimensionName.Scale,
    DimensionName.Areal,
    DimensionName.Angular,
  ] as Array<keyof ProjectionItem>
  const valuesWithDimension = dimensionsNames.map(
    (dimensionName) =>
      `${Number(projectionItem[dimensionName]).toFixed(2)} (${dimensionName})`
  )

  return `${projectionItem.name}: ${valuesWithDimension.join(", ")}`
}

type Dimension = {
  name: DimensionName | "name"
  scale: any // eslint-disable-line @typescript-eslint/no-explicit-any
  type: DimensionType
}

const filterColor = ({
  deviation,
  id,
  slope,
  svg,
}: {
  deviation: number
  id: string
  slope: number
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
}) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter").attr("id", `drop-shadow-${id}`)

  filter
    .append("feOffset")
    .attr("dx", 0.5)
    .attr("dy", 0.5)
    .attr("in", "SourceGraphic")
    .attr("result", "offOut")

  filter
    .append("feGaussianBlur")
    .attr("in", "offOut")
    .attr("result", "blurOut")
    .attr("stdDeviation", deviation)

  filter
    .append("feBlend")
    .attr("in", "SourceGraphic")
    .attr("in2", "blurOut")
    .attr("mode", "normal")

  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", slope)
    .attr("type", "linear")
}

const colorsScale = <P extends number>(domain: [number, number]) => {
  const c = scaleLinear().domain(domain).range([0, 1])
  const colorScale = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colors.length))
    .range(colors)

  return (color: P) => colorScale(c(color))
}

const renderChart: RenderChart = ({ mapsDistorsions, rootElId }) => {
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.mapDistorsionsChart)

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right

  const dimensions: Dimension[] = [
    {
      name: "name",
      scale: scalePoint().range([0, height]),
      type: DimensionType.String,
    },
    {
      name: DimensionName.Acc40,
      scale: scaleLinear().range([0, height]),
      type: DimensionType.Number,
    },
    {
      name: DimensionName.Scale,
      scale: scaleLinear().range([height, 0]),
      type: DimensionType.Number,
    },
    {
      name: DimensionName.Areal,
      scale: scaleSqrt().range([height, 0]),
      type: DimensionType.Number,
    },
    {
      name: DimensionName.Angular,
      scale: scaleLinear().range([height, 0]),
      type: DimensionType.Number,
    },
  ]

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2},-60)`)
    .text(texts.title)
    .style("font-weight", "bold")

  const x = scalePoint()
    .domain(dimensions.map((dimension) => dimension.name))
    .range([0, width])

  const line = lineD3().defined((lineData) => !isNaN(lineData[1]))

  const dimensionSelection = svg
    .selectAll(".dimension")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", (dimension) => `translate(${x(dimension.name)})`)

  filterColor({ deviation: 2, id: "lines", slope: 0.4, svg })

  const sortedData: ProjectionItem[] = mapsDistorsions
    .slice(0)
    .sort((...[{ name: nameA }, { name: nameB }]) => {
      if (nameA === nameB) {
        return 0
      }

      return nameA < nameB ? -1 : 1
    })

  const colorFn = colorsScale([0, sortedData.length - 1])

  dimensions.forEach((dimItem: Dimension) =>
    dimItem.scale.domain(
      dimItem.type === DimensionType.Number
        ? extent(
            sortedData,
            (projection: ProjectionItem) =>
              +projection[dimItem.name as keyof ProjectionItem]
          )
        : sortedData
            .map((projection: ProjectionItem) => {
              const {
                [dimItem.name as keyof ProjectionItem]: name,
              } = projection

              return getShortName(name)
            })
            .sort()
    )
  )

  const draw = (projectionItem: ProjectionItem) => {
    const allPoints: Array<[number, number]> = dimensions.map((dimItem) => {
      const {
        [dimItem.name as keyof ProjectionItem]: projectionValue,
      } = projectionItem

      return [
        x(dimItem.name) as number,
        dimItem.scale(
          typeof projectionValue === "string"
            ? getShortName(projectionValue)
            : projectionValue
        ),
      ]
    })

    return line(allPoints)
  }

  svg
    .append("g")
    .attr("class", styles.background)
    .selectAll("path")
    .data<ProjectionItem>(sortedData)
    .enter()
    .append("path")
    .attr("d", draw)
    .style("cursor", "pointer")
    .attr("title", tooltipText)
    .on("click", (...[, projectionItem]) => {
      window.open(
        `https://www.google.com/search?${qs.stringify({
          q: `${projectionItem.name} map projection`,
          tbm: "isch", // Google Images
        })}`
      )
    })

  svg
    .append("g")
    .attr("class", styles.foreground)
    .selectAll("path")
    .data(sortedData)
    .enter()
    .append("path")
    .attr("d", draw)
    .attr("data-title", tooltipText)

  dimensionSelection
    .append("g")
    .attr("class", styles.axis)
    .each(function (dimensionItem: Dimension) {
      const yAxis = axisLeft(dimensionItem.scale)

      return select(this).call(yAxis)
    })
    .append("text")
    .attr("class", styles.title)
    .attr("text-anchor", "middle")
    .attr("y", axisYOffset)
    .text((dimensionItem) => dimensionItem.name)

  svg
    .select(`.${styles.axis}`)
    .selectAll<SVGElement, ProjectionItem>(`text:not(.${styles.title})`)
    .attr("class", styles.label)
    .data(sortedData, (projectionItem: ProjectionItem) => projectionItem.name)
    .style("fill", (...[, projectionIndex]: [unknown, number]) =>
      colorFn(projectionIndex)
    )

  const moveToFront = function (this: SVGElement) {
    const parentNode = this.parentNode as HTMLElement

    parentNode.appendChild(this)
  }

  const projection = svg.selectAll<SVGElement, ProjectionItem>(
    `.${styles.axis} text,.${styles.background} path,.${styles.foreground} path`
  )

  const mouseover = (...[, overProjection]: [unknown, ProjectionItem]) => {
    svg.selectAll(`.${styles.foreground} path`).style("filter", "none")
    svg.classed(styles.active, true)
    projection.classed(
      styles.inactive,
      (otherProjection: ProjectionItem) =>
        otherProjection.name !== overProjection.name
    )

    projection
      .filter(
        (otherProjection: ProjectionItem) =>
          otherProjection.name === overProjection.name
      )
      .each(moveToFront)
  }

  const mouseout = () => {
    svg
      .selectAll(`.${styles.foreground} path`)
      .style("filter", "url(#drop-shadow-lines)")
    svg.classed(styles.active, false)
    projection.classed(styles.inactive, false)
  }

  svg
    .selectAll(`.${styles.foreground} path`)
    .style("filter", "url(#drop-shadow-lines)")
    .style("stroke", (...[, projectionItemIndex]) =>
      colorFn(projectionItemIndex)
    )

  projection.on("mouseover", mouseover).on("mouseout", mouseout)

  $(`.${styles.background} path, .${styles.foreground} path`).tooltip({
    track: true,
  })
}

const main = async () => {
  const mapsDistorsions = await fetchData()
  const rootElId = CONTAINER_ID

  renderChart({ mapsDistorsions, rootElId })
}

export { CONTAINER_ID }

export default main
