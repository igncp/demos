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

type PopulationRecord = {
  count: number
  date: string
}

type Municipality = {
  name: string
  values: {
    females: PopulationRecord[]
    males: PopulationRecord[]
    total: PopulationRecord[]
  }
}

const fetchData = () =>
  (json(
    `${ROOT_PATH}data/d3js/population-circles/data.json`
  ) as unknown) as Promise<Municipality[]>

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 70,
}

const formatPopulation = (val: number) =>
  Number(val.toFixed(0)).toLocaleString(undefined, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

type RenderChart = (o: {
  municipalities: Municipality[]
  rootElId: string
}) => {
  onPopulationPercentilesChange: (vals: [number, number]) => void
  onTimeSeriesChange: (val: number) => void
  onTypeChange: (type: string) => void
}

const renderChart: RenderChart = ({ municipalities, rootElId }) => {
  const { width } = (document.getElementById(
    rootElId
  ) as any).getBoundingClientRect()
  const height = 400

  const state = {
    populationRange: [0, 1],
    prop: "total",
    valueIdx: 0,
  }

  const color = scaleOrdinal(
    municipalities.map((_d: any, idx: any) => idx),
    schemeCategory10
  )

  const svg = select(`#${rootElId}`)
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
    const itemsWithCount = municipalities.filter((municipality: any) => {
      const {
        values: {
          [state.prop]: { [state.valueIdx]: dataItem },
        },
      } = municipality

      return !!dataItem
    })
    const dataValues = itemsWithCount.map((municipality: any) => {
      const {
        values: {
          [state.prop]: { [state.valueIdx]: dataItem },
        },
      } = municipality

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

    const filteredData = itemsWithCount.filter(
      (_municipality: any, idx: any) => {
        const { [idx]: percentile } = percentiles

        return (
          typeof percentile === "number" &&
          percentile >= state.populationRange[0] &&
          percentile <= state.populationRange[1]
        )
      }
    )

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

    header.text(
      `Population in Malaga: ${year}${
        state.populationRange[0] === 0 && state.populationRange[1] === 1
          ? ""
          : ` - From ${(state.populationRange[0] * 100).toFixed(
              0
            )} percentile to ${(state.populationRange[1] * 100).toFixed(
              0
            )} percentile`
      } - ${totalNum} municipalities`
    )

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

      const { [state.prop]: itemsName } = {
        females: "females",
        males: "males",
        total: "people",
      } as Record<string, string>

      return `${d.data.name} - ${formatPopulation(
        dataItem.count
      )} ${itemsName} - ${getYear(dataItem.date)}`
    }

    leaf
      .attr("title", getTitle)
      .transition()
      .duration(1000)
      .ease(easeCircleInOut)
      .attr("transform", (d) => {
        if (state.prop !== "total") {
          return `translate(${d.x + width / 4},${d.y + height / 4})`
        }

        return `translate(${d.x + 1},${d.y + 1})`
      })

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

  return {
    onPopulationPercentilesChange: (newValues: [number, number]) => {
      state.populationRange = newValues
      transitionChart()
    },
    onTimeSeriesChange: (newIndex: number) => {
      state.valueIdx = newIndex
      transitionChart()
    },
    onTypeChange: (newType: string) => {
      state.prop = newType
      transitionChart()
    },
  }
}

const main = async () => {
  hotkeys("control", () => {})

  const municipalities = await fetchData()

  const {
    onPopulationPercentilesChange,
    onTimeSeriesChange,
    onTypeChange,
  } = renderChart({
    municipalities,
    rootElId: "chart",
  })

  select("form").on("change", (e) => {
    onTypeChange(e.target.value)
  })

  $(".population-slider").slider({
    change: (_a, b: any) => {
      const newValues = b.values.map((v: any) => v / 100)

      onPopulationPercentilesChange(newValues)
    },
    range: true,
    values: [0, 100],
  })

  const max = municipalities[0].values.total.length - 1

  $(".time-slider").slider({
    change: (_a, b) => {
      onTimeSeriesChange(b.value as number)
    },
    max,
    min: 0,
    value: 0,
  })
}

export default main
