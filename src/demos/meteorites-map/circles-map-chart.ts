import anime from "animejs"
import { geoMercator, geoPath, select, zoom } from "d3"
import { v1 as uuidv1 } from "uuid"

import * as styles from "./circles-map-chart.module.css"

type Point = [number, number]
export type Geolocation = { coordinates: Point; type: "Point" }

export type MapLayout = {
  features: Array<{
    geometry: { coordinates: Point[]; type: "Polygon" } // eslint-disable-line id-denylist
    id: string
    properties: { name: string }
    type: "Feature"
  }>
  type: "FeatureCollection"
}

type ChartDataConstraint = {
  geolocation: Geolocation
}

type ChartState = {
  isDuringAnimation: boolean
  selectedCircle: string | null
}

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
}

const svgCutBottom = 250 // to remove the south pole which doesn't have any in the data
const height = 1000 - margin.top - margin.bottom
const modalHiddenTop = 250
const clickedCircleDistortion = 20

// eslint-disable-next-line max-params,@typescript-eslint/no-explicit-any
const zoomed = function (this: SVGSVGElement, zoomEvent: any) {
  select(this).transition().duration(500).attr("transform", zoomEvent.transform)
}

export type ChartConfig<CircleData> = {
  chartHelpHTML: string
  chartTitle: string
  circlesData: CircleData[]
  getCircleId: (circleData: CircleData) => string
  getCircleTitle: (circlesData: CircleData) => string
  getModalHTML: (circleData: CircleData) => string
  mapLayout: MapLayout
  rootElId: string
}

