import {
  BaseType,
  Selection,
  arc as arcD3,
  chord,
  csv,
  descending,
  extent,
  format,
  range,
  rgb,
  ribbon,
  scaleLinear,
  select,
} from "d3"

import * as styles from "./chord.module.css"

type CSVDataItem = {
  amount: string
  creditor: string
  debtor: string
  risk: string
}

type Country = {
  id: number
  name: string
}

type Creditor = Country
type Debtor = Country & { risk: string }

type CSVParsedItem = {
  amount: string
  creditor: Creditor
  debtor: Debtor
  risk: string
}

type Debits = Array<Array<CSVParsedItem | null>>
type Credits = Array<Array<CSVParsedItem | null>>

type Data = {
  credits: Credits
  debits: Debits
  fullList: Country[]
}

const fetchData = async () => {
  const list = (await csv(
    `${ROOT_PATH}data/d3js/chord/data.csv`
  )) as CSVDataItem[]

  const fullList: Country[] = []
  const countries: Record<string, Country> = {}
  const debits: Debits = []
  const credits: Credits = []

  let id = 0

  const country = function (countryName: string): Country {
    if (!(countryName in countries)) {
      countries[countryName] = {
        id,
        name: countryName,
      }

      id += 1
    }

    return countries[countryName]
  }

  const parsedList: CSVParsedItem[] = list.map((d) => ({
    ...d,
    creditor: country(d.creditor),
    debtor: {
      ...country(d.debtor),
      risk: d.risk,
    },
  }))

  Array.from({ length: id }).forEach((_, idx) => {
    debits[idx] = []
    credits[idx] = []

    Array.from({ length: id }).forEach((_2, idx2) => {
      debits[idx][idx2] = null
      credits[idx][idx2] = null
    })
  })

  parsedList.forEach((d) => {
    debits[d.creditor.id][d.debtor.id] = d
    credits[d.debtor.id][d.creditor.id] = d
    fullList[d.creditor.id] = d.creditor
    fullList[d.debtor.id] = d.debtor
  })

  return {
    credits,
    debits,
    fullList,
  }
}

const addDropShadowFilter = function <A>(
  charts: Selection<BaseType, A, BaseType, unknown>,
  name: string,
  deviation: number,
  slope: number
) {
  const defs = charts.append("defs")
  const filter = defs.append("filter").attr("id", `drop-shadow-${name}`)

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

const colours = [
  "#39B347",
  "#C92E47",
  "#DB704D",
  "#FFA22C",
  "#5E92AA",
  "#F8EDD3",
]

const margin = {
  bottom: 20,
  top: 50,
}
const height = 500

type RenderChart = (o: { data: Data; rootElId: string }) => void

const renderChart: RenderChart = ({ data, rootElId }) => {
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.chordChart)

  const width = rootEl.getBoundingClientRect().width / 2 - 20

  const r1 = Math.min(width, height) / 2 - 4
  const r0 = r1 - 20
  const formatCurrency = format(",.3r")

  const arc = arcD3().innerRadius(r0).outerRadius(r1)
  const svg = select(`#${rootElId}`)

  const { credits, debits, fullList } = data

  const charts = svg
    .selectAll("div")
    .data([debits, credits])
    .enter()
    .append("div")
    .style("display", "inline-block")
    .style("width", `${width}px`)
    .style("height", `${height + margin.top + margin.bottom}px`)
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
    .attr("transform", `translate(${width / 2},${height / 2 + margin.top})`)

  const leftChart = charts.filter((_d, i) => i === 0)
  const rightChart = charts.filter((_d, i) => i === 1)

  const setLabel = function (
    chart: Selection<BaseType, Debits, BaseType, unknown>,
    label: string
  ) {
    return chart
      .append("text")
      .text(label)
      .attr("transform", `translate(0,${(-1 * height) / 2 - 10})`)
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
  }

  setLabel(leftChart, "Debits")
  setLabel(rightChart, "Credits")

  addDropShadowFilter(charts, "chords", 2, 0.4)
  addDropShadowFilter(charts, "headings", 3, 0.5)

  const colorDomain = scaleLinear()
    .domain(extent([0, fullList.length - 1]) as [number, number])
    .range([0, 1])

  const heatmapColour = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colours.length))
    .range(colours)

  const fill = function (d: number) {
    return heatmapColour(colorDomain(d))
  }

  charts.each(function (dataMatrix, chartIndex) {
    const svgComp = select(this)
    const numberMatrix = dataMatrix.map((row) =>
      row.map((item) => (item ? +item.amount : 0))
    )

    const chordData = chord()
      .sortGroups(descending)
      .sortSubgroups(descending)
      .sortChords(descending)(numberMatrix)

    const ribbonLayout = ribbon().radius(r0)

    svgComp
      .selectAll(`path.${styles.chord}`)
      .data(chordData)
      .enter()
      .append("svg:path")
      .attr("class", styles.chord)
      .style("fill", (d) => fill(d.target.index))
      .style("filter", "url(#drop-shadow-chords)")
      .style("stroke", (d) => {
        const originalColor = fill(d.target.index)
        const newColor = rgb(originalColor).darker()

        return newColor.formatHex()
      })
      .style("stroke-width", 2)
      .attr("d", ribbonLayout as any)
      .append("svg:title")
      .text((d) => {
        const { [d.source.index]: sourceData } = fullList
        const { [d.target.index]: targetData } = fullList

        return `${sourceData.name} owes ${targetData.name} $${formatCurrency(
          d.source.value
        )}B.`
      })

    const g = svgComp
      .selectAll(`g.${styles.group}`)
      .data(chordData.groups)
      .enter()
      .append("svg:g")
      .attr("class", styles.group)

    g.append("svg:path")
      .style("fill", (d) => fill(d.index))
      .attr("id", (d) => `group${d.index}-${chartIndex}`)
      .attr("d", arc as any)
      .style("filter", () => "url(#drop-shadow-headings)")
      .append("svg:title")
      .text(
        (d) =>
          `${fullList[d.index].name} ${
            chartIndex ? "owes" : "is owed"
          } $${formatCurrency(d.value)}B.`
      )

    g.append("svg:text")
      .attr("x", 6)
      .attr("dy", 15)
      .filter((d) => d.value > 150)
      .append("svg:textPath")
      .attr("xlink:href", (d) => `#group${d.index}-${chartIndex}`)
      .text((d) => fullList[d.index].name)
      .attr("class", styles.headingTitle)
  })
}

const main = async () => {
  const data = await fetchData()

  renderChart({
    data,
    rootElId: "chart",
  })
}

export default main
