import { Selection, geoMercator, geoPath, json, select, timeFormat } from "d3"
import anime from "animejs"
import qs from "query-string"

import * as styles from "./meteorites-map.module.css"

// @TODO:
// - complete static types
// - fill more explanations in the dialog
// - exclude bottom part of the map
// - rename 'parsed' to something else
// - review the checklist for the rest of refactors

type Meteorite = {
  fall: string
  geolocation: { coordinates: [number, number]; type: "Point" }
  id: string
  mass: string
  name: string
  nametype: string
  recclass: string
  reclat: string
  reclong: string
  year: string
}
type MeteoriteParsed = Meteorite & {
  geometry: Meteorite["geolocation"]
  type: "Feature"
}
type Countries = any
type State = {
  isDuringAnimation: boolean
  selectedMeteorite: string | null
}

const fetchData = async () => {
  const [countries, meteorites] = (await (Promise.all([
    json(`${ROOT_PATH}data/d3js/meteorites-map/world_countries.json`),
    json(`${ROOT_PATH}data/d3js/meteorites-map/meteorites.json`),
  ]) as unknown)) as unknown[]

  return ({
    countries,
    meteorites,
  } as unknown) as { countries: Countries; meteorites: Meteorite[] }
}

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
}

const svgCutBottom = 250 // to remove the south pole which doesn't have any in the data
const height = 1000 - margin.top - margin.bottom
const modalHiddenTop = 200

