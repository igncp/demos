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

import * as styles from "./map-distorsions.module.css"

type ProjectionItem = {
  "Acc. 40º 150%": string
  Angular: string
  Areal: string
  Scale: string
  name: string
}

const fetchData = () =>
  (tsv(`${ROOT_PATH}data/d3js/map-distorsions/data.tsv`) as unknown) as Promise<
    ProjectionItem[]
  >

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

type RenderChart = (o: { data: ProjectionItem[]; rootElId: string }) => void

enum DimensionName {
  Acc40 = "Acc. 40º 150%",
  Angular = "Angular",
  Areal = "Areal",
  Scale = "Scale",
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
  scale: any
  type: any
}

const renderChart: RenderChart = ({ data, rootElId }) => {
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.mapDistorsionsChart)

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right

  const dimensions: Dimension[] = [
    {
      name: "name",
      scale: scalePoint().range([0, height]),
      type: String,
    },
    {
      name: DimensionName.Acc40,
      scale: scaleLinear().range([0, height]),
      type: Number,
    },
    {
      name: DimensionName.Scale,
      scale: scaleLinear().range([height, 0]),
      type: Number,
    },
    {
      name: DimensionName.Areal,
      scale: scaleSqrt().range([height, 0]),
      type: Number,
    },
    {
      name: DimensionName.Angular,
      scale: scaleLinear().range([height, 0]),
      type: Number,
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
    .domain(dimensions.map((d) => d.name))
    .range([0, width])

  const line = lineD3().defined((d) => !isNaN(d[1]))

  const dimension = svg
    .selectAll(".dimension")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", (d) => `translate(${x(d.name)})`)

  filterColor("lines", svg, 2, 0.4)

  const sortedData: ProjectionItem[] = data
    .slice(0)
    .sort(({ name: nameA }, { name: nameB }) => {
      if (nameA === nameB) {
        return 0
      }

      return nameA < nameB ? -1 : 1
    })

  const colorFn = colorsScale([0, sortedData.length - 1])

  dimensions.forEach((dimItem: Dimension) =>
    dimItem.scale.domain(
      dimItem.type === Number
        ? extent(
            sortedData,
            (d: ProjectionItem) => +d[dimItem.name as keyof ProjectionItem]
          )
        : sortedData
            .map((d: ProjectionItem) => d[dimItem.name as keyof ProjectionItem])
            .sort()
    )
  )

  const draw = (projectionItem: ProjectionItem) => {
    const allPoints: Array<[number, number]> = dimensions.map((dimItem) => [
      x(dimItem.name) as number,
      dimItem.scale(projectionItem[dimItem.name as keyof ProjectionItem]),
    ])

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
    .attr("title", tooltipText)

  svg
    .append("g")
    .attr("class", styles.foreground)
    .selectAll("path")
    .data(sortedData)
    .enter()
    .append("path")
    .attr("d", draw)
    .attr("data-title", tooltipText)

  dimension
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
    .style("fill", (_d, projectionIndex) => colorFn(projectionIndex))

  const moveToFront = function (this: SVGElement) {
    const el = this.parentNode as HTMLElement

    el.appendChild(this)
  }

  const mouseover = (_e: unknown, overProjection: ProjectionItem) => {
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
    .style("stroke", (_d, projectionItemIndex) => colorFn(projectionItemIndex))

  const projection = svg
    .selectAll<SVGElement, ProjectionItem>(
      `.${styles.axis} text,.${styles.background} path,.${styles.foreground} path`
    )
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)

  $(`.${styles.background} path, .${styles.foreground} path`).tooltip({
    track: true,
  })
}

const colorsScale = <P extends number = any>(domain: [number, number]) => {
  const c = scaleLinear().domain(domain).range([0, 1])
  const colorScale = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colors.length))
    .range(colors)

  return function (p: P) {
    return colorScale(c(p))
  }
}

const filterColor = (
  id: string,
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>,
  deviation: number,
  slope: number
) => {
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

const main = async () => {
  const data = await fetchData()
  const rootElId = "chart"

  renderChart({ data, rootElId })
}

export default main
