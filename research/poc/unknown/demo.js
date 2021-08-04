/* eslint-disable no-unused-vars */
/* global d3, anime, topojson, chroma, Qs, hotkeys, uuid */
/* eslint-enable no-unused-vars */

const width = 800
const height = 800

const innerRadius = Math.min(width, height) * 0.5 - 20
const outerRadius = innerRadius + 20

const formatValue = (x) => `${x}`

const main = async () => {
  const data = await d3.json("./data.json")

  const parsedData = data.reduce((acc, item) => {
    const { Nombre } = item

    const [country, area] = Nombre.split(". ")

    acc[country] = acc[country] || {}
    acc[country][area] = acc[country][area] || {}
    acc[country][area] = item.Data

    return acc
  }, {})

  const countries = Object.keys(parsedData)
  const regions = Object.keys(parsedData[countries[0]])
  const state = {
    lastFocused: null,
    timeIndex: 0,
  }

  $("#slider").slider({
    change: (_e, { value }) => {
      if (value === 3) {
        // @TODO: error in this case
        return
      }

      state.timeIndex = value
      renderItems()
    },
    max: parsedData[countries[0]][regions[0]].length - 1,
    min: 0,
  })

  const names = countries.concat(regions)

  const color = d3.scaleOrdinal(names, d3.schemeCategory10)
  const ribbon = d3
    .ribbonArrow()
    .radius(innerRadius - 0.5)
    .padAngle(1 / innerRadius)

  const zoomed = function (zoomEvent) {
    const transition = d3.select(this).transition().duration(150)

    transition.attr("transform", zoomEvent.transform)
  }

  const zoomBehavior = d3
    .zoom()
    .extent([
      [0, 0],
      [width / 2, height / 2],
    ])
    .on("end", zoomed)

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(zoomBehavior)

  const textId = uuid.v1()

  const chord = d3
    .chordDirected()
    .padAngle(12 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)

  svg
    .append("path")
    .attr("fill", "none")
    .attr("id", textId)
    .attr(
      "d",
      d3.arc()({
        endAngle: 2 * Math.PI,
        outerRadius,
        startAngle: 0,
      })
    )

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

  const ribbonContainer = svg.append("g").attr("fill-opacity", 0.75)
  const groupContainer = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)

  const renderItems = () => {
    const matrix = names.map((maybeCountry) => {
      if (!parsedData[maybeCountry]) {
        return names.map(() => 0)
      }

      return names.map((maybeRegion) => {
        const {
          [maybeCountry]: { [maybeRegion]: dataItem },
        } = parsedData

        if (!dataItem) {
          return 0
        }

        return dataItem[state.timeIndex].Valor
      })
    })

    const chords = chord(matrix)

    const ribbons = ribbonContainer
      .selectAll(".ribbon")
      .data(chords, (d) => `${d.source.index}_${d.target.index}`)
      .join(
        (enter) => {
          const el = enter
            .append("path")
            .attr("class", "ribbon")
            .attr("d", ribbon)
            .attr("fill", (d) => color(names[d.target.index]))
            .style("mix-blend-mode", "multiply")

          return el
        },
        (update) => {
          update.attr("d", ribbon)

          return update
        }
      )

    ribbons
      .append("title")
      .text(
        (d) =>
          `"${names[d.target.index]}" spends into "${
            names[d.source.index]
          }": ${formatValue(d.source.value)}`
      )

    groupContainer
      .selectAll(".group")
      .data(chords.groups, (d) => d.index)
      .join(
        (enter) => {
          const el = enter
            .append("g")
            .style("cursor", "pointer")
            .attr("class", "group")

          el.append("path")
            .attr("class", "group-path")
            .attr("d", arc)
            .attr("fill", (d) => color(names[d.index]))
            .attr("stroke", "#fff")

          el.append("text")
            .attr("dy", -3)
            .append("textPath")
            .attr("xlink:href", `#${textId}`)
            .attr("class", "group-text")
            .attr("startOffset", (d) => d.startAngle * outerRadius)
            .text((d) => {
              if (d.endAngle - d.startAngle < 0.07) {
                return ""
              }

              return names[d.index]
            })
            .attr("fill", "black")

          el.on("click", (_e, d) => {
            const { [d.index]: name } = names

            if (state.lastFocused === name) {
              ribbons.attr("opacity", () => 1)
              state.lastFocused = null

              return
            }

            state.lastFocused = name

            if (countries.includes(name)) {
              ribbons.attr("opacity", (d2) =>
                d2.source.index === d.index ? 1 : 0
              )

              return
            }

            ribbons.attr("opacity", (d2) =>
              d2.target.index === d.index ? 1 : 0
            )
          })

          return el
        },
        (update) => {
          update
            .select(".group-path")
            .transition()
            .duration(1000)
            .attr("d", arc)

          update
            .select(".group-text")
            .transition()
            .duration(1000)
            .attr("startOffset", (d) => d.startAngle * outerRadius)

          return update
        },
        (exit) => exit.remove()
      )
      .attr("class", "group")
      .style("cursor", "pointer")
  }

  renderItems()
}

main()