const removeSelection = ({
  meteoritesEls,
  modal,
  state,
}: {
  meteoritesEls: Selection<SVGPathElement, MeteoriteParsed, SVGGElement, any>
  modal: any
  state: State
}) => {
  if (state.isDuringAnimation) {
    return
  }

  state.selectedMeteorite = null

  meteoritesEls.attr("class", styles.meteorite)

  anime({
    targets: `.${styles.meteorite}`,
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

const getNearMeteoritessWithVectors = ({
  allMeteorites,
  projectionFn,
  targetMeteorite,
}: any) => {
  const targetProj = projectionFn(targetMeteorite.geometry.coordinates)

  const nearMeteorites = allMeteorites
    .slice(0)
    .filter((otherMeteorite: any) => !!otherMeteorite.geometry)
    .map((otherMeteorite: any) => {
      const {
        geometry: { coordinates: otherMeteoriteCoordinates },
      } = otherMeteorite
      const proj = projectionFn(otherMeteoriteCoordinates)
      const vector = [proj[0] - targetProj[0], proj[1] - targetProj[1]]
      const vectorLength = Math.sqrt(
        Math.pow(vector[0], 2) + Math.pow(vector[1], 2)
      )

      return {
        ...otherMeteorite,
        vector,
        vectorLength,
      }
    })
    .filter(
      (otherMeteorite: any) =>
        otherMeteorite.vectorLength < 20 && otherMeteorite.vectorLength !== 0
    )
    .map((otherMeteorite: any) => ({
      ...otherMeteorite,
      vectorNormalized: [
        otherMeteorite.vector[0] / otherMeteorite.vectorLength,
        otherMeteorite.vector[1] / otherMeteorite.vectorLength,
      ],
    }))

  const nearMeteoritesSet = new Set(nearMeteorites.map((a: any) => a.id))

  const vectorsMap = nearMeteorites.reduce((acc: any, nearMeteorite: any) => {
    acc[nearMeteorite.id] = nearMeteorite.vectorNormalized

    return acc
  }, {})

  return {
    nearMeteorites,
    nearMeteoritesSet,
    vectorsMap,
  }
}

const texts = {
  title: "Meteorite landings in Earth",
}

const meteoriteClickHandler = ({
  clickedMeteorite,
  meteoritesEls,
  meteoritesParsed,
  modal,
  projectionFn,
  rootElId,
  state,
}: any) => {
  if (state.isDuringAnimation) {
    return
  }

  if (state.selectedMeteorite === clickedMeteorite.id) {
    removeSelection({
      meteoritesEls,
      modal,
      state,
    })

    return
  }

  state.selectedMeteorite = clickedMeteorite.id

  const year = timeFormat("%Y")(new Date(clickedMeteorite.year))
  const mass = new Intl.NumberFormat().format(clickedMeteorite.mass)

  modal.html(
    `
<h1>${clickedMeteorite.name}</h1>
<p>Year: ${year}, Class: ${clickedMeteorite.recclass}</p>
<p>${mass ? `Mass: ${mass}g, ` : ""}Name: ${clickedMeteorite.nametype}</p>
<p><a href="https://www.google.com/search?${qs.stringify({
      q: `${clickedMeteorite.name} Meteorite ${year}`,
    })}" target="_blank">Click here to search</a></p>
`.trim()
  )

  const { nearMeteoritesSet, vectorsMap } = getNearMeteoritessWithVectors({
    allMeteorites: meteoritesParsed,
    projectionFn,
    targetMeteorite: clickedMeteorite,
  })

  const getShouldSet0 = (idx: any) => {
    const { [idx]: animatedMeteorite } = meteoritesParsed

    return (
      animatedMeteorite.id === clickedMeteorite.id ||
      !nearMeteoritesSet.has(animatedMeteorite.id)
    )
  }

  meteoritesEls.attr("class", (d: any) => {
    if (nearMeteoritesSet.has(d.id)) {
      return `${styles.moved} ${styles.meteorite}`
    }

    return d.id === clickedMeteorite.id
      ? `${styles.active} ${styles.meteorite}`
      : styles.meteorite
  })

  const getTranslateFn = (coordIdx: any) => (_el: unknown, idx: any) => {
    if (getShouldSet0(idx)) {
      return 0
    }

    const { [idx]: animatedMeteorite } = meteoritesParsed
    const { [animatedMeteorite.id]: vectorNormalized } = vectorsMap

    return vectorNormalized[coordIdx] * 20
  }

  anime({
    targets: `.${styles.meteorite}`,
    translateX: getTranslateFn(0),
    translateY: getTranslateFn(1),
  })

  const rootEl = document.getElementById(rootElId) as HTMLElement
  const { top } = rootEl.getBoundingClientRect()

  anime({
    targets: `.${styles.modal}`,
    translateY: modalHiddenTop + 50 + top + window.scrollY,
  })
}

const addInfo = ({
  svg,
  width,
}: {
  svg: Selection<SVGSVGElement, unknown, HTMLElement, any>
  width: number
}) => {
  const group = svg
    .append("g")
    .attr("transform", `translate(${width - 50},50)`)
    .attr("cursor", "pointer")

  svg.append("g").html(`
<filter id="pulse" x="0" y="0" width="100%" height="100%">
  <feTurbulence result="cloud" baseFrequency=".01" seed="1"  type="fractalNoise" numOctaves="2">
  <animate attributeName="baseFrequency" calcMode="paced" begin="0s" dur="12s" values=".01;.13;.01;" repeatCount="indefinite"/>
  </feTurbulence>
  <feComposite operator="in" in="cloud" in2="SourceGraphic"/>
</filter>
    `)

  select(document.body).append("div").attr("id", "info-dialog").html(
    `
<p>The green circles refer to meteorites which were moved in the map to allow seeing the selected meteorite (red).</p>
`.trim()
  )

  $("#info-dialog").dialog({
    autoOpen: false,
    modal: true,
    resizable: false,
  })

  group
    .append("circle")
    .attr("fill", "#fff")
    .attr("stroke", "#ccc")
    .attr("r", "20")
    .attr("filter", "url(#pulse)")

  group
    .append("text")
    .text("?")
    .attr("text-anchor", "middle")
    .style("font-size", 20)
    .attr("transform", `translate(0,5)`)

  group.on("click", () => {
    $("#info-dialog").dialog("open")
  })
}

type RenderChart = (o: {
  countries: Countries
  meteorites: Meteorite[]
  rootElId: string
}) => void

const renderChart: RenderChart = ({ countries, meteorites, rootElId }) => {
  const rootEl = document.getElementById(rootElId) as HTMLElement
  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right
  const projectionFn = geoMercator().translate([width / 2, height / 2])
  const path = geoPath().projection(projectionFn)

  const state: State = {
    isDuringAnimation: false,
    selectedMeteorite: null,
  }

  const removeSelectionFn = () => {
    removeSelection({
      meteoritesEls,
      modal,
      state,
    })
  }

  const meteoritessClickHandlerFn = (
    clickEvent: MouseEvent,
    clickedMeteorite: MeteoriteParsed
  ) => {
    clickEvent.stopPropagation()
    meteoriteClickHandler({
      clickedMeteorite,
      meteoritesEls,
      meteoritesParsed,
      modal,
      projectionFn,
      rootElId,
      state,
    })
  }

  const meteoritesParsed: MeteoriteParsed[] = meteorites.map((a) => ({
    ...a,
    geometry: a.geolocation,
    type: "Feature",
  }))

  const modal = select(`#${rootElId}`)
    .append("div")
    .attr("class", styles.modal)
    .style("top", `${-modalHiddenTop}px`)

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height - svgCutBottom)
    .on("click", removeSelectionFn)

  const svgMap = svg.append("g").attr("class", "map")

  svg
    .append("text")
    .text(texts.title)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .attr("transform", `translate(${width / 2},40)`)
    .style("font-weight", "bold")

  addInfo({
    svg,
    width,
  })

  svgMap
    .append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("d", path as any)
    .attr("fill", "#ccc")
    .style("stroke", "white")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    .style("stroke", "white")
    .style("stroke-width", 0.3)
    .on("click", removeSelectionFn)

  const meteoritessWrapper = svgMap.append("g").on("click", removeSelectionFn)

  const meteoritesEls = meteoritessWrapper
    .selectAll("path")
    .data(meteoritesParsed)
    .enter()
    .append("path")
    .attr("d", path as any)
    .attr("class", styles.meteorite)
    .style("stroke", "white")
    .style("cursor", "pointer")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    .attr("title", (d) => d.name)
    .on("click", meteoritessClickHandlerFn)

  $(`.${styles.meteorite}`).tooltip({
    track: true,
  })
}

const main = async () => {
  const { countries, meteorites } = await fetchData()

  renderChart({
    countries,
    meteorites,
    rootElId: "chart",
  })
}

export default main
