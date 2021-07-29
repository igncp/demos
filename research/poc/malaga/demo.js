/* eslint-disable no-unused-vars */
/* global d3, anime, topojson, chroma, qs */
/* eslint-enable no-unused-vars */

const width = 932
const height = width

// const data = (await FileAttachment("flare.csv").csv())
// .filter(({ value }) => value !== "")
// .map(({ id, value }) => ({
// name: id.split(".").pop(),
// title: id.replace(/\./g, "/"),
// group: id.split(".")[1],
// value: +value,
// }))

const renderChart = (data) => {
  const form = d3.select("#chart").append("form").html(`
<p><input type="radio" id="total" value="total" name="type"/><label for="total">Total</label></p>
<p><input type="radio" id="males" value="males" name="type"/><label for="males">Males</label></p>
<p><input type="radio" id="females" value="females" name="type"/><label for="females">Females</label></p>
`)

  form.on("change", (e) => {
    transitionChart(e.target.value)
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

  const transitionChart = (prop) => {
    const structure = d3.hierarchy({ children: data }).sum((d) => {
      if (!d.value) {
        return 1
      }

      return d.value[prop]
    })
    const root = d3
      .pack()
      .size(prop === "total" ? [width, height] : [width / 2, height / 2])
      .padding(3)(structure)

    const leaf = svg.selectAll(".leaf").data(root.leaves())

    leaf.exit().remove()

    leaf
      .transition()
      .duration(1000)
      .ease(d3.easeCircleInOut)
      .attr("transform", (d) => {
        if (prop !== "total") {
          return `translate(${d.x + width / 4},${d.y + height / 4})`
        }

        return `translate(${d.x + 1},${d.y + 1})`
      })
      .attr("title", (d) => `${d.data.name} - ${d.data.value[prop]}`)

    const enter = leaf
      .enter()
      .append("g")
      .attr("class", "leaf")
      .attr("title", (d) => `${d.data.name} - ${d.data.value[prop]}`)
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

  transitionChart("total")
}

const main = async () => {
  // @TODO: optimize content to reduce size
  const data = await d3.json("./malaga.json")
  const parsedData = data
    .map((item) => ({
      name: item.Nombre,
      value: item.Data[0].Valor,
    }))
    .reduce((acc, item) => {
      const [location, type] = item.name.split(".").map((i) => i.trim())

      if (type === "Total") {
        acc.push({
          name: location,
          value: {
            total: item.value,
          },
        })
      } else {
        const { [acc.length - 1]: last } = acc

        last.value[type === "Hombres" ? "males" : "females"] = item.value
      }

      return acc
    }, [])

  // remove the first one which is the sum of all
  parsedData.shift()

  renderChart(parsedData)
}

main()
