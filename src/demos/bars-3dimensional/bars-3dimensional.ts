import { RaphaelPaper, RaphaelPath, RaphaelSet } from "raphael"

import Raphael from "@/demos/_utils/browserRaphael"

import * as styles from "./bars-3dimensional.module.css"

const fetchData = async () => {
  const response = await fetch(
    `${ROOT_PATH}data/raphael/bars-3dimensional/data.json`
  )
  const jsonResponse = await response.json()

  return jsonResponse.results
}

type CountriesMetrics = {
  [countryName: string]: number[]
} & {
  keys: string[]
  keysLength: number
  seriesDisplayed: number
  seriesLength: number
}

type Config = {
  colorScheme: string[]
  deep: number
  easing: string
  heightOffset: number
  ratio: number
  speed: number
  width: number
}

type Dom = {
  elements: {
    [k: string]: {
      inner?: RaphaelPath
      outer?: RaphaelPath
      paperSet?: RaphaelSet
    }
  }
  paper: RaphaelPaper
}

type CalcArgs = {
  countryName: string
  serieIndex: number
}

type ChartOpts = {
  countriesMetrics: CountriesMetrics
  rootElId: string
}

class Chart {
  private readonly rootElId: string
  private cg!: Config
  private dom!: Dom
  private countriesMetrics!: CountriesMetrics

  public constructor({ countriesMetrics, rootElId }: ChartOpts) {
    this.rootElId = rootElId

    this.setCg()
    this.setDom()
    this.setData(countriesMetrics)
  }

  public render() {
    this.drawAxis()
    this.countriesMetrics.keys.forEach((countryName) => {
      this.dom.elements[countryName].paperSet = this.dom.paper.set()
    })

    this.createCountries(this.countriesMetrics.seriesDisplayed)
  }

  public displayNextSeries() {
    const { countriesMetrics } = this

    countriesMetrics.seriesDisplayed =
      countriesMetrics.seriesDisplayed + 1 === countriesMetrics.seriesLength
        ? 0
        : countriesMetrics.seriesDisplayed + 1

    this.animateCountries(countriesMetrics.seriesDisplayed)
  }

  private setCg() {
    const { width } = (document.getElementById(
      this.rootElId
    ) as HTMLElement).getBoundingClientRect()

    this.cg = {
      colorScheme: ["#c1252d", "#5f3a5f", "#51a8d0"],
      deep: 5,
      easing: "bounce",
      heightOffset: 100,
      ratio: 0.6,
      speed: 800,
      width,
    }
  }

  private setDom() {
    this.dom = {
      elements: {},
      paper: Raphael(this.rootElId, this.cg.width, 245),
    }
    ;(document.getElementById(this.rootElId) as HTMLElement).classList.add(
      styles.bars3DimensionalChart
    )
  }

  private setData(countriesMetrics: CountriesMetrics) {
    countriesMetrics.keys = Object.keys(countriesMetrics)
    countriesMetrics.seriesDisplayed = 0
    countriesMetrics.seriesLength =
      countriesMetrics[countriesMetrics.keys[0]].length
    countriesMetrics.keysLength = countriesMetrics.keys.length

    this.countriesMetrics = countriesMetrics

    countriesMetrics.keys.forEach((countryName: string) => {
      this.dom.elements[countryName] = {}
    })
  }

  private animateCountries(serieIndex: number) {
    const { countriesMetrics } = this

    countriesMetrics.keys.forEach((countryName) => {
      this.dom.elements[countryName].inner!.animate(
        {
          path: this.calcInnerPath({ countryName, serieIndex }),
        },
        this.cg.speed,
        this.cg.easing
      )
      this.dom.elements[countryName].outer!.animate(
        {
          path: this.calcOuterPath({ countryName, serieIndex }),
        },
        this.cg.speed,
        this.cg.easing
      )

      return this.dom.elements[countryName].paperSet!.animate(
        {
          fill: this.cg.colorScheme[serieIndex],
        },
        this.cg.speed
      )
    })
  }

  private drawAxis() {
    const {
      dom: { paper },
    } = this
    const {
      cg: { deep },
    } = this

    Array.from({ length: 4 }).forEach((...[, pathIndex]) => {
      const horizontalLineHeight = 25 * pathIndex
      const path = `M5,${horizontalLineHeight} ${this.cg.width},${
        this.cg.heightOffset + horizontalLineHeight
      }`

      paper.path(path).attr("stroke-dasharray", ". ")
    })

    return paper
      .path(
        `M0,${deep + 100} ${deep},100 ${this.cg.width},${
          100 + this.cg.heightOffset
        } ${this.cg.width - deep},${100 + this.cg.heightOffset + deep}Z`
      )
      .attr("fill", "#999")
      .attr("stroke", "none")
  }

  private calcH0({ countryName, serieIndex }: CalcArgs): number {
    return 100 - this.countriesMetrics[countryName]![serieIndex]!
  }

  private calcH5({ countryName, serieIndex }: CalcArgs) {
    return (
      100 - this.countriesMetrics[countryName][serieIndex] + 5 * this.cg.ratio
    )
  }

  private calcH10({ countryName, serieIndex }: CalcArgs) {
    return (
      100 - this.countriesMetrics[countryName][serieIndex] + 10 * this.cg.ratio
    )
  }

  private calcInnerPath({ countryName, serieIndex }: CalcArgs) {
    return `M0,${this.calcH5({ countryName, serieIndex })} 15,${this.calcH10({
      countryName,
      serieIndex,
    })} 15,${100 + 10 * this.cg.ratio} 0,${100 + 5 * this.cg.ratio}Z`
  }

  private calcOuterPath({ countryName, serieIndex }: CalcArgs) {
    return `M0,${this.calcH5({ countryName, serieIndex })} 5,${this.calcH0({
      countryName,
      serieIndex,
    })} 20,${this.calcH5({ countryName, serieIndex })} 20,${
      100 + 5 * this.cg.ratio
    } 15,${100 + 10 * this.cg.ratio} 0,${100 + 5 * this.cg.ratio}Z`
  }

  private createCountries(serieIndex: number) {
    const { countriesMetrics } = this
    const {
      dom: { paper },
    } = this

    return countriesMetrics.keys.forEach((...[countryName, countryIndex]) => {
      this.dom.elements[countryName].inner = paper.path(
        this.calcInnerPath({ countryName, serieIndex })
      )
      this.dom.elements[countryName].outer = paper
        .path(this.calcOuterPath({ countryName, serieIndex }))
        .attr("opacity", 0.5)
      this.dom.elements[countryName].paperSet!.push(
        this.dom.elements[countryName].inner!,
        this.dom.elements[countryName].outer!
      )
      this.dom.elements[countryName].paperSet!.transform(
        `T ${(this.cg.width / countriesMetrics.keysLength) * countryIndex},` +
          `${
            (this.cg.heightOffset / countriesMetrics.keysLength) * countryIndex
          }`
      )

      return this.dom.elements[countryName]
        .paperSet!.attr("fill", "#c1252d")
        .attr("stroke", "none")
        .attr(
          "title",
          `${countryName}: ${countriesMetrics[countryName][serieIndex]}`
        )
    })
  }
}

const main = async () => {
  const countriesMetrics = await fetchData()

  const chart = new Chart({
    countriesMetrics,
    rootElId: "chart",
  })

  chart.render()

  const animateButton = document.querySelector(".animate-bars") as HTMLElement

  animateButton.addEventListener("click", (clickEvent) => {
    clickEvent.preventDefault()

    chart.displayNextSeries()
  })
}

export default main
