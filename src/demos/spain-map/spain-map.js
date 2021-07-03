const main = () => {
  const widthCanarias = $("#chart").innerWidth() / 3.5
  const widthPeninsula = $("#chart").innerWidth() - widthCanarias - 10
  const height = 500
  const margin = {
    bottom: 20,
    top: 50,
  }
  const strokeWidth = 0.4

  d3.json("/data/d3js/spain-map/data.json", (_error, spain) => {
    const dataRoot = spain.objects.data1
    const data = topojson.feature(spain, dataRoot).features

    _.map(data, (d, i) => {
      d.index = i
    })

    const colorsScheme = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
    const colorScale = d3.scale
      .linear()
      .domain([0, dataRoot.geometries.length])
      .range([0, 1])
    const colorScaleConversion = d3.scale
      .linear()
      .domain(d3.range(0, 1, 1.0 / colorsScheme.length))
      .range(colorsScheme)

    const colorFn = function (d) {
      return colorScaleConversion(colorScale(d.index))
    }

    const addDropShadowFilter = function (id, svg, deviation, slope) {
      const defs = svg.append("defs")
      const filter = defs.append("filter").attr("id", `drop-shadow-${id}`)

      filter.append("feGaussianBlur").attr({
        in: "SourceAlpha",
        stdDeviation: deviation,
      })
      filter.append("feOffset").attr({
        dx: 1,
        dy: 1,
      })
      filter.append("feComponentTransfer").append("feFuncA").attr({
        slope,
        type: "linear",
      })

      const feMerge = filter.append("feMerge")

      feMerge.append("feMergeNode")

      return feMerge.append("feMergeNode").attr("in", "SourceGraphic")
    }

    const svg = d3.select("#chart")

    const generateSvg = function (width) {
      return svg
        .append("div")
        .style("display", "inline-block")
        .style("height", `${height + margin.top + margin.bottom}px`)
        .style("width", `${width}px`)
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("svg:g")
        .attr(
          "transform",
          `translate(${width / 2},${String(height / 2 + margin.top)})`
        )
    }

    const generateProjection = function (center) {
      return d3.geo
        .mercator()
        .center(center)
        .scale(2650)
        .translate([widthPeninsula / 2, height / 2])
    }

    const generatePath = function (projection) {
      return d3.geo.path().projection(projection)
    }

    const mouseover = function () {
      return d3.select(this).style({
        fill: "#FFB61A",
        "stroke-width": "1px",
      })
    }

    const mouseleave = function () {
      return d3.select(this).style({
        fill: colorFn,
        "stroke-width": strokeWidth,
      })
    }

    const generateAreas = function (svgComp, path, filterId) {
      return svgComp
        .selectAll(".area")
        .data(data)
        .enter()
        .append("path")
        .attr({
          d: path,
        })
        .style({
          fill: colorFn,
          stroke: "#FFF",
          "stroke-width": strokeWidth,
        })
        .style("filter", () => `url(#drop-shadow-${filterId})`)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
    }

    const svgLeft = generateSvg(widthCanarias)
    const svgRight = generateSvg(widthPeninsula)

    addDropShadowFilter(1, svgLeft, 2, 0.3)
    addDropShadowFilter(2, svgRight, 2, 0.3)

    const projectionCanarias = generateProjection([-7, 23])
    const projectionPeninsula = generateProjection([6, 35.5])

    const pathCanarias = generatePath(projectionCanarias)
    const pathPeninsula = generatePath(projectionPeninsula)

    generateAreas(svgLeft, pathCanarias, 1)
    generateAreas(svgRight, pathPeninsula, 2)
  })
}

export default main
