import {
  Selection,
  axisBottom,
  axisLeft,
  extent,
  line as lineD3,
  max,
  scaleLinear,
  scaleOrdinal,
  scaleTime,
  schemePastel2,
  select,
  selectAll,
  timeFormat,
  timeParse,
  tsv,
} from "d3"
import { Delaunay } from "d3-delaunay"

import * as styles from "./multiline-voronoi.module.css"

const CONTAINER_ID = "chart"

type InitialDataItem = {
  [monthKey: string]: string
  name: string
}

type CityMetric = {
  cityName: string
  date: Date
  employmentRate: number
}

type City = {
  metrics: CityMetric[]
  name: string
}

const formatStr = "%Y-%m"

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const texts = {
  chartTitle: "US Unemployment Rate",
  tooltipPart1: (cityMetric: CityMetric) => `${cityMetric.cityName.trim()}: `,
  tooltipPart2: (cityMetric: CityMetric) => {
    const date = `${
      monthNames[cityMetric.date.getMonth()]
    } of ${cityMetric.date.getFullYear()}`

    return ` ${(cityMetric.employmentRate * 100).toFixed(2)}% - ${date}`
  },
}

const fetchData = async () => {
  const monthFormat = timeFormat(formatStr)
  const monthParse = timeParse(formatStr)

  const dataItems = (await tsv(
    `${ROOT_PATH}data/d3js/multiline-voronoi/data.tsv`
  )) as unknown as InitialDataItem[]

  const months: Date[] = Object.keys(dataItems[0])
    .map((v) => monthParse(v)!)
    .filter(Number)

  const cities: City[] = dataItems.map((initialCity: InitialDataItem) => {
    const name = initialCity.name
      .replace(/(msa|necta div|met necta|met div)$/i, "")
      .trim()

    return {
      metrics: months.map((date: Date) => {
        const itemKey = monthFormat(date)
        const { [itemKey as keyof InitialDataItem]: itemValue } = initialCity
        const employmentRate: number = Number(itemValue) / 100

        return {
          cityName: name,
          date,
          employmentRate,
        }
      }),
      name,
    }
  })

  return { cities, months }
}

const margin = {
  bottom: 70,
  left: 80,
  right: 70,
  top: 60,
}

type RenderChart = (o: {
  cities: City[]
  months: Date[]
  rootElId: string
}) => {
  setVoronoi: (v: boolean) => void
}

const addFilter = (
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter").attr("id", "drop-shadow")

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 1)

  filter.append("feOffset").attr("dx", 1).attr("dy", 1)
  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", "1")
    .attr("type", "linear")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

