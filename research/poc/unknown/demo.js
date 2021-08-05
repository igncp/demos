/* eslint-disable no-unused-vars */
/* global d3, anime, topojson, chroma, Qs, hotkeys, uuid */
/* eslint-enable no-unused-vars */

const width = 800
const height = 800

const innerRadius = Math.min(width, height) * 0.5 - 20
const outerRadius = innerRadius + 20

const formatValue = (x) => `${x}`

const setupSelect = (vals, id, onChange) => {
  const selectEl = document.getElementById(id)

  ;["All"].concat(vals).forEach((val) => {
    const option = document.createElement("option")

    option.setAttribute("value", val)
    option.innerText = val

    selectEl.appendChild(option)
  })

  selectEl.addEventListener("change", (e) => {
    onChange(e.target.value)
  })
}

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
    selectedCountry: "All",
    selectedRegion: "All",
    timeIndex: 0,
  }

  setupSelect(countries, "countries-select", (newSelected) => {
    state.selectedCountry = newSelected
    renderItems()
  })
  setupSelect(regions, "regions-select", (newSelected) => {
    state.selectedRegion = newSelected
    renderItems()
  })

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
  const ribbonCommon = (r) =>
    r.radius(innerRadius - 0.5).padAngle(1 / innerRadius)

  const ribbonArrow = ribbonCommon(d3.ribbonArrow())
  const ribbon = ribbonCommon(d3.ribbon())

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
    .style("margin-top", "20px")
    .attr(
      "viewBox",
      [-width / 2, -height / 2 - 100, width, height + 100 * 2].join(", ")
    )
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
    const usedRibbon =
      state.selectedCountry !== "All" && state.selectedRegion !== "All"
        ? ribbon
        : ribbonArrow

    const matrix = names.map((maybeCountry) => {
      if (!parsedData[maybeCountry]) {
        return names.map(() => 0)
      }

      if (!["All", maybeCountry].includes(state.selectedCountry)) {
        return names.map(() => 0)
      }

      return names.map((maybeRegion) => {
        const {
          [maybeCountry]: { [maybeRegion]: dataItem },
        } = parsedData

        if (!dataItem) {
          return 0
        }

        if (!["All", maybeRegion].includes(state.selectedRegion)) {
          return 0
        }

        return dataItem[state.timeIndex].Valor
      })
    })

    const chords = chord(matrix)

    const initialRibbonsData = ribbonContainer
      .selectAll(".ribbon")
      .data()
      .reduce((acc, ribbonNode) => {
        acc[
          `${ribbonNode.source.index}_${ribbonNode.target.index}`
        ] = ribbonNode

        return acc
      }, {})

    const fillRibbon = (d) =>
      color(
        names[state.selectedRegion === "All" ? d.target.index : d.source.index]
      )

    const ribbons = ribbonContainer
      .selectAll(".ribbon")
      .data(chords, (d) => `${d.source.index}_${d.target.index}`)
      .join(
        (enter) => {
          const el = enter
            .append("path")
            .attr("class", "ribbon")
            .attr("fill", fillRibbon)
            .style("mix-blend-mode", "multiply")
            .transition()
            .duration(1000)
            .attrTween("d", (finalRibbon) => {
              const initialRibbon = {
                source: {
                  endAngle: 0,
                  startAngle: 0,
                },
                target: {
                  endAngle: 0,
                  startAngle: 0,
                },
              }
              const interpolateSource = d3.interpolate(
                initialRibbon.source,
                finalRibbon.source
              )
              const interpolateTarget = d3.interpolate(
                initialRibbon.target,
                finalRibbon.target
              )

              return (t) => {
                const interpolated = {
                  source: interpolateSource(t),
                  target: interpolateTarget(t),
                }

                return usedRibbon(interpolated)
              }
            })

          return el
        },
        (update) => {
          update
            .transition()
            .duration(1000)
            .attr("fill", fillRibbon)
            .attrTween("d", (finalRibbon) => {
              const {
                [`${finalRibbon.source.index}_${finalRibbon.target.index}`]: initialRibbon,
              } = initialRibbonsData

              if (!initialRibbon) {
                return () => usedRibbon(finalRibbon)
              }

              const interpolateSource = d3.interpolate(
                initialRibbon.source,
                finalRibbon.source
              )
              const interpolateTarget = d3.interpolate(
                initialRibbon.target,
                finalRibbon.target
              )

              return (t) => {
                const interpolated = {
                  source: interpolateSource(t),
                  target: interpolateTarget(t),
                }

                return usedRibbon(interpolated)
              }
            })

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

    const getGroupText = (d) => {
      if (d.endAngle - d.startAngle < 0.07) {
        return ""
      }

      return names[d.index]
    }

    const initialGroupData = groupContainer.selectAll(".group").data()

    console.log("initialGroupData", initialGroupData)

    groupContainer
      .selectAll(".group")
      .data(chords.groups, (d) => d.index)
      .join(
        (enter) => {
          const el = enter
            .append("g")
            .style("cursor", "pointer")
            .attr("class", "group")
            .attr("title", (d) => names[d.index])

          el.append("path")
            .attr("class", "group-path")
            .transition()
            .duration(1000)
            .ease(d3.easeCircle)
            .attrTween("d", (finalGroup) => {
              const interpolateFn = d3.interpolate(
                {
                  ...finalGroup,
                  endAngle: 0,
                  startAngle: 0,
                },
                finalGroup
              )

              return (t) => arc(interpolateFn(t))
            })
            .attr("fill", (d) => color(names[d.index]))
            .attr("stroke", "#fff")

          el.append("text")
            .attr("dy", -3)
            .append("textPath")
            .attr("xlink:href", `#${textId}`)
            .attr("class", "group-text")
            .text(getGroupText)
            .attr("fill", "black")
            .transition()
            .duration(1000)
            .ease(d3.easeCircle)
            .attr("startOffset", (d) => d.startAngle * outerRadius)

          el.on("click", (_e, d) => {
            const { [d.index]: name } = names
            const latestRibbons = ribbonContainer.selectAll(".ribbon")

            if (state.lastFocused === name) {
              latestRibbons.attr("opacity", () => 1)
              state.lastFocused = null

              return
            }

            state.lastFocused = name

            if (countries.includes(name)) {
              latestRibbons.attr("opacity", (d2) =>
                d2.source.index === d.index ? 1 : 0
              )

              return
            }

            latestRibbons.attr("opacity", (d2) =>
              d2.target.index === d.index ? 1 : 0
            )
          })

          $(".group").tooltip({
            track: true,
          })

          return el
        },
        (update) => {
          update
            .select(".group-path")
            .transition()
            .duration(1000)
            .attrTween("d", (finalGroup, idx) => {
              const { [idx]: initialGroup } = initialGroupData
              const interpolateFn = d3.interpolate(initialGroup, finalGroup)

              return (t) => arc(interpolateFn(t))
            })

          update
            .select(".group-text")
            .text(getGroupText)
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
