import {
  BaseType,
  D3ZoomEvent,
  HierarchyCircularNode,
  Selection,
  Transition,
  easeCircleInOut,
  easeSinInOut,
  hierarchy,
  json,
  pack,
  scaleOrdinal,
  schemeSet3,
  select,
  zoom,
} from "d3"
import anime from "animejs"
import hotkeys from "hotkeys-js"
import qs from "query-string"
import chroma from "chroma-js"

import * as styles from "./population-circles.module.css"

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

type MunicipalityWithAnimation = Municipality & {
  hoverAnimation?: anime.AnimeInstance | null
}

type MunicipalityNode = HierarchyCircularNode<MunicipalityWithAnimation>
type MunicipalityTransition = Transition<
  BaseType,
  MunicipalityNode,
  BaseType,
  MunicipalityNode
>

type PopulationType = keyof Municipality["values"]

type State = {
  lastPosition: { k: number; x: number; y: number }
  populationRange: [number, number]
  populationType: PopulationType
  timeRangeIndex: number
}

const fetchData = () =>
  (json(
    `${ROOT_PATH}data/d3js/population-circles/data.json`
  ) as unknown) as Promise<Municipality[]>

const dropShadowBaseId = "dropShadowBase"

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 70,
}
const height = 400

const formatPopulation = (populationNum: number) =>
  Number(populationNum.toFixed(0)).toLocaleString(undefined, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

const typeNouns: Record<string, string> = {
  females: "females",
  males: "males",
  total: "people",
}

const getYearStr = (dateStr: string) => new Date(dateStr).getFullYear()

type RenderChart = (o: {
  municipalities: Municipality[]
  onClick: (m: Municipality) => void
  rootElId: string
}) => {
  onPopulationPercentilesChange: (vals: [number, number]) => void
  onTimeSeriesChange: (val: number) => void
  onTypeChange: (type: string) => void
}

const renderChart: RenderChart = ({ municipalities, onClick, rootElId }) => {
  const chartEl = document.getElementById(rootElId) as HTMLElement
  const { width } = chartEl.getBoundingClientRect()

  const state: State = {
    lastPosition: { k: 1, x: 0, y: 0 },
    populationRange: [0, 1],
    populationType: "total",
    timeRangeIndex: 0,
  }

  // this zoom function is not working well in all directions
  const zoomed = function (
    this: SVGSVGElement,
    zoomEvent: D3ZoomEvent<SVGSVGElement, unknown>
  ) {
    const transition = select(this).transition().duration(150)
    const { lastPosition } = state
    let {
      transform: { x, y },
    } = zoomEvent
    const {
      transform: { k },
    } = zoomEvent

    if (k !== state.lastPosition.k) {
      x = lastPosition.x
      y = lastPosition.y
    }

    transition.attr("transform", `translate(${x}, ${y}) scale(${k})`)

    lastPosition.k = k
    lastPosition.x = x
    lastPosition.y = y
  }

  const color = scaleOrdinal<string, string>()
    .domain(municipalities.map((municipality) => municipality.name))
    .range(schemeSet3)

  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .extent([
      [0, 0],
      [width / 2, height / 2],
    ])
    .on("end", zoomed)

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("viewBox", [0, 0, width, height + margin.top].join(", "))
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .call(zoomBehavior)

  addDropShadow(svg, dropShadowBaseId, 0.5, 2)

  const header = svg
    .append("text")
    .attr("class", styles.header)
    .text("")
    .attr("transform", `translate(${width / 2}, 50)`)

  const svgContent = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const transitionChart = () => {
    const itemsWithCount = municipalities.filter((municipality) => {
      const {
        values: {
          [state.populationType]: { [state.timeRangeIndex]: dataItem },
        },
      } = municipality

      return !!(dataItem as unknown)
    })
    const dataValues = itemsWithCount.map((municipality) => {
      const {
        values: {
          [state.populationType]: { [state.timeRangeIndex]: dataItem },
        },
      } = municipality

      return dataItem.count
    })
    const valueToIdx = dataValues.reduce((acc, val, idx) => {
      acc[val] = acc[val] ?? []
      acc[val]!.push(idx)

      return acc
    }, {} as { [k: string]: number[] | undefined })
    const sortedDataValues = dataValues.sort((a, b) => a - b)

    const percentiles = sortedDataValues.reduce((acc, val, idx) => {
      const percentile = idx / sortedDataValues.length
      const { [val]: unsortedIndexes } = valueToIdx

      unsortedIndexes!.forEach((idx2) => {
        acc[idx2] = percentile
      })

      return acc
    }, [] as number[])

    const filteredData = itemsWithCount.filter((_municipality, idx) => {
      const { [idx]: percentile } = percentiles

      return (
        typeof percentile === "number" &&
        percentile >= state.populationRange[0] &&
        percentile <= state.populationRange[1]
      )
    })

    const structure = hierarchy({
      children: filteredData,
      name: "",
      values: {
        females: [],
        males: [],
        total: [],
      } as Municipality["values"],
    }).sum((municipality) => {
      if (!(municipality.values as unknown)) {
        return 1
      }

      const {
        values: {
          [state.populationType]: { [state.timeRangeIndex]: dataItem },
        },
      } = municipality

      return !(dataItem as unknown) ? 0 : dataItem.count
    })
    const root = pack<MunicipalityWithAnimation>()
      .size(
        state.populationType === "total"
          ? [width, height]
          : [width / 2, height / 2]
      )
      .padding(3)(structure)

    const leaves = root.leaves()

    const {
      data: {
        values: {
          [state.populationType]: {
            [state.timeRangeIndex]: { date },
          },
        },
      },
    } = leaves[0]

    const year = getYearStr(date)
    const populationTotal = filteredData.reduce(
      (acc, item) =>
        acc +
        item.values[state.populationType as PopulationType][
          state.timeRangeIndex
        ].count,
      0
    )
    const populationText = `${formatPopulation(populationTotal)} ${
      typeNouns[state.populationType]
    }`

    const { length: totalNum } = leaves.filter(
      (leafItem) =>
        leafItem.data.values[state.populationType].length >=
        state.timeRangeIndex + 1
    )

    header.text(
      `Population in Malaga: ${year} - ${populationText}${
        state.populationRange[0] === 0 && state.populationRange[1] === 1
          ? ""
          : ` - From ${(state.populationRange[0] * 100).toFixed(
              0
            )} percentile to ${(state.populationRange[1] * 100).toFixed(
              0
            )} percentile`
      } - ${totalNum} municipalities`
    )

    const getDataKey = (municipalityNode: unknown) =>
      (municipalityNode as MunicipalityNode).data.name!

    const leaf = svgContent.selectAll(".leaf").data(leaves, getDataKey)

    leaf.exit().remove()

    const getTitle = (municipalityNode: MunicipalityNode) => {
      const {
        data: {
          values: {
            [state.populationType]: { [state.timeRangeIndex]: dataItem },
          },
        },
      } = municipalityNode

      if (!dataItem as unknown) {
        return ""
      }

      const { [state.populationType]: itemsName } = typeNouns

      return `${municipalityNode.data.name} - ${formatPopulation(
        dataItem.count
      )} ${itemsName} - ${getYearStr(dataItem.date)}`
    }

    leaf
      .attr("title", getTitle)
      .transition()
      .duration(1000)
      .ease(easeCircleInOut)
      .attr("transform", (municipalityNode) => {
        if (state.populationType !== "total") {
          return `translate(${municipalityNode.x + width / 4},${
            municipalityNode.y + height / 4
          })`
        }

        return `translate(${municipalityNode.x + 1},${municipalityNode.y + 1})`
      })

    const enter = leaf
      .enter()
      .append("g")
      .attr("class", "leaf")
      .attr("title", getTitle)
      .attr(
        "transform",
        (municipalityNode) =>
          `translate(${municipalityNode.x + 1},${municipalityNode.y + 1})`
      )
      .on("mouseenter", function (_event, municipalityNode) {
        const selection = select(this).select(`.${styles.circle}`)

        select(this)
          .select(".letter")
          .attr("filter", `url(#${dropShadowBaseId})`)

        const hoverAnimation = anime({
          complete: () => {
            municipalityNode.data.hoverAnimation = null
          },
          strokeWidth: "5px",
          targets: [selection.node()],
        })

        municipalityNode.data = {
          ...municipalityNode.data,
          hoverAnimation,
        }
      })
      .on("mouseleave", function (_event, municipalityNode) {
        const selection = select(this).select(`.${styles.circle}`)

        select(this).select(".letter").attr("filter", null)

        const {
          data: { hoverAnimation },
        } = municipalityNode

        if (hoverAnimation) {
          hoverAnimation.seek(0)
          anime.remove(selection.node())
          municipalityNode.data = {
            ...municipalityNode.data,
            hoverAnimation: null,
          }
        }

        anime({
          strokeWidth: "0px",
          targets: [selection.node()],
        })
      })
      .on("click", (_event, municipalityNode) => {
        onClick(municipalityNode.data)
      })

    const generateColor = (municipalityNode: MunicipalityNode) =>
      color(municipalityNode.data.name)

    const generateDarkerColor = (municipalityNode: MunicipalityNode) => {
      const baseColor = generateColor(municipalityNode)

      return chroma(baseColor).darken(1.5).hex()
    }

    const setupLetter = (
      letter:
        | MunicipalityTransition
        | Selection<SVGTextElement, MunicipalityNode, SVGGElement, unknown>
    ) => {
      const el = letter.text(
        (municipalityNode) => municipalityNode.data.name[0]!
      ) as MunicipalityTransition

      el.style(
        "font-size",
        (municipalityNode) => `${municipalityNode.r.toFixed(0)}px`
      )
        .attr("dy", (municipalityNode) => municipalityNode.r / 3)
        .attr("fill", generateDarkerColor)
    }

    const setupCircle = (
      circle:
        | MunicipalityTransition
        | Selection<SVGCircleElement, MunicipalityNode, SVGGElement, unknown>
    ) => {
      const elem = circle.attr(
        "r",
        (municipalityNode) => municipalityNode.r!
      ) as MunicipalityTransition

      elem.attr("fill", generateColor).attr("stroke", generateDarkerColor)
    }

    setupCircle(enter.append("circle").attr("class", styles.circle))

    setupLetter(enter.append("text").attr("class", "letter"))

    const forwardData = (municipalityNode: MunicipalityNode) => municipalityNode

    const circles = leaf
      .selectAll(`.${styles.circle}`)
      .data(forwardData, getDataKey)
    const texts = leaf.selectAll(".letter").data(forwardData, getDataKey)

    setupCircle(circles.transition().duration(1000).ease(easeSinInOut))

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
      state.timeRangeIndex = newIndex
      transitionChart()
    },
    onTypeChange: (newType: string) => {
      state.populationType = newType as PopulationType
      transitionChart()
    },
  }
}

const addDropShadow = (
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
  name: string,
  slope: number,
  deviation: number
) => {
  svg.append("filter").html(`
<filter id="${name}" height="130%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="${deviation}"/>
  <feOffset dx="2" dy="2" result="offsetblur"/>
  <feComponentTransfer>
    <feFuncA type="linear" slope="${slope}"/>
  </feComponentTransfer>
  <feMerge>
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
`)
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
    onClick: (municipality) => {
      if (!hotkeys.isPressed("control")) {
        return
      }

      window.open(
        `https://www.google.com/search?${qs.stringify({
          q: `Malaga ${municipality.name}`,
        })}`
      )
    },
    rootElId: "chart",
  })

  select("form").on("change", (e) => {
    onTypeChange(e.target.value)
  })

  $(".population-slider").slider({
    change: (_event, { values }) => {
      const newValues = (values as [number, number]).map((v) => v / 100) as [
        number,
        number
      ]

      onPopulationPercentilesChange(newValues)
    },
    range: true,
    values: [0, 100],
  })

  const max = municipalities[0].values.total.length - 1

  $(".time-slider").slider({
    change: (_event, { value }) => {
      onTimeSeriesChange(value as number)
    },
    max,
    min: 0,
    value: 0,
  })
}

export default main
