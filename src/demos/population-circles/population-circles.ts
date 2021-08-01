import {
  easeCircleInOut,
  easeSinInOut,
  hierarchy,
  json,
  pack,
  scaleOrdinal,
  schemeCategory10,
  select,
} from "d3"
import anime from "animejs"
import hotkeys from "hotkeys-js"
import qs from "query-string"

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 70,
}

const renderChart = (data: any) => {
  const { width } = (document.getElementById(
    "chart"
  ) as any).getBoundingClientRect()
  const height = 400

  const form = select("form")

  const state = {
    populationRange: [0, 100],
    prop: "total",
    valueIdx: 0,
  }

  const max = data[0].values.total.length - 1

  $(".time-slider").slider({
    change: (_a, b) => {
      const s: any = state

      s.valueIdx = b.value
      transitionChart()
    },
    max,
    min: 0,
    value: state.valueIdx,
  })

  $(".population-slider").slider({
    change: (_a, b: any) => {
      state.populationRange = b.values.map((v: any) => v / 100)
      transitionChart()
    },
    range: true,
    values: [state.populationRange[0], state.populationRange[1]],
  })

  form.on("change", (e) => {
    state.prop = e.target.value
    transitionChart()
  })

  const color = scaleOrdinal(
    data.map((_d: any, idx: any) => idx),
    schemeCategory10
  )

  const svg = select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height + margin.top] as any)
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")

  const header = svg
    .append("text")
    .text("")
    .attr("transform", `translate(${width / 2}, 50)`)
    .style("font-size", "20px")
    .style("text-anchor", "right")

  const svgContent = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const transitionChart = () => {
    const itemsWithCount = data.filter((town: any) => {
      const {
        values: {
          [state.prop]: { [state.valueIdx]: dataItem },
        },
      } = town

      return !!dataItem
    })
    const dataValues = itemsWithCount.map((town: any) => {
      const {
        values: {
          [state.prop]: { [state.valueIdx]: dataItem },
        },
      } = town

      return dataItem ? dataItem.count : null
    })
    const valueToIdx = dataValues.reduce((acc: any, val: any, idx: any) => {
      if (val === null) {
        return acc
      }

      acc[val] = acc[val] || []
      acc[val].push(idx)

      return acc
    }, {})
    const sortedDataValues = dataValues.sort((a: any, b: any) => a - b)

    const percentiles = sortedDataValues.reduce(
      (acc: any, val: any, idx: any) => {
        const percentile = idx / sortedDataValues.length
        const { [val]: unsortedIndexes } = valueToIdx

        unsortedIndexes.forEach((idx2: any) => {
          acc[idx2] = percentile
        })

        return acc
      },
      []
    )

    const filteredData = itemsWithCount.filter((_town: any, idx: any) => {
      const { [idx]: percentile } = percentiles

      return (
        typeof percentile === "number" &&
        percentile >= state.populationRange[0] &&
        percentile <= state.populationRange[1]
      )
    })

    const structure = hierarchy({ children: filteredData }).sum((d: any) => {
      if (!d.values) {
        return 1
      }

      const {
        values: {
          [state.prop]: { [state.valueIdx]: dataItem },
        },
      } = d

      return dataItem ? dataItem.count : 0
    })
    const root = pack()
      .size(state.prop === "total" ? [width, height] : [width / 2, height / 2])
      .padding(3)(structure)

    const leaves = root.leaves()

    const getYear = (dateStr: any) => new Date(dateStr).getFullYear()

    const {
      data: {
        values: {
          [state.prop]: {
            [state.valueIdx]: { date },
          },
        },
      },
    } = leaves[0] as any

    const year = getYear(date)

    const { length: totalNum } = leaves.filter(
      (l: any) => l.data.values[state.prop].length >= state.valueIdx + 1
    )

    // @TODO: add percentiles info
    header.text(`Population in Malaga: ${year} - ${totalNum} towns`)

    const leaf = svgContent.selectAll(".leaf").data(leaves)

    leaf.exit().remove()

    const getTitle = (d: any) => {
      const {
        data: {
          values: {
            [state.prop]: { [state.valueIdx]: dataItem },
          },
        },
      } = d

      if (!dataItem) {
        return ""
      }

      return `${d.data.name} - ${dataItem.count} population - ${getYear(
        dataItem.date
      )}`
    }

    leaf
      .transition()
      .duration(1000)
      .ease(easeCircleInOut)
      .attr("transform", (d) => {
        if (state.prop !== "total") {
          return `translate(${d.x + width / 4},${d.y + height / 4})`
        }

        return `translate(${d.x + 1},${d.y + 1})`
      })
      .attr("title", getTitle)

    const enter = leaf
      .enter()
      .append("g")
      .attr("class", "leaf")
      .attr("title", getTitle)
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
      .on("mouseenter", function (_e, d: any) {
        const selection = select(this).select(".circle")

        const anim = anime({
          complete: () => {
            d.anim = null
          },
          strokeWidth: "5px",
          targets: [selection.node()],
        })

        d.anim = anim
      })
      .on("mouseleave", function (_e, d: any) {
        const selection = select(this).select(".circle")

        if (d.anim) {
          d.anim.seek(0)
          d.anim.remove(selection.node())
          d.anim = null
        }

        anime({
          strokeWidth: "0px",
          targets: [selection.node()],
        })
      })
      .on("click", (_e, d: any) => {
        if (!hotkeys.isPressed("control")) {
          return
        }

        window.open(
          `https://www.google.com/search?${qs.stringify({
            q: `Malaga ${d.data.name}`,
          })}`
        )
      })

    enter
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("class", "circle")
      .attr("fill-opacity", 0.7)
      .attr("fill", (_d, idx) => color(idx))
      .attr("stroke-width", "0px")
      .attr("stroke", "green")

    const setupLetter = (l: any) => {
      l.text((d: any) => d.data.name[0])
        .style("font-size", (d: any) => `${d.r.toFixed(0)}px`)
        .attr("dy", (d: any) => d.r / 3)
    }

    setupLetter(enter.append("text").attr("class", "letter"))

    const circles = leaf.selectAll(".circle").data((d) => d)
    const texts = leaf.selectAll(".letter").data((d) => d)

    circles
      .transition()
      .duration(1000)
      .ease(easeSinInOut)
      .attr("r", (d) => d.r)

    setupLetter(texts.transition().duration(1000).ease(easeSinInOut))

    $(".leaf").tooltip({
      track: true,
    })
  }

  transitionChart()
}

const main = async () => {
  hotkeys("control", () => {})

  // @TODO: optimize content to reduce size
  const data: any = await json(
    `${ROOT_PATH}data/d3js/population-circles/data.json`
  )
  const parsedData = data
    .map((item: any) => ({
      name: item.Nombre,
      values: item.Data.map((d: any) => ({
        count: d.Valor,
        date: d.Fecha,
      })),
    }))
    .reduce((acc: any, item: any) => {
      const [location, type] = item.name.split(".").map((i: any) => i.trim())

      if (type === "Total") {
        acc.push({
          name: location,
          values: {
            total: item.values,
          },
        })
      } else {
        const { [acc.length - 1]: last } = acc

        last.values[type === "Hombres" ? "males" : "females"] = item.values
      }

      return acc
    }, [])

  // remove the first one which is the sum of all
  parsedData.shift()

  renderChart(parsedData)
}

export default main
