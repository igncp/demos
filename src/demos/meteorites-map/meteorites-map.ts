import anime from "animejs"
import {
  GeoProjection,
  Selection,
  geoMercator,
  geoPath,
  json,
  select,
  timeFormat,
  zoom,
} from "d3"
import qs from "query-string"
import { v1 as uuidv1 } from "uuid"

import * as styles from "./meteorites-map.module.css"

// @TODO:
// - review the checklist for the rest of refactors

type Point = [number, number]

type Meteorite = {
  fall: string
  geolocation: { coordinates: Point; type: "Point" }
  id: string
  mass: string
  name: string
  nametype: string
  recclass: string
  reclat: string
  reclong: string
  year: string
}
type MeteoriteGeo = Meteorite & {
  geometry: Meteorite["geolocation"]
  type: "Feature"
}
type Countries = {
  features: Array<{
    geometry: { coordinates: Point[]; type: "Polygon" }
    id: string
    properties: { name: string }
    type: "Feature"
  }>
  type: "FeatureCollection"
}
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
const modalHiddenTop = 250
const clickedMeteoriteDistortion = 20

const removeSelection = ({
  meteoritesEls,
  modal,
  state,
}: {
  meteoritesEls: Selection<SVGPathElement, MeteoriteGeo, SVGGElement, unknown>
  modal: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
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
}: {
  allMeteorites: MeteoriteGeo[]
  projectionFn: GeoProjection
  targetMeteorite: MeteoriteGeo
}) => {
  const targetProj = projectionFn(targetMeteorite.geometry.coordinates) as [
    number,
    number
  ]

  const nearMeteorites = allMeteorites
    .slice(0)
    .filter((otherMeteorite) => !!(otherMeteorite.geometry as unknown))
    .map((otherMeteorite) => {
      const {
        geometry: { coordinates: otherMeteoriteCoordinates },
      } = otherMeteorite
      const proj = projectionFn(otherMeteoriteCoordinates) as [number, number]
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
      (otherMeteorite) =>
        otherMeteorite.vectorLength < 20 && otherMeteorite.vectorLength !== 0
    )
    .map((otherMeteorite) => ({
      ...otherMeteorite,
      vectorNormalized: [
        otherMeteorite.vector[0] / otherMeteorite.vectorLength,
        otherMeteorite.vector[1] / otherMeteorite.vectorLength,
      ] as [number, number],
    }))

  const nearMeteoritesSet = new Set(nearMeteorites.map((a) => a.id))

  const vectorsMap = nearMeteorites.reduce((acc, nearMeteorite) => {
    acc[nearMeteorite.id] = nearMeteorite.vectorNormalized

    return acc
  }, {} as Record<string, [number, number]>)

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
  meteoritesGeo,
  modal,
  projectionFn,
  rootElId,
  state,
}: {
  clickedMeteorite: MeteoriteGeo
  meteoritesEls: Selection<SVGPathElement, MeteoriteGeo, SVGGElement, unknown>
  meteoritesGeo: MeteoriteGeo[]
  modal: Selection<HTMLDivElement, unknown, HTMLElement, unknown>
  projectionFn: GeoProjection
  rootElId: string
  state: State
}) => {
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
  const mass = new Intl.NumberFormat().format(+clickedMeteorite.mass)

  modal.html(
    `
<h1>${clickedMeteorite.name}</h1>
<p>Year: ${year}, Class: <a href="https://www.google.com/search?${qs.stringify({
      q: `${clickedMeteorite.recclass} Meteorite Class`,
    })}" target="_blank">${clickedMeteorite.recclass}</a></p>
<p>${mass ? `Mass: ${mass}g, ` : ""}Name: ${clickedMeteorite.nametype}</p>
<p><a href="https://www.google.com/search?${qs.stringify({
      q: `${clickedMeteorite.name} Meteorite ${year}`,
    })}" target="_blank">Click here to search</a></p>
`.trim()
  )

  const { nearMeteoritesSet, vectorsMap } = getNearMeteoritessWithVectors({
    allMeteorites: meteoritesGeo,
    projectionFn,
    targetMeteorite: clickedMeteorite,
  })

  const getShouldSet0 = (idx: number) => {
    const { [idx]: animatedMeteorite } = meteoritesGeo

    return (
      animatedMeteorite.id === clickedMeteorite.id ||
      !nearMeteoritesSet.has(animatedMeteorite.id)
    )
  }

  meteoritesEls.attr("class", (meteorite) => {
    if (nearMeteoritesSet.has(meteorite.id)) {
      return `${styles.moved} ${styles.meteorite}`
    }

    return meteorite.id === clickedMeteorite.id
      ? `${styles.active} ${styles.meteorite}`
      : styles.meteorite
  })

  const getTranslateFn = (coordIdx: number) => (_el: unknown, idx: number) => {
    if (getShouldSet0(idx)) {
      return 0
    }

    const { [idx]: animatedMeteorite } = meteoritesGeo
    const { [animatedMeteorite.id]: vectorNormalized } = vectorsMap

    return vectorNormalized[coordIdx] * clickedMeteoriteDistortion
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
  svg: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
  width: number
}) => {
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

  const dialog = select(document.body).append("div").attr("id", dialogId).html(
    `
<p>The green circles refer to meteorites which were moved in the map to allow seeing the selected meteorite, which is in red.</p>
<p>You can find the <a href="http://www.meteoritemarket.com/type.htm">meteorites classification here</a></p>
`.trim()
  )

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

const zoomed = function (this: SVGSVGElement, e: any) {
  select(this).transition().duration(500).attr("transform", e.transform)
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

  const modal = select(`#${rootElId}`)
    .append("div")
    .attr("class", styles.modal)
    .style("top", `${-modalHiddenTop}px`)

  const meteoritesGeo: MeteoriteGeo[] = meteorites.map((a) => ({
    ...a,
    geometry: a.geolocation,
    type: "Feature",
  }))

  const removeSelectionFn = () => {
    removeSelection({
      meteoritesEls, // eslint-disable-line @typescript-eslint/no-use-before-define
      modal,
      state,
    })
  }

  const meteoritessClickHandlerFn = (
    clickEvent: MouseEvent,
    clickedMeteorite: MeteoriteGeo
  ) => {
    clickEvent.stopPropagation()
    meteoriteClickHandler({
      clickedMeteorite,
      meteoritesEls, // eslint-disable-line @typescript-eslint/no-use-before-define
      meteoritesGeo,
      modal,
      projectionFn,
      rootElId,
      state,
    })
  }

  const svg = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height - svgCutBottom)
    .style("cursor", "pointer")
    .on("click", removeSelectionFn)
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
    .text(texts.title)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .attr("transform", `translate(${width / 2},40)`)
    .style("font-weight", "bold")

  addInfo({
    svg,
    width,
  })

  const countryClass = `country-${uuidv1().slice(0, 6)}`

  svgMap
    .append("g")
    .attr("class", countryClass)
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
    .attr("title", (country) => country.properties.name)

  const meteoritessWrapper = svgMap.append("g").on("click", removeSelectionFn)

  const meteoritesEls = meteoritessWrapper
    .selectAll("path")
    .data(meteoritesGeo)
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

  $(`.${countryClass}`).tooltip({
    tooltipClass: styles.countryTooltip,
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
