import d3utils from "@/demos/_utils/d3utils"

const main = () => {
  const createTimeline = function () {
    const margin = {
      bottom: 0,
      left: 20,
      right: 20,
      top: 60,
    }

    const outerWidth = $("#chart").innerWidth()
    const outerHeight = 700
    const width = outerWidth - margin.left - margin.right
    const height = outerHeight - margin.top - margin.bottom
    const bandGap = 25

    let bandY = 0
    let bandNum = 0

    const timeline = {}
    const data = {}
    const components = []

    const bands = {}
    const svg = d3utils.svg("#chart", outerWidth, outerHeight, margin)

    d3utils.middleTitle(svg, outerWidth, "Philosophers through History", -20)
    d3utils.filterBlackOpacity("intervals", svg, 1, 0.2)

    svg
      .append("clipPath")
      .attr("id", "chart-area")
      .append("rect")
      .attr("width", width)
      .attr("height", height)

    svg.on("mouseup", () =>
      d3
        .selectAll(".interval rect")
        .style("filter", "url(#drop-shadow-intervals)")
    )

    const chart = svg
      .append("g")
      .attr("class", "chart")
      .attr("clip-path", "url(#chart-area)")

    const parseDate = function (dateString) {
      const format = d3.time.format("%Y-%m-%d")

      let date = format.parse(dateString)

      if (date !== null) {
        return date
      }

      let year = null

      if (isNaN(dateString)) {
        year = -dateString.replace(/[^0-9]/g, "")
      } else {
        year = +dateString
      }

      if (year < 0 || year > 99) {
        date = new Date(year, 6, 1)
      } else if (year === 0) {
        date = new Date(-1, 6, 1)
      } else {
        date = new Date(year, 6, 1)
        date.setUTCFullYear(`0000${year}`.slice(-4))
      }

      return date
    }

    const toYear = function (date, bcString) {
      bcString = bcString || " BC"

      const year = date.getUTCFullYear()

      if (year > 0) {
        return year.toString()
      }

      if (bcString[0] === "-") {
        return bcString + -year
      }

      return -year + bcString
    }

    timeline.data = function (timelineItems) {
      const today = new Date()

      const tracks = []
      const yearMillis = 31622400000
      const instantOffset = 100 * yearMillis

      data.items = timelineItems

      const compareAscending = function (item1, item2) {
        let result = item1.start - item2.start

        if (result < 0) {
          return -1
        }

        if (result > 0) {
          return 1
        }

        result = item2.end - item1.end

        if (result < 0) {
          return -1
        }

        if (result > 0) {
          return 1
        }

        return 0
      }

      const compareDescending = function (item1, item2) {
        let result = item1.start - item2.start

        if (result < 0) {
          return 1
        }

        if (result > 0) {
          return -1
        }

        result = item2.end - item1.end

        if (result < 0) {
          return 1
        }

        if (result > 0) {
          return -1
        }

        return 0
      }

      const calculateTracks = function (items, sortOrder, timeOrder) {
        sortOrder = sortOrder || "descending"
        timeOrder = timeOrder || "backward"

        const sortBackward = function () {
          return items.forEach((item) => {
            let track = 0

            for (
              let i = 0, _i = 0, _ref = tracks.length;
              0 <= _ref ? _i < _ref : _i > _ref;
              i = 0 <= _ref ? ++_i : --_i
            ) {
              if (item.end < tracks[i]) {
                break
              }

              track++
            }

            item.track = track

            tracks[track] = item.start
          })
        }

        const sortForward = function () {
          return items.forEach((item) => {
            let track = 0

            for (
              let i = 0, _i = 0, _ref = tracks.length;
              0 <= _ref ? _i < _ref : _i > _ref;
              i = 0 <= _ref ? ++_i : --_i
            ) {
              if (item.start > tracks[i]) {
                break
              }

              track++
            }

            item.track = track

            tracks[track] = item.end
          })
        }

        if (sortOrder === "ascending") {
          data.items.sort(compareAscending)
        } else {
          data.items.sort(compareDescending)
        }

        if (timeOrder === "forward") {
          return sortForward()
        }

        return sortBackward()
      }

      data.items.forEach((item) => {
        item.start = parseDate(item.start)

        if (item.end === "") {
          item.end = new Date(item.start.getTime() + instantOffset)
          item.instant = true
        } else {
          item.end = parseDate(item.end)
          item.instant = false
        }

        if (item.end > today) {
          item.end = today
        }
      })
      calculateTracks(data.items, "descending", "backward")
      data.nTracks = tracks.length
      data.minDate = d3.min(data.items, (d) => d.start)
      data.maxDate = d3.max(data.items, (d) => d.end)

      return timeline
    }

    timeline.tooltip = {
      create() {
        d3utils.tooltip(".part.instant, .part.interval", {
          followMouse: true,
          leftOffst: 80,
        })

        return timeline
      },
    }

    timeline.band = function (bandName, sizeFactor) {
      const band = {}

      band.id = `band${bandNum}`
      band.x = 0
      band.y = bandY
      band.w = width
      band.h = height * (sizeFactor || 1)
      band.trackOffset = 0
      band.trackHeight = Math.min(
        (band.h - band.trackOffset) / data.nTracks,
        20
      )
      band.itemHeight = band.trackHeight * 0.7
      band.parts = []
      band.instantWidth = 100
      band.xScale = d3.time
        .scale()
        .domain([data.minDate, data.maxDate])
        .range([0, band.w])

      band.yScale = function (track) {
        return band.trackOffset + track * band.trackHeight
      }

      band.yearsScale =
        data.maxDate.getUTCFullYear() - data.minDate.getUTCFullYear()
      band.g = chart
        .append("g")
        .attr("id", band.id)
        .attr("transform", `translate(0,${band.y})`)
      band.g
        .append("rect")
        .attr("class", "band")
        .attr("width", band.w)
        .attr("height", band.h)

      const items = band.g
        .selectAll("g")
        .data(data.items)
        .enter()
        .append("svg")
        .attr("y", (d) => band.yScale(d.track))
        .attr("height", band.itemHeight)
        .attr("data-title", (d) => {
          if (d.instant) {
            return `${d.label}: ${toYear(d.start)}`
          }

          return `${d.label}: ${toYear(d.start)} - ${toYear(d.end)}`
        })
        .attr("class", (d) => {
          if (d.instant) {
            return "part instant"
          }

          return "part interval"
        })

      const intervals = d3.select(`#band${bandNum}`).selectAll(".interval")

      intervals
        .append("rect")
        .attr("height", "80%")
        .attr("width", "80%")
        .attr("x", "1px")
        .attr("y", ".5px")
        .style("filter", "url(#drop-shadow-intervals)")
      intervals
        .append("text")
        .attr("class", "intervalLabel")
        .attr("x", 3)
        .attr("y", 9.5)

      const instants = d3.select(`#band${bandNum}`).selectAll(".instant")

      instants
        .append("circle")
        .attr("cx", band.itemHeight / 2)
        .attr("cy", band.itemHeight / 2)
        .attr("r", 5)
      instants
        .append("text")
        .attr("class", "instantLabel")
        .attr("x", 15)
        .attr("y", 10)

      band.addActions = function (actions) {
        return actions.forEach((action) => items.on(action[0], action[1]))
      }

      band.redraw = function () {
        items
          .attr("x", (d) => band.xScale(d.start))
          .attr("width", (d) => band.xScale(d.end) - band.xScale(d.start))
          .select("text")
          .text((d) => {
            const scale = band.xScale(d.end) - band.xScale(d.start)
            const maxLetters = scale / 9

            if (d.label.length > maxLetters) {
              return `${d.label.substr(0, maxLetters - 1)}..`
            }

            return d.label
          })

        return band.parts.forEach((part) => part.redraw())
      }

      bands[bandName] = band
      components.push(band)
      bandY += band.h + bandGap
      bandNum += 1

      return timeline
    }

    timeline.labels = function (bandName) {
      const band = bands[bandName]
      const labelWidth = 46
      const labelHeight = 20
      const labelTop = band.y + band.h - 10
      const yText = 15
      const labelDefs = [
        [
          "start",
          "bandMinMaxLabel",
          0,
          4,
          function (min) {
            return toYear(min)
          },
          "Start of the selected interval",
          band.x + 30,
          labelTop,
        ],
        [
          "end",
          "bandMinMaxLabel",
          band.w - labelWidth,
          band.w - 4,
          function (_min, max) {
            return toYear(max)
          },
          "End of the selected interval",
          band.x + band.w - 152,
          labelTop,
        ],
        [
          "middle",
          "bandMidLabel",
          (band.w - labelWidth) / 2,
          band.w / 2,
          function (min, max) {
            return max.getUTCFullYear() - min.getUTCFullYear()
          },
          "Length of the selected interval",
          band.x + band.w / 2 - 75,
          labelTop,
        ],
      ]
      const bandLabels = chart
        .append("g")
        .attr("id", `${bandName}Labels`)
        .attr("transform", `translate(0,${band.y + band.h + 1})`)
        .selectAll(`#${bandName}Labels`)
        .data(labelDefs)
        .enter()
        .append("g")

      bandLabels
        .append("rect")
        .attr("class", "bandLabel")
        .attr("x", (d) => d[2])
        .attr("width", labelWidth)
        .attr("height", labelHeight)
        .style("opacity", 1)

      const labels = bandLabels
        .append("text")
        .attr("class", (d) => d[1])
        .attr("id", (d) => d[0])
        .attr("x", (d) => d[3])
        .attr("y", yText)
        .attr("text-anchor", (d) => d[0])

      labels.redraw = function () {
        const min = band.xScale.domain()[0]
        const max = band.xScale.domain()[1]

        return labels.text((d) => d[4](min, max))
      }

      band.parts.push(labels)
      components.push(labels)

      return timeline
    }

    timeline.xAxis = function (bandName, orientation) {
      const band = bands[bandName]
      const axis = d3.svg
        .axis()
        .scale(band.xScale)
        .orient(orientation || "bottom")
        .tickSize(6, 0)
        .tickFormat((d) => toYear(d))
      const xAxis = chart
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${band.y + band.h})`)

      xAxis.redraw = function () {
        return xAxis.call(axis)
      }

      band.parts.push(xAxis)
      components.push(xAxis)

      return timeline
    }

    timeline.brush = function (bandName, targetNames) {
      const band = bands[bandName]
      const brush = d3.svg.brush().x(band.xScale.range([0, band.w]))

      brush.on("brush", () => {
        const domain = brush.empty() ? band.xScale.domain() : brush.extent()

        d3.selectAll(".interval rect").style("filter", "none")

        targetNames.forEach((d) => {
          bands[d].xScale.domain(domain)

          bands[d].redraw()
        })
      })

      const xBrush = band.g.append("svg").attr("class", "x brush").call(brush)

      xBrush
        .selectAll("rect")
        .attr("y", 1)
        .attr("height", band.h - 1)

      return timeline
    }

    timeline.redraw = function () {
      return components.forEach((component) => component.redraw())
    }

    return timeline
  }

  d3.csv("/data/d3js/timeline/data.csv", (dataset) =>
    createTimeline()
      .data(dataset)
      .band("mainBand", 0.82)
      .band("naviBand", 0.08)
      .xAxis("mainBand")
      .xAxis("naviBand")
      .labels("mainBand")
      .labels("naviBand")
      .brush("naviBand", ["mainBand"])
      .tooltip["create"]()
      .redraw()
  )
}

export default main
