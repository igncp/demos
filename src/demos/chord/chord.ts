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

type FinancialData = {
  credits: Credits
  debits: Debits
  fullList: Country[]
}

const fetchData = async () => {
  const originalCSVItems = (await csv(
    `${ROOT_PATH}data/d3js/chord/data.csv`
  )) as CSVDataItem[]

  const fullList: Country[] = []
  const countries: Record<string, Country> = {}
  const debits: Debits = []
  const credits: Credits = []

  let id = 0

  const country = (countryName: string): Country => {
    if (!(countryName in countries)) {
      countries[countryName] = {
        id,
        name: countryName,
      }

      id += 1
    }

    return countries[countryName]
  }

  const parsedList: CSVParsedItem[] = originalCSVItems.map(
    (originalCSVItem) => ({
      ...originalCSVItem,
      creditor: country(originalCSVItem.creditor),
      debtor: {
        ...country(originalCSVItem.debtor),
        risk: originalCSVItem.risk,
      },
    })
  )

  Array.from({ length: id }).forEach((...[, sourceIndex]) => {
    debits[sourceIndex] = []
    credits[sourceIndex] = []

    Array.from({ length: id }).forEach((...[, targetIndex]) => {
      debits[sourceIndex][targetIndex] = null
      credits[sourceIndex][targetIndex] = null
    })
  })

  parsedList.forEach((financialItem) => {
    debits[financialItem.creditor.id][financialItem.debtor.id] = financialItem
    credits[financialItem.debtor.id][financialItem.creditor.id] = financialItem
    fullList[financialItem.creditor.id] = financialItem.creditor
    fullList[financialItem.debtor.id] = financialItem.debtor
  })

  return {
    credits,
    debits,
    fullList,
  }
}

const addDropShadowFilter = <SVGData>({
  charts,
  deviation,
  name,
  slope,
}: {
  charts: Selection<BaseType, SVGData, BaseType, unknown>
  deviation: number
  name: string
  slope: number
}) => {
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

type RenderChart = (o: {
  financialData: FinancialData
  rootElId: string
}) => void

const renderChart: RenderChart = ({ financialData, rootElId }) => {
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.chordChart)

  const width = rootEl.getBoundingClientRect().width / 2 - 20

  const r1 = Math.min(width, height) / 2 - 4
  const r0 = r1 - 20
  const formatCurrency = format(",.3r")

  const arc = arcD3().innerRadius(r0).outerRadius(r1)
  const svg = select(`#${rootElId}`)

  const { credits, debits, fullList } = financialData

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

  const leftChart = charts.filter((...[, chartIndex]) => chartIndex === 0)
  const rightChart = charts.filter((...[, chartIndex]) => chartIndex === 1)

  const setLabel = ({
    chart,
    label,
  }: {
    chart: Selection<BaseType, Debits, BaseType, unknown>
    label: string
  }) =>
    chart
      .append("text")
      .text(label)
      .attr("transform", `translate(0,${(-1 * height) / 2 - 10})`)
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")

  setLabel({ chart: leftChart, label: "Debits" })
  setLabel({ chart: rightChart, label: "Credits" })

  addDropShadowFilter({
    charts,
    deviation: 2,
    name: "chords",
    slope: 0.4,
  })
  addDropShadowFilter({
    charts,
    deviation: 3,
    name: "headings",
    slope: 0.5,
  })

  const colorDomain = scaleLinear()
    .domain(extent([0, fullList.length - 1]) as [number, number])
    .range([0, 1])

  const heatmapColour = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colours.length))
    .range(colours)

  const fill = (chordItemIndex: number) =>
    heatmapColour(colorDomain(chordItemIndex))

  charts.each(function (...[dataMatrix, chartIndex]) {
    const svgComp = select(this)
    const numberMatrix = dataMatrix.map((row) =>
      row.map((cell) => (cell ? +cell.amount : 0))
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
      .style("fill", (chordItem) => fill(chordItem.target.index))
      .style("filter", "url(#drop-shadow-chords)")
      .style("stroke", (chordItem) => {
        const originalColor = fill(chordItem.target.index)
        const newColor = rgb(originalColor).darker()

        return newColor.formatHex()
      })
      .style("stroke-width", 2)
      .attr("d", ribbonLayout as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .append("svg:title")
      .text((chordItem) => {
        const {
          [chordItem.source.index]: sourceData,
          [chordItem.target.index]: targetData,
        } = fullList

        return `${sourceData.name} owes ${targetData.name} $${formatCurrency(
          chordItem.source.value
        )}B.`
      })

    const g = svgComp
      .selectAll(`g.${styles.group}`)
      .data(chordData.groups)
      .enter()
      .append("svg:g")
      .attr("class", styles.group)

    g.append("svg:path")
      .style("fill", (chordGroup) => fill(chordGroup.index))
      .attr("id", (chordGroup) => `group${chordGroup.index}-${chartIndex}`)
      .attr("d", arc as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .style("filter", () => "url(#drop-shadow-headings)")
      .append("svg:title")
      .text(
        (chordGroup) =>
          `${fullList[chordGroup.index].name} ${
            chartIndex ? "owes" : "is owed"
          } $${formatCurrency(chordGroup.value)}B.`
      )

    g.append("svg:text")
      .attr("x", 6)
      .attr("dy", 15)
      .filter((chordGroup) => chordGroup.value > 150)
      .append("svg:textPath")
      .attr(
        "xlink:href",
        (chordGroup) => `#group${chordGroup.index}-${chartIndex}`
      )
      .text((chordGroup) => fullList[chordGroup.index].name)
      .attr("class", styles.headingTitle)
  })
}

const main = async () => {
  const financialData = await fetchData()

  renderChart({
    financialData,
    rootElId: "chart",
  })
}

export default main