export const renderChart = <CircleData extends ChartDataConstraint>(
  chartConfig: ChartConfig<CircleData>
) => {
  const { circlesData, getCircleId, mapLayout, rootElId } = chartConfig
  const rootEl = document.getElementById(rootElId) as HTMLElement
  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right
  const projectionFn = geoMercator().translate([width / 2, height / 2])
  const geometryPath: any = geoPath().projection(projectionFn) // eslint-disable-line @typescript-eslint/no-explicit-any

  const circleClassUnique = `${styles.circle}-${uuidv1().slice(0, 6)}`
  const circleClass = `${circleClassUnique} ${styles.circle}`
  const mapLayoutItemClass = `mapLayoutItem-${uuidv1().slice(0, 6)}`

  type CircleGeo = CircleData & {
    geometry: CircleData["geolocation"] // eslint-disable-line id-denylist
    type: "Feature"
  }

  const state: ChartState = {
    isDuringAnimation: false,
    selectedCircle: null,
  }

  const modal = select(`#${rootElId}`)
    .append("div")
    .attr("class", styles.modal)
    .style("top", `${-modalHiddenTop}px`)

  const circlesGeo: CircleGeo[] = circlesData.map((circleData) => ({
    ...circleData,
    geometry: circleData.geolocation, // eslint-disable-line id-denylist
    type: "Feature",
  }))

  const removeSelection = () => {
    if (state.isDuringAnimation) {
      return
    }

    state.selectedCircle = null

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    circlesEls.attr("class", circleClass)

    anime({
      targets: `.${circleClassUnique}`,
      translateX: 0,
      translateY: 0,
    })

    state.isDuringAnimation = true

    anime({
      complete: () => {
        state.isDuringAnimation = false
        modal.text("")
      },
      targets: `.${styles.modal}`,
      translateY: 0,
    })
  }

  const getNearCirclesWithVectors = ({
    targetCircle,
  }: {
    targetCircle: CircleGeo
  }) => {
    const targetProj = projectionFn(targetCircle.geometry.coordinates) as [
      number,
      number
    ]

    const nearCircles = circlesGeo
      .slice(0)
      .filter((otherCircle) => !!(otherCircle.geometry as unknown))
      .map((otherCircle) => {
        const {
          geometry: { coordinates: otherCircleCoordinates },
        } = otherCircle
        const proj = projectionFn(otherCircleCoordinates) as [number, number]
        const vector = [proj[0] - targetProj[0], proj[1] - targetProj[1]]
        const vectorLength = Math.sqrt(
          Math.pow(vector[0], 2) + Math.pow(vector[1], 2)
        )

        return {
          ...otherCircle,
          vector,
          vectorLength,
        }
      })
      .filter(
        (otherCircle) =>
          otherCircle.vectorLength < 20 && otherCircle.vectorLength !== 0
      )
      .map((otherCircle) => ({
        ...otherCircle,
        vectorNormalized: [
          otherCircle.vector[0] / otherCircle.vectorLength,
          otherCircle.vector[1] / otherCircle.vectorLength,
        ] as [number, number],
      }))

    const nearCirclesSet = new Set(
      nearCircles.map((nearCircle) => getCircleId(nearCircle))
    )

    const vectorsMap = nearCircles.reduce((...[acc, nearCircle]) => {
      acc[getCircleId(nearCircle)] = nearCircle.vectorNormalized

      return acc
    }, {} as Record<string, [number, number]>)

    return {
      nearCircles,
      nearCirclesSet,
      vectorsMap,
    }
  }

  const circleClickHandler = ({
    clickedCircle,
  }: {
    clickedCircle: CircleGeo
  }) => {
    if (state.isDuringAnimation) {
      return
    }

    const clickedCircleId = getCircleId(clickedCircle)

    if (state.selectedCircle === clickedCircleId) {
      removeSelection()

      return
    }

    state.selectedCircle = clickedCircleId

    const modalHTML = chartConfig.getModalHTML(clickedCircle)

    modal.html(modalHTML)

    const { nearCirclesSet, vectorsMap } = getNearCirclesWithVectors({
      targetCircle: clickedCircle,
    })

    const getShouldSet0 = (geometryIndex: number) => {
      const { [geometryIndex]: animatedCircle } = circlesGeo

      return (
        getCircleId(animatedCircle) === getCircleId(clickedCircle) ||
        !nearCirclesSet.has(getCircleId(animatedCircle))
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    circlesEls.attr("class", (circle) => {
      if (nearCirclesSet.has(getCircleId(circle))) {
        return `${styles.moved} ${circleClass}`
      }

      return getCircleId(circle) === getCircleId(clickedCircle)
        ? `${styles.active} ${circleClass}`
        : circleClass
    })

    const getTranslateFn = (coordIdx: number) => (
      ...[, geometryIndex]: [unknown, number]
    ) => {
      if (getShouldSet0(geometryIndex)) {
        return 0
      }

      const { [geometryIndex]: animatedCircle } = circlesGeo
      const { [getCircleId(animatedCircle)]: vectorNormalized } = vectorsMap

      return vectorNormalized[coordIdx] * clickedCircleDistortion
    }

    anime({
      targets: `.${circleClassUnique}`,
      translateX: getTranslateFn(0),
      translateY: getTranslateFn(1),
    })

    const { top } = rootEl.getBoundingClientRect()

    anime({
      targets: `.${styles.modal}`,
      translateY: modalHiddenTop + 50 + top + window.scrollY,
    })
  }

  const circlesClickHandlerFn = (
    ...[clickEvent, clickedCircle]: [MouseEvent, CircleGeo]
  ) => {
    clickEvent.stopPropagation()
    circleClickHandler({
      clickedCircle,
    })
  }

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height - svgCutBottom)
    .style("cursor", "pointer")
    .on("click", removeSelection)
    .style("transform-origin", "top left")
    .call(
      zoom<SVGSVGElement, unknown>()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("end", zoomed)
    )

  const svgMap = svg.append("g")

  svg
    .append("text")
    .text(chartConfig.chartTitle)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .attr("transform", `translate(${width / 2},40)`)
    .style("font-weight", "bold")

  const addInfo = () => {
    const dialogId = `dialog-${uuidv1().slice(0, 6)}`

    const group = svg
      .append("g")
      .attr("transform", `translate(${width - 50},50)`)
      .attr("class", styles.infoTrigger)

    svg.append("g").html(`
<filter id="pulse" x="0" y="0" width="100%" height="100%">
  <feTurbulence result="cloud" baseFrequency=".01" seed="1"  type="fractalNoise" numOctaves="2">
  <animate attributeName="baseFrequency" calcMode="paced" begin="0s" dur="12s" values=".01;.13;.01;" repeatCount="indefinite"/>
  </feTurbulence>
  <feComposite operator="in" in="cloud" in2="SourceGraphic"/>
</filter>
    `)

    const dialog = select(document.body)
      .append("div")
      .attr("id", dialogId)
      .html(chartConfig.chartHelpHTML)

    $(`#${dialogId}`).dialog({
      autoOpen: false,
      modal: true,
      resizable: false,
    })

    group.append("circle").attr("r", "20").attr("filter", "url(#pulse)")

    group.append("text").text("?")

    group.on("click", () => {
      $(`#${dialogId}`).dialog("open")
    })

    return {
      remove: () => {
        dialog.remove()
      },
    }
  }

  addInfo()

  svgMap
    .append("g")
    .attr("class", mapLayoutItemClass)
    .selectAll("path")
    .data(mapLayout.features)
    .enter()
    .append("path")
    .attr("d", geometryPath)
    .attr("fill", "#ccc")
    .style("stroke", "white")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    .style("stroke", "white")
    .style("stroke-width", 0.3)
    .on("click", removeSelection)
    .attr("title", (mapLayoutItem) => mapLayoutItem.properties.name)

  const circlesWrapper = svgMap.append("g").on("click", removeSelection)

  const circlesEls = circlesWrapper
    .selectAll("path")
    .data(circlesGeo)
    .enter()
    .append("path")
    .attr("d", geometryPath)
    .attr("class", circleClass)
    .style("stroke", "white")
    .style("cursor", "pointer")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    .attr("title", (circleGeo) => chartConfig.getCircleTitle(circleGeo))
    .on("click", circlesClickHandlerFn)

  $(`.${circleClassUnique}`).tooltip({
    track: true,
  })

  $(`.${mapLayoutItemClass}`).tooltip({
    tooltipClass: styles.mapLayoutItemTooltip,
    track: true,
  })
}
