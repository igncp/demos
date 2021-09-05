/* eslint-disable no-unused-vars */
/* global d3, anime, topojson, chroma, hotkeys, uuid, Papa, Redux */
/* eslint-enable no-unused-vars */

const Actions = {
  SET_STRUCTURES: "SET_STRUCTURES",
}

const createStore = () => {
  const store = Redux.createStore(
    (...[state, action]) => {
      switch (action.type) {
        case Actions.SET_STRUCTURES: {
          return {
            ...state,
            structures: action.payload,
          }
        }

        default:
          return state
      }
    },
    {
      structures: {},
    }
  )

  return store
}

const actionSetStructures = (structures) => ({
  payload: structures,
  type: Actions.SET_STRUCTURES,
})

const camelize = (str) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (...[word, wordIndex]) =>
      wordIndex === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "")

const strToNumber = ({ key, obj }) => {
  if (!obj[key]) {
    obj[key] = null

    return
  }

  obj[key] = Number(obj[key].replace(/,/g, ""))
}

const strToArray = ({ key, obj }) => {
  if (!obj[key]) {
    obj[key] = []

    return
  }

  obj[key] = obj[key]
    .split(",")
    .map((v) => v.trim())
    .filter((v) => !!v)
}

const fetchRecords = async () => {
  const response = await fetch("./oscars_df.csv")
  const textData = await response.text()
  const csvData = Papa.parse(textData)
  const headerRowCamelcase = csvData.data[0]
    .map(camelize)
    .map((s) => s.replace(/iMDB/g, "IMDB").replace(/[/()]/g, ""))

  return csvData.data
    .slice(1, csvData.data.length)
    .map((csvItem) =>
      headerRowCamelcase.reduce((...[acc, headerCell, headerCellIndex]) => {
        acc[headerCell || "id"] = csvItem[headerCellIndex]

        return acc
      }, {})
    )
    .map((record) => {
      record.id = Number(record.id)
      strToNumber({ key: "IMDBVotes", obj: record })
      strToNumber({ key: "IMDBRating", obj: record })
      strToNumber({ key: "movieTime", obj: record })
      strToArray({ key: "genres", obj: record })
      strToArray({ key: "movieGenre", obj: record })
      strToArray({ key: "actors", obj: record })
      strToArray({ key: "directors", obj: record })

      return record
    })
}

const extractStructures = (oscarsRecords) => {
  const actorsToMovies = oscarsRecords.reduce((...[acc, record]) => {
    record.actors.forEach((...[actorName]) => {
      acc[actorName] = acc[actorName] || []
      acc[actorName].push(record.id)
    })

    return acc
  }, {})

  const sortedByIMDBRated = oscarsRecords
    .slice()
    .sort((...[recordA, recordB]) => recordB.IMDBRating - recordA.IMDBRating)
    .map((r) => r.id) // @TODO: add r to restricted names list

  return {
    actorsToMovies,
    oscarsRecords,
    sortedByIMDBRated,
  }
}

const buildListView = ({ container, store }) => {
  const view = document.createElement("div")

  container.innerHTML = ""

  const {
    structures: { oscarsRecords, sortedByIMDBRated },
  } = store.getState()

  sortedByIMDBRated.forEach((recordId) => {
    const newRow = document.createElement("div")
    const { [recordId]: record } = oscarsRecords

    newRow.innerHTML = `
<span>${record.IMDBRating}</span> - <span>${record.film}</span>
`
    view.appendChild(newRow)
  })

  console.log("demo.js: structures", store.getState().structures)

  container.appendChild(view)
}

const createPageLayout = () => {
  const grid = Array.from({ length: 4 }).map(() => {
    const gridItem = document.createElement("div")

    gridItem.classList.add("layoutGrid")

    return gridItem
  })
  const mainContainer = document.getElementById("chart")

  grid.forEach((gridElement) => {
    mainContainer.appendChild(gridElement)
  })

  return {
    grid,
    mainContainer,
  }
}

const main = async () => {
  const store = createStore()
  const oscarsRecords = await fetchRecords()

  const structures = extractStructures(oscarsRecords)
  const pageLayout = createPageLayout()

  store.dispatch(actionSetStructures(structures))

  buildListView({ container: pageLayout.grid[0], store })
}

main()