const renderChart: RenderChart = ({ cities, months, rootElId }) => {
  const color = scaleOrdinal(schemePastel2)

  const state: {
    clickToggle: boolean
    voronoiGroup: Selection<SVGGElement, unknown, HTMLElement, unknown> | null
  } = {
    clickToggle: false,
    voronoiGroup: null,
  }

  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.multilineVoronoiChart)

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right

  const height = 500 - margin.top - margin.bottom

  const xScale = scaleTime().range([0, width])
  const yScale = scaleLinear().range([height, 0])

  const lineXTransformer = (cityMetric: CityMetric) => xScale(cityMetric.date)
  const lineYTransformer = (cityMetric: CityMetric) =>
    yScale(cityMetric.employmentRate)

  const cityNameToLine: { [cityName: string]: SVGPathElement } = {}

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  xScale.domain(extent<Date>(months) as [Date, Date])
  yScale
    .domain([
      0,
      max(cities, (city: City) =>
        max(city.metrics, (cityMetric: CityMetric) => cityMetric.employmentRate)
      ) as number,
    ])
    .nice()

  svg
    .append("g")
    .attr("class", `${styles.axis} axis--x`)
    .attr("transform", `translate(0,${height})`)
    .call(axisBottom(xScale))

  svg
    .append("g")
    .attr("class", `${styles.axis} axis--y`)
    .call(axisLeft(yScale).ticks(10, "%"))
    .append("text")
    .attr("x", 20)
    .attr("dy", ".32em")
    .style("font-weight", "bold")
    .text(texts.chartTitle)

  const focus = svg
    .append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", styles.focus)

  addFilter(svg)

  const line = lineD3<CityMetric>().x(lineXTransformer).y(lineYTransformer)

  const generateLines = (usedCities: City[]) => {
    svg
      .append("g")
      .attr("class", styles.cities)
      .selectAll("path")
      .data(usedCities)
      .enter()
      .append("path")
      .attr("d", function (city: City) {
        cityNameToLine[city.name] = this

        return line(city.metrics)
      })
      .style("stroke", (...[, cityIndex]) => color(cityIndex.toString()))
      .style("filter", () => "url(#drop-shadow)")

    generateVoronoi(usedCities) // eslint-disable-line @typescript-eslint/no-use-before-define
  }

  const generateVoronoi = (usedCities: City[]) => {
    const mouseover = (...[, cityMetric]: [unknown, CityMetric]) => {
      const { [cityMetric.cityName]: linePath } = cityNameToLine

      select(linePath).classed(styles.cityHover, true)
      ;(linePath.parentNode as SVGGElement).appendChild(linePath)

      focus.attr(
        "transform",
        `translate(${lineXTransformer(cityMetric)},${lineYTransformer(
          cityMetric
        )})`
      )

      focus.select(".text1").text(texts.tooltipPart1(cityMetric))
      focus.select(".text2").text(texts.tooltipPart2(cityMetric))
    }

    const mouseout = (...[, cityMetric]: [unknown, CityMetric]) => {
      const { [cityMetric.cityName]: linePath } = cityNameToLine

      select(linePath).classed(styles.cityHover, false)

      return focus.attr("transform", "translate(-100,-100)")
    }

    const clicked = (...[, cityMetric]: [unknown, CityMetric]) => {
      state.clickToggle = !state.clickToggle

      selectAll(`.${styles.cities}`).remove()
      selectAll(`.${styles.voronoi}`).remove()

      const inputData: City[] = (() => {
        if (state.clickToggle) {
          const city = cities.find(
            (c) => c.name === cityMetric.cityName
          ) as City

          return [city]
        }

        return cities
      })()

      generateLines(inputData)
    }

    focus.append("circle").attr("r", 3.5)
    focus.append("text").attr("class", "text1").attr("y", -30)
    focus.append("text").attr("class", "text2").attr("y", -10)

    const flatCityMetrics = usedCities.reduce((...[acc, city]) => {
      city.metrics.forEach((cityMetric) => {
        acc.push(cityMetric)
      })

      return acc
    }, [] as CityMetric[])

    const voronoi = Delaunay.from(
      flatCityMetrics,
      lineXTransformer,
      lineYTransformer
    ).voronoi([
      -margin.left,
      -margin.top,
      width + margin.right,
      height + margin.bottom,
    ])

    state.voronoiGroup = svg.append("g").attr("class", styles.voronoi)

    state.voronoiGroup
      .selectAll("path")
      .data(flatCityMetrics)
      .enter()
      .append("path")
      .attr("d", (...[, cityIndex]) => voronoi.renderCell(cityIndex))
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", clicked)
  }

  generateLines(cities)

  return {
    setVoronoi: (checked: boolean) => {
      state.voronoiGroup!.classed(styles.voronoiShow, checked)
    },
  }
}

const main = async () => {
  const rootElId = CONTAINER_ID

  const { cities, months } = await fetchData()

  const { setVoronoi } = renderChart({
    cities,
    months,
    rootElId,
  })

  const form = document.getElementById("form") as HTMLElement
  const chart = document.getElementById(rootElId) as HTMLElement

  chart.appendChild(form)

  select("#show-voronoi")
    .property("disabled", false)
    .on("change", (mouseEvent: MouseEvent) => {
      setVoronoi((mouseEvent.target as HTMLInputElement).checked || false)
    })
}

export { CONTAINER_ID }

export default main
