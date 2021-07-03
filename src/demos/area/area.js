const main = () => {
  d3.csv(`${ROOT_PATH}data/d3js/area/data.csv`, (_error, data) => {
    const margin = {
      bottom: 50,
      left: 70,
      right: 50,
      top: 50,
    }
    const width = $("#chart").innerWidth() - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    const svg = d3utils.svg("#chart", width, height, margin)

    d3utils.middleTitle(
      svg,
      width,
      "Share of top decile [aka top 10%] in national income"
    )
    d3utils.filterBlackOpacity("points", svg, 2, 0.5)

    const xMax = d3.max(data, (d) => d.year)
    const xMin = d3.min(data, (d) => d.year)
    const yMax = d3.max(data, (d) => d.percent / 100)
    const yMin = d3.min(data, (d) => d.percent / 100)

    const xScale = d3.scale.linear().range([0, width]).domain([xMin, xMax])
    const yScale = d3.scale
      .linear()
      .range([0, height])
      .domain([yMax + 0.05, yMin - 0.05])

    const xAxis = d3.svg
      .axis()
      .scale(xScale)
      .tickFormat(d3.format("."))
      .innerTickSize(-height)
    const yAxis = d3.svg
      .axis()
      .scale(yScale)
      .tickFormat(d3.format("%"))
      .innerTickSize(-width)
      .orient("left")

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${String(height)})`)
      .call(xAxis)
      .selectAll("text")
      .attr({ dy: "1.25em" })

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("text")
      .attr({ dx: "-.25em" })

    const area = d3.svg
      .area()
      .interpolate("monotone")
      .x((d) => xScale(d.year))
      .y0(height)
      .y1((d) => yScale(d.percent / 100))

    const line = d3.svg
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.percent / 100))

    svg
      .append("path")
      .datum(data)
      .attr({ class: "line", "clip-path": "url(#clip)", d: line })

    svg.append("clipPath").attr({ id: "clip" }).append("rect").attr({
      height,
      width,
    })

    svg
      .append("path")
      .datum(data)
      .attr({ class: "area", "clip-path": "url(#clip)", d: area })

    const voronoi = d3.geom
      .voronoi()
      .x((point) => xScale(point.year))
      .y((point) => yScale(point.percent / 100))
      .clipExtent([
        [-margin.left, -margin.top],
        [width + margin.right, height + margin.bottom],
      ])

    const mouseover = (d) =>
      d3.select(`.point-${d.index}`).style("display", "block")

    const mouseleave = (d) =>
      d3.select(`.point-${d.index}`).style("display", "none")

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr(
        "transform",
        (d) => `translate(${String(xScale(d.year))},${yScale(d.percent / 100)})`
      )
      .attr("r", "5px")
      .attr("class", (_d, i) => `point point-${i}`)
      .style({ filter: "url(#drop-shadow-points)" })

    const voronoiGroup = svg.append("g").attr("class", "voronoi")

    voronoiGroup
      .selectAll("path")
      .data(voronoi(data))
      .enter()
      .append("path")
      .attr("d", (d, i) => {
        d.index = i

        return `M${d.join("L")}Z`
      })
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .attr("class", "voronoi-area")
      .append("title")
      .text((d) => `Year: ${d.point.year}: ` + `Percent: ${d.point.percent}%`)
  })
}

export default main
