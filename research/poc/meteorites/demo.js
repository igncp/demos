/* eslint-disable no-unused-vars */
/* global d3, anime, topojson, chroma, Qs */
/* eslint-enable no-unused-vars */

// Notes:
// Added the interaction with the buttons

const margin = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
}

const { innerWidth } = window

const width = innerWidth - margin.left - margin.right
const height = 1000 - margin.top - margin.bottom

const projection = d3.geoMercator().translate([width / 2, height / 2])

const path = d3.geoPath().projection(projection)

const removeSelection = ({ state, asteroidsEls, modal }) => {
  if (state.isDuringAnimation) {
    return
  }

  state.selectedAsteroid = null

  asteroidsEls.attr("class", "asteroid")

  anime({
    targets: ".asteroid",
    translateX: 0,
    translateY: 0,
  })

  state.isDuringAnimation = true

  anime({
    complete: () => {
      state.isDuringAnimation = false
      modal.text("")
    },
    targets: ".modal",
    translateY: 0,
  })
}

const getNearAsteroidsWithVectors = ({
  allAsteroids,
  projectionFn,
  targetAsteroid,
}) => {
  const targetProj = projectionFn(targetAsteroid.geometry.coordinates)

  const nearAsteroids = allAsteroids
    .slice(0)
    .filter((otherAsteroid) => !!otherAsteroid.geometry)
    .map((otherAsteroid) => {
      const otherAsteroidCoordinates = otherAsteroid.geometry.coordinates
      const proj = projection(otherAsteroidCoordinates)
      const vector = [proj[0] - targetProj[0], proj[1] - targetProj[1]]
      const vectorLength = Math.sqrt(
        Math.pow(vector[0], 2) + Math.pow(vector[1], 2)
      )

      return {
        ...otherAsteroid,
        vector,
        vectorLength,
      }
    })
    .filter(
      (otherAsteroid) =>
        otherAsteroid.vectorLength < 20 && otherAsteroid.vectorLength !== 0
    )
    .map((otherAsteroid) => ({
      ...otherAsteroid,
      vectorNormalized: [
        otherAsteroid.vector[0] / otherAsteroid.vectorLength,
        otherAsteroid.vector[1] / otherAsteroid.vectorLength,
      ],
    }))

  const nearAsteroidsSet = new Set(nearAsteroids.map((a) => a.id))

  const vectorsMap = nearAsteroids.reduce((acc, nearAsteroid) => {
    acc[nearAsteroid.id] = nearAsteroid.vectorNormalized

    return acc
  }, {})

  return {
    nearAsteroids,
    nearAsteroidsSet,
    vectorsMap,
  }
}

const texts = {
  title: "Meteorite landings in Earth",
}

const asteroidClickHandler = ({
  asteroidsEls,
  asteroidsParsed,
  clickedAsteroid,
  modal,
  state,
}) => {
  if (state.isDuringAnimation) {
    return
  }

  if (state.selectedAsteroid === clickedAsteroid.id) {
    removeSelection({
      asteroidsEls,
      modal,
      state,
    })

    return
  }

  state.selectedAsteroid = clickedAsteroid.id

  const year = d3.timeFormat("%Y")(new Date(clickedAsteroid.year))
  const mass = new Intl.NumberFormat().format(clickedAsteroid.mass)

  modal.html(
    `
<h1>${clickedAsteroid.name}</h1>
<p>Year: ${year}, Class: ${clickedAsteroid.recclass}</p>
<p>${mass ? `Mass: ${mass}g, ` : ""}Name: ${clickedAsteroid.nametype}</p>
<p><a href="https://www.google.com/search?${Qs.stringify({
      q: `${clickedAsteroid.name} asteroid ${year}`,
    })}" target="_blank">Click here to search</a></p>
`.trim()
  )

  const { nearAsteroidsSet, vectorsMap } = getNearAsteroidsWithVectors({
    allAsteroids: asteroidsParsed,
    projectionFn: projection,
    targetAsteroid: clickedAsteroid,
  })

  const getShouldSet0 = (idx) => {
    const animatedAsteroid = asteroidsParsed[idx]

    return (
      animatedAsteroid.id === clickedAsteroid.id ||
      !nearAsteroidsSet.has(animatedAsteroid.id)
    )
  }

  asteroidsEls.attr("class", (d) => {
    if (nearAsteroidsSet.has(d.id)) {
      return "moved asteroid"
    }

    return d.id === clickedAsteroid.id ? "active asteroid" : "asteroid"
  })

  const getTranslateFn = (coordIdx) => (_el, idx) => {
    if (getShouldSet0(idx)) {
      return 0
    }

    const animatedAsteroid = asteroidsParsed[idx]
    const vectorNormalized = vectorsMap[animatedAsteroid.id]

    return vectorNormalized[coordIdx] * 20
  }

  anime({
    targets: ".asteroid",
    translateX: getTranslateFn(0),
    translateY: getTranslateFn(1),
  })

  anime({
    targets: ".modal",
    translateY: 200,
  })
}

const addInfo = ({ svg }) => {
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

  d3.select(document.body).append("div").attr("id", "info-dialog").html(
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

function ready(_error, data, asteroids) {
  const state = {
    isDuringAnimation: false,
    selectedAsteroid: null,
  }

  const removeSelectionFn = () => {
    removeSelection({
      asteroidsEls,
      modal,
      state,
    })
  }

  const asteroidsClickHandlerFn = (clickEvent, clickedAsteroid) => {
    clickEvent.stopPropagation()
    asteroidClickHandler({
      asteroidsEls,
      asteroidsParsed,
      clickedAsteroid,
      modal,
      state,
    })
  }

  const asteroidsParsed = asteroids.map((a, idx) => ({
    ...a,
    geometry: a.geolocation,
    id: `asteroid-${idx}`,
    type: "Feature",
  }))

  const modal = d3.select("#chart").append("div").attr("class", "modal")

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", removeSelectionFn)

  const svgMap = svg.append("g").attr("class", "map")

  svg
    .append("text")
    .text(texts.title)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .attr("transform", `translate(${width / 2},20)`)
    .style("font-weight", "bold")

  addInfo({
    svg,
  })

  svgMap
    .append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#ccc")
    .style("stroke", "white")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    .style("stroke", "white")
    .style("stroke-width", 0.3)
    .on("click", removeSelectionFn)

  const asteroidsWrapper = svgMap.append("g").on("click", removeSelectionFn)

  const asteroidsEls = asteroidsWrapper
    .selectAll("path")
    .data(asteroidsParsed)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "asteroid")
    .style("stroke", "white")
    .style("cursor", "pointer")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    .attr("title", (d) => d.name)
    .on("click", asteroidsClickHandlerFn)

  $(".asteroid").tooltip({
    track: true,
  })
}

const main = async () => {
  const countries = await d3.json("./world_countries.json")
  const asteroids = await d3.json("./data.json")

  ready(null, countries, asteroids)
}

main()
