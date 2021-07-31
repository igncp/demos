/* eslint-disable no-unused-vars */
/* global d3, anime, topojson, chroma, qs */
/* eslint-enable no-unused-vars */

const width = 932
const height = width

const renderChart = (data) => {
  const form = d3.select("#chart").append("form").html(`
<p><input type="radio" id="total" value="total" name="type"/><label for="total">Total</label></p>
<p><input type="radio" id="males" value="males" name="type"/><label for="males">Males</label></p>
<p><input type="radio" id="females" value="females" name="type"/><label for="females">Females</label></p>
`)

  const state = {
    prop: "total",
    valueIdx: 0,
  }

  d3.select("#chart").append("div").attr("class", "slider")

  const max = data[0].values.total.length - 1

  $(".slider").slider({
    change: (_a, b) => {
      state.valueIdx = b.value
      transitionChart()
    },
    max,
    min: 0,
    value: state.valueIdx,
  })

  form.on("change", (e) => {
    state.prop = e.target.value
    transitionChart()
  })

  const color = d3.scaleOrdinal(
    data.map((_d, idx) => idx),
    d3.schemeCategory10
  )

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")

  const header = svg
    .append("text")
    .text("")
    .attr("transform", "translate(500, 50)")
    .attr("font-size", "30px")
    .style("text-anchor", "right")

  const transitionChart = () => {
    const structure = d3.hierarchy({ children: data }).sum((d) => {
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
    const root = d3
      .pack()
      .size(state.prop === "total" ? [width, height] : [width / 2, height / 2])
      .padding(3)(structure)

    const leaves = root.leaves()

    const {
      data: {
        values: {
          [state.prop]: {
            [state.valueIdx]: { date },
          },
        },
      },
    } = leaves[0]

    const year = new Date(date).getFullYear()
    const { length: totalNum } = leaves.filter(
      (l) => l.data.values[state.prop].length >= state.valueIdx + 1
    )

    header.text(`Population in Malaga: ${year} - ${totalNum} towns`)

    const leaf = svg.selectAll(".leaf").data(leaves)

    leaf.exit().remove()

    const getTitle = (d) => {
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

      return `${d.data.name} - ${dataItem.count} - ${dataItem.date}`
    }

    leaf
      .transition()
      .duration(1000)
      .ease(d3.easeCircleInOut)
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

    enter
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("class", "circle")
      .attr("fill-opacity", 0.7)
      .attr("fill", (_d, idx) => color(idx))

    const circles = leaf.selectAll(".circle").data((d) => d)

    circles
      .transition()
      .duration(1000)
      .ease(d3.easeSinInOut)
      .attr("r", (d) => d.r)

    $(".leaf").tooltip({
      track: true,
    })
  }

  transitionChart()
}

const main = async () => {
  // @TODO: optimize content to reduce size
  const data = await d3.json("./malaga.json")
  const parsedData = data
    .map((item) => ({
      name: item.Nombre,
      values: item.Data.map((d) => ({
        count: d.Valor,
        date: d.Fecha,
      })),
    }))
    .reduce((acc, item) => {
      const [location, type] = item.name.split(".").map((i) => i.trim())

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

main()
