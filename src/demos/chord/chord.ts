import * as d3 from "d3"

type CSVDataItem = {
  amount: string
  creditor: string
  debtor: string
  risk: string
}

type Country = {
  name: string
  id: number
}

type Creditor = Country
type Debtor = Country & { risk: string }

type CSVParsedItem = {
  amount: string
  creditor: Creditor
  debtor: Debtor
  risk: string
}

type Debits = (CSVParsedItem | null)[][]
type Credits = (CSVParsedItem | null)[][]

type Data = {
  fullList: Country[]
  debits: Debits
  credits: Credits
}

const fetchData = async () => {
  const list = (await d3.csv(
    `${ROOT_PATH}data/d3js/chord/data.csv`
  )) as CSVDataItem[]

  const fullList: Country[] = []
  const countries: Record<string, Country> = {}
  const debits: Debits = []
  const credits: Credits = []

  let id = 0

  const country = function (countryName: string): Country {
    if (!countries[countryName]) {
      countries[countryName] = {
        id: id++,
        name: countryName,
      }
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
  charts: d3.Selection<d3.BaseType, A, d3.BaseType, unknown>,
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

type RenderChart = (o: { rootElId: string; data: Data }) => void

const renderChart: RenderChart = ({ rootElId, data }) => {
  const width =
    (document.getElementById(rootElId) as HTMLElement).getBoundingClientRect()
      .width /
      2 -
    20

  const r1 = Math.min(width, height) / 2 - 4
  const r0 = r1 - 20
  const formatCurrency = d3.format(",.3r")

  const arc = d3.arc().innerRadius(r0).outerRadius(r1)
  const svg = d3.select(`#${rootElId}`)

  const { debits, credits, fullList } = data

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
    .attr(
      "transform",
      `translate(${width / 2},${String(height / 2 + margin.top)})`
    )

  const leftChart = charts.filter((_d, i) => i === 0)
  const rightChart = charts.filter((_d, i) => i === 1)

  const setLabel = function (
    chart: d3.Selection<d3.BaseType, Debits, d3.BaseType, unknown>,
    label: string
  ) {
    return chart
      .append("text")
      .text(label)
      .attr("transform", `translate(0,${(-1 * height) / 2 - 10})`)
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
  }

  setLabel(leftChart, "Debits")
  setLabel(rightChart, "Credits")

  addDropShadowFilter(charts, "chords", 2, 0.4)
  addDropShadowFilter(charts, "headings", 3, 0.5)

  const colorDomain = d3
    .scaleLinear()
    .domain(d3.extent([0, fullList.length - 1]) as [number, number])
    .range([0, 1])

  const heatmapColour = d3
    .scaleLinear<string>()
    .domain(d3.range(0, 1, 1.0 / colours.length))
    .range(colours)

  const fill = function (d: number) {
    return heatmapColour(colorDomain(d))
  }

  charts.each(function (dataMatrix, chartIndex) {
    const svgComp = d3.select(this)
    const numberMatrix = dataMatrix.map((row) =>
      row.map((item) => (item ? +item.amount : 0))
    )

    const chordData = d3
      .chord()
      .sortGroups(d3.descending)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending)(numberMatrix)

    const ribbonLayout = d3.ribbon().radius(r0)

    svgComp
      .selectAll("path.chord")
      .data(chordData)
      .enter()
      .append("svg:path")
      .attr("class", "chord")
      .style("fill", (d) => fill(d.target.index))
      .style("filter", "url(#drop-shadow-chords)")
      .style("stroke", (d) => {
        const originalColor = fill(d.target.index)
        const newColor = d3.rgb(originalColor).darker()

        return newColor.formatHex()
      })
      .style("stroke-width", 2)
      .attr("d", ribbonLayout as any)
      .append("svg:title")
      .text((d) => {
        const sourceData = fullList[d.source.index]
        const targetData = fullList[d.target.index]

        return `${sourceData.name} owes ${targetData.name} $${formatCurrency(
          d.source.value
        )}B.`
      })

    const g = svgComp
      .selectAll("g.group")
      .data(chordData.groups)
      .enter()
      .append("svg:g")
      .attr("class", "group")

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
      .attr("class", "heading-title")
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
