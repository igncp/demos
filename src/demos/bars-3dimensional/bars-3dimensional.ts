import { RaphaelPaper } from "raphael"

import Raphael from "@/demos/_utils/browserRaphael"

import * as styles from "./bars-3dimensional.module.css"

const fetchData = async () => {
  const response = await fetch(
    `${ROOT_PATH}data/raphael/bars-3dimensional/data.json`
  )
  const data = await response.json()

  return data.results
}

type Data = {
  [key: string]: number[]
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
  els: { [k: string]: any }
  paper: RaphaelPaper
}

type ChartOpts = {
  data: Data
  rootElId: string
}

class Chart {
  private readonly rootElId: string
  private cg!: Config
  private dom!: Dom
  private data!: Data

  public constructor({ data, rootElId }: ChartOpts) {
    this.rootElId = rootElId

    this.setCg()
    this.setDom()
    this.setData(data)
  }

  public render() {
    this.drawAxis()
    this.data.keys.forEach((item) => {
      this.dom.els[item].el = this.dom.paper.set()
    })

    this.createCountries(this.data.seriesDisplayed)
  }

  public displayNextSeries() {
    const { data } = this

    data.seriesDisplayed =
      data.seriesDisplayed + 1 === data.seriesLength
        ? 0
        : data.seriesDisplayed + 1

    this.animateCountries(data.seriesDisplayed)
  }

  private setCg() {
    const { width } = (document.getElementById(
      this.rootElId
    ) as HTMLElement).getBoundingClientRect()

    this.cg = {
      colorScheme: ["#C1252D", "#5F3A5F", "#51A8D0"],
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
      els: {},
      paper: Raphael(this.rootElId, this.cg.width, 245),
    }
    ;(document.getElementById(this.rootElId) as HTMLElement).classList.add(
      styles.bars3DimensionalChart
    )
  }

  private setData(data: Data) {
    data.keys = Object.keys(data)
    data.seriesDisplayed = 0
    data.seriesLength = data[data.keys[0]].length
    data.keysLength = data.keys.length

    this.data = data

    data.keys.forEach((item: string) => {
      this.dom.els[item] = {}
    })
  }

  private animateCountries(i: number) {
    const { data } = this

    data.keys.forEach((item) => {
      this.dom.els[item].inner.animate(
        {
          path: this.calcInnerPath(item, i),
        },
        this.cg.speed,
        this.cg.easing
      )
      this.dom.els[item].outer.animate(
        {
          path: this.calcOuterPath(item, i),
        },
        this.cg.speed,
        this.cg.easing
      )

      return this.dom.els[item].el.animate(
        {
          fill: this.cg.colorScheme[i],
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

    for (let i = 0, _i = 0; _i <= 3; i = ++_i) {
      const path = `M5,${25 * i} ${this.cg.width},${
        this.cg.heightOffset + i * 25
      }`

      paper.path(path).attr("stroke-dasharray", ". ")
    }

    return paper
      .path(
        `M0,${deep + 100} ${deep},100 ${this.cg.width},${
          100 + this.cg.heightOffset
        } ${this.cg.width - deep},${100 + this.cg.heightOffset + deep}Z`
      )
      .attr("fill", "#999")
      .attr("stroke", "none")
  }

  private calcH0(it: string, se: number): number {
    return 100 - this.data[it]![se]!
  }

  private calcH5(it: string, se: number) {
    return 100 - this.data[it][se] + 5 * this.cg.ratio
  }

  private calcH10(it: string, se: number) {
    return 100 - this.data[it][se] + 10 * this.cg.ratio
  }

  private calcInnerPath(it: string, se: number) {
    return (
      `M0,${this.calcH5(it, se)} 15,${this.calcH10(it, se)} ` +
      `15,${100 + 10 * this.cg.ratio} 0,${100 + 5 * this.cg.ratio}Z`
    )
  }

  private calcOuterPath(it: string, se: number) {
    return `M0,${this.calcH5(it, se)} 5,${this.calcH0(it, se)} 20,${this.calcH5(
      it,
      se
    )} 20,${100 + 5 * this.cg.ratio} 15,${100 + 10 * this.cg.ratio} 0,${
      100 + 5 * this.cg.ratio
    }Z`
  }

  private createCountries(i: number) {
    const { data } = this
    const {
      dom: { paper },
    } = this

    return data.keys.forEach((item, index) => {
      this.dom.els[item].inner = paper.path(this.calcInnerPath(item, i))
      this.dom.els[item].outer = paper
        .path(this.calcOuterPath(item, i))
        .attr("opacity", 0.5)
      this.dom.els[item].el.push(
        this.dom.els[item].inner,
        this.dom.els[item].outer
      )
      this.dom.els[item].el.transform(
        `T ${(this.cg.width / data.keysLength) * index},` +
          `${(this.cg.heightOffset / data.keysLength) * index}`
      )

      return this.dom.els[item].el
        .attr("fill", "#C1252D")
        .attr("stroke", "none")
        .attr("title", `${item}: ${data[item][i]}`)
    })
  }
}

const main = async () => {
  const data = await fetchData()

  const chart = new Chart({
    data,
    rootElId: "chart",
  })

  chart.render()
  ;(document.querySelector(".animate-bars") as HTMLElement).addEventListener(
    "click",
    (e) => {
      e.preventDefault()

      chart.displayNextSeries()
    }
  )
}

export default main
