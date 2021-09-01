/* eslint-disable no-unused-vars */
/* global d3, anime, topojson, chroma, hotkeys, uuid, Papa */
/* eslint-enable no-unused-vars */

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

  return {
    actorsToMovies,
  }
}

const main = async () => {
  const oscarsRecords = await fetchRecords()

  const structures = extractStructures(oscarsRecords)

  console.log("demo.js: structures", structures)

  d3.select("#chart").append("svg")
}

main()
