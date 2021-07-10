const main = () => {
  const rootElId = "chart"
  const height = 500
  const width =
    document.getElementById("chart").getBoundingClientRect().width / 2 - 20
  const margin = {
    bottom: 20,
    top: 50,
  }

  const r1 = Math.min(width, height) / 2 - 4
  const r0 = r1 - 20
  const format = d3.format(",.3r")
  const debits = []
  const credits = []

  const arc = d3.svg.arc().innerRadius(r0).outerRadius(r1)
  const chord = d3.svg.chord().radius(r0)
  const svg = d3.select(`#${rootElId}`)

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

  const setLabel = function (chart, label) {
    return chart
      .append("text")
      .text(label)
      .attr("transform", `translate(0,${(-1 * height) / 2 - 10})`)
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
  }

  setLabel(leftChart, "Debits")
  setLabel(rightChart, "Credits")

  d3.csv(`${ROOT_PATH}data/d3js/chord/data.csv`, (data) => {
    const countries = {}
    const array = []

    let n = 0

    const country = function (d) {
      if (!countries[d]) {
        countries[d] = {
          id: n++,
          name: d,
        }
      }

      return countries[d]
    }

    const value = function () {
      return +this.amount
    }

    data.forEach((d) => {
      d.creditor = country(d.creditor)
      d.debtor = country(d.debtor)
      d.debtor.risk = d.risk
      d.valueOf = value
    })

    for (
      let i = 0, _i = 0;
      0 <= n ? _i < n : _i > n;
      i = 0 <= n ? ++_i : --_i
    ) {
      debits[i] = []
      credits[i] = []

      for (
        let j = 0, _j = 0;
        0 <= n ? _j < n : _j > n;
        j = 0 <= n ? ++_j : --_j
      ) {
        debits[i][j] = 0
        credits[i][j] = 0
      }
    }

    data.forEach((d) => {
      debits[d.creditor.id][d.debtor.id] = d
      credits[d.debtor.id][d.creditor.id] = d
      array[d.creditor.id] = d.creditor
      array[d.debtor.id] = d.debtor
    })

    const layout = d3.layout
      .chord()
      .sortGroups(d3.descending)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending)
      .padding(0.04)

    const addDropShadowFilter = function (id, deviation, slope) {
      const defs = charts.append("defs")
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

    addDropShadowFilter("chords", 2, 0.4)
    addDropShadowFilter("headings", 3, 0.5)

    const colours = [
      "#39B347",
      "#C92E47",
      "#DB704D",
      "#FFA22C",
      "#5E92AA",
      "#F8EDD3",
    ]

    const c = d3.scale
      .linear()
      .domain(d3.extent([0, n - 1]))
      .range([0, 1])

    const heatmapColour = d3.scale
      .linear()
      .domain(d3.range(0, 1, 1.0 / colours.length))
      .range(colours)

    const fill = function (d) {
      return heatmapColour(c(d))
    }

    return charts.each(function (matrix, jj) {
      const svgComp = d3.select(this)

      layout.matrix(matrix)

      svgComp
        .selectAll("path.chord")
        .data(layout.chords)
        .enter()
        .append("svg:path")
        .attr("class", "chord")
        .style("fill", (d) => fill(d.target.index))
        .style("filter", "url(#drop-shadow-chords)")
        .style("stroke", (d) => d3.rgb(fill(d.target.index)).darker())
        .style("stroke-width", 2)
        .attr("d", chord)
        .append("svg:title")
        .text(
          (d) =>
            `${d.source.value.debtor.name} owes ${
              d.source.value.creditor.name
            } $${format(d.source.value)}B.`
        )

      const g = svgComp
        .selectAll("g.group")
        .data(layout.groups)
        .enter()
        .append("svg:g")
        .attr("class", "group")

      g.append("svg:path")
        .style("fill", (d) => fill(d.index))
        .attr("id", (d) => `group${d.index}-${jj}`)
        .attr("d", arc)
        .style("filter", () => "url(#drop-shadow-headings)")
        .append("svg:title")
        .text(
          (d) =>
            `${array[d.index].name} ${jj ? "owes" : "is owed"} $${format(
              d.value
            )}B.`
        )

      g.append("svg:text")
        .attr("x", 6)
        .attr("dy", 15)
        .filter((d) => d.value > 150)
        .append("svg:textPath")
        .attr("xlink:href", (d) => `#group${d.index}-${jj}`)
        .text((d) => array[d.index].name)
        .attr("class", "heading-title")
    })
  })
}

export default main
