const d3utils = {
  colorsScale(colors, extent) {
    const c = d3.scale.linear().domain(extent).range([0, 1])
    const colorScale = d3.scale
      .linear()
      .domain(d3.range(0, 1, 1.0 / colors.length))
      .range(colors)

    return function (p) {
      return colorScale(c(p))
    }
  },
  filterBlackOpacity(id, svg, deviation, slope) {
    const defs = svg.append("defs")
    const filter = defs.append("filter").attr({
      height: "500%",
      id: `drop-shadow-${id}`,
      width: "500%",
      x: "-200%",
      y: "-200%",
    })

    filter.append("feGaussianBlur").attr({
      in: "SourceAlpha",
      stdDeviation: deviation,
    })
    filter.append("feOffset").attr({
      dx: 1,
      dy: 1,
    })
    filter.append("feComponentTransfer").append("feFuncA").attr({
      slope,
      type: "linear",
    })

    const feMerge = filter.append("feMerge")

    feMerge.append("feMergeNode")

    return feMerge.append("feMergeNode").attr("in", "SourceGraphic")
  },
  filterColor(id, svg, deviation, slope, extra) {
    if (extra == null) {
      extra = false
    }

    const defs = svg.append("defs")
    const filter = defs.append("filter").attr({
      id: `drop-shadow-${id}`,
    })

    if (extra) {
      filter.attr({
        height: "500%",
        width: "500%",
        x: "-200%",
        y: "-200%",
      })
    }

    filter.append("feOffset").attr({
      dx: 0.5,
      dy: 0.5,
      in: "SourceGraphic",
      result: "offOut",
    })
    filter.append("feGaussianBlur").attr({
      in: "offOut",
      result: "blurOut",
      stdDeviation: deviation,
    })
    filter.append("feBlend").attr({
      in: "SourceGraphic",
      in2: "blurOut",
      mode: "normal",
    })

    return filter.append("feComponentTransfer").append("feFuncA").attr({
      slope,
      type: "linear",
    })
  },
  middleTitle(svg, width, text, top) {
    if (top == null) {
      top = -15
    }

    svg
      .append("text")
      .attr({
        class: "chart-title",
        "text-anchor": "middle",
        transform: `translate(${String(width / 2)},${top})`,
      })
      .text(text)
      .style("font-weight", "bold")
  },
  svg(selector, width, height, margin) {
    return d3
      .select(selector)
      .text("")
      .append("svg")
      .attr({
        height: height + margin.top + margin.bottom,
        width: width + margin.left + margin.right,
      })
      .append("g")
      .attr({
        transform: `translate(${margin.left},${margin.top})`,
      })
  },
  tooltip(selector, customOpts) {
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

    const opts = _.merge(defaultOpts, customOpts)

    $(selector).tooltip(opts.tOpts)

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
