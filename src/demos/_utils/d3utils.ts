import * as d3 from "d3"
import merge from "lodash/merge"

type Margin = {
  bottom: number
  left: number
  right: number
  top: number
}

type SVG = d3.Selection<SVGGElement, unknown, HTMLElement, unknown>

// @TODO: remove when no longer used

const d3utils = {
  colorsScale<P extends number = any>(colors: any, extent: any) {
    const c = d3.scaleLinear().domain(extent).range([0, 1])
    const colorScale = d3
      .scaleLinear()
      .domain(d3.range(0, 1, 1.0 / colors.length))
      .range(colors)

    return function (p: P) {
      return colorScale(c(p))
    }
  },
  filterBlackOpacity(id: string, svg: SVG, deviation: number, slope: number) {
    const defs = svg.append("defs")
    const filter = defs
      .append("filter")
      .attr("height", "500%")
      .attr("id", `drop-shadow-${id}`)
      .attr("width", "500%")
      .attr("x", "-200%")
      .attr("y", "-200%")

    filter
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", deviation)

    filter.append("feOffset").attr("dx", 1).attr("dy", 1)
    filter
      .append("feComponentTransfer")
      .append("feFuncA")
      .attr("slope", slope)
      .attr("type", "linear")

    const feMerge = filter.append("feMerge")

    feMerge.append("feMergeNode")

    return feMerge.append("feMergeNode").attr("in", "SourceGraphic")
  },
  filterColor(
    id: string,
    svg: SVG,
    deviation: number,
    slope: number,
    extra?: any
  ) {
    if (extra == null) {
      extra = false
    }

    const defs = svg.append("defs")
    const filter = defs.append("filter").attr("id", `drop-shadow-${id}`)

    if (extra) {
      filter
        .attr("height", "500%")
        .attr("width", "500%")
        .attr("x", "-200%")
        .attr("y", "-200%")
    }

    filter
      .append("feOffset")
      .attr("dx", 0.5)
      .attr("dy", 0.5)
      .attr("in", "SourceGraphic")
      .attr("result", "offOut")

    filter
      .append("feGaussianBlur")
      .attr("in", "offOut")
      .attr("result", "blurOut")
      .attr("stdDeviation", deviation)

    filter
      .append("feBlend")
      .attr("in", "SourceGraphic")
      .attr("in2", "blurOut")
      .attr("mode", "normal")

    return filter
      .append("feComponentTransfer")
      .append("feFuncA")
      .attr("slope", slope)
      .attr("type", "linear")
  },

  middleTitle(svg: SVG, width: number, text: string, top: number | null) {
    if (top == null) {
      top = -15
    }

    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${String(width / 2)},${top})`)
      .text(text)
      .style("font-weight", "bold")
  },
  svg(selector: string, width: number, height: number, margin: Margin) {
    return d3
      .select(selector)
      .text("")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  },
  tooltip(selector: string, customOpts: any) {
    if (customOpts == null) {
      customOpts = {}
    }

    const defaultOpts = {
      elementSelector: "",
      followElement: false,
      followMouse: false,
      leftOffst: 60,
      tOpts: {
        container: "body",
        viewport: {
          selector: "#chart svg",
        },
      },
      topOffst: 40,
    }

    const opts = merge(defaultOpts, customOpts)

    const sel: any = $(selector)

    sel.tooltip(opts.tOpts)

    if (opts.followMouse) {
      $(selector).hover((e) =>
        $(".tooltip").css({
          left: `${String(e.pageX - opts.leftOffst)}px`,
          top: `${String(e.pageY - opts.topOffst)}px`,
        })
      )
    } else if (opts.followElement) {
      $(selector).hover(() =>
        $(".tooltip").css({
          left: `${String(
            $(opts.elementSelector).position().left - opts.leftOffst
          )}px`,
          top: `${String(
            $(opts.elementSelector).position().top - opts.topOffst
          )}px`,
        })
      )
    }
  },
}

export default d3utils
