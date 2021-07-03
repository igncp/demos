const ch = {}

ch.getData = function (cb) {
  return $.ajax(`${ROOT_PATH}data/raphael/bars-3dimensional/data.json`).done(
    (data) => {
      ch.data = data.results
      ch.setData()

      return cb()
    }
  )
}

ch.setData = function () {
  const { data } = ch

  data.keys = Object.keys(data)
  data.seriesDisplayed = 0
  data.seriesLength = data[data.keys[0]].length
  data.keysLength = data.keys.length

  data.keys.forEach((item) => {
    ch.dom.els[item] = {}
  })
}

ch.setCg = function (config) {
  if (config == null) {
    config = {}
  }

  ch.cg = _.extend(
    {
      colorScheme: ["#C1252D", "#5F3A5F", "#51A8D0"],
      deep: 5,
      easing: "bounce",
      heightOffset: 100,
      ratio: 0.6,
      speed: 800,
      width: $("#chart").width(),
    },
    config
  )
}

ch.setDom = function () {
  ch.dom = {
    els: {},
    paper: Raphael("chart", ch.cg.width, 245),
  }
}

ch.drawAxis = function () {
  const { paper } = ch.dom
  const { deep } = ch.cg

  for (let i = 0, _i = 0; _i <= 3; i = ++_i) {
    const path = `M5,${String(25 * i)} ${ch.cg.width},${String(
      ch.cg.heightOffset + i * 25
    )}`

    paper.path(path).attr({
      "stroke-dasharray": ". ",
    })
  }

  return paper
    .path(
      `M0,${deep + 100} ${deep},100 ${ch.cg.width},${
        100 + ch.cg.heightOffset
      } ${ch.cg.width - deep},${100 + ch.cg.heightOffset + deep}Z`
    )
    .attr({
      fill: "#999",
      stroke: "none",
    })
}

ch.calcH0 = function (it, se) {
  return 100 - ch.data[it][se]
}

ch.calcH5 = function (it, se) {
  return 100 - ch.data[it][se] + 5 * ch.cg.ratio
}

ch.calcH10 = function (it, se) {
  return 100 - ch.data[it][se] + 10 * ch.cg.ratio
}

ch.calcInnerPath = function (it, se) {
  return (
    `M0,${ch.calcH5(it, se)} 15,${ch.calcH10(it, se)} ` +
    `15,${100 + 10 * ch.cg.ratio} 0,${100 + 5 * ch.cg.ratio}Z`
  )
}

ch.calcOuterPath = function (it, se) {
  return `M0,${ch.calcH5(it, se)} 5,${ch.calcH0(it, se)} 20,${ch.calcH5(
    it,
    se
  )} 20,${100 + 5 * ch.cg.ratio} 15,${100 + 10 * ch.cg.ratio} 0,${
    100 + 5 * ch.cg.ratio
  }Z`
}

ch.createCountries = function (i) {
  const { data } = ch
  const { paper } = ch.dom

  return data.keys.forEach((item, index) => {
    ch.dom.els[item].inner = paper.path(ch.calcInnerPath(item, i))
    ch.dom.els[item].outer = paper.path(ch.calcOuterPath(item, i)).attr({
      opacity: ".5",
    })
    ch.dom.els[item].el.push(ch.dom.els[item].inner, ch.dom.els[item].outer)
    ch.dom.els[item].el.transform(
      `T ${String((ch.cg.width / data.keysLength) * index)},` +
        `${String((ch.cg.heightOffset / data.keysLength) * index)}`
    )

    return ch.dom.els[item].el.attr({
      fill: "#C1252D",
      stroke: "none",
      title: `${item}: ${data[item][i]}`,
    })
  })
}

ch.animateCountries = function (i) {
  const { data } = ch

  data.keys.forEach((item) => {
    ch.dom.els[item].inner.animate(
      {
        path: ch.calcInnerPath(item, i),
      },
      ch.cg.speed,
      ch.cg.easing
    )
    ch.dom.els[item].outer.animate(
      {
        path: ch.calcOuterPath(item, i),
      },
      ch.cg.speed,
      ch.cg.easing
    )

    return ch.dom.els[item].el.animate(
      {
        fill: ch.cg.colorScheme[i],
      },
      ch.cg.speed
    )
  })
}

ch.bindClickEvent = function () {
  const { data } = ch

  return $(".animate-bars").bind("click", (e) => {
    e.preventDefault()

    if (data.seriesDisplayed + 1 === data.seriesLength) {
      data.seriesDisplayed = 0
    } else {
      data.seriesDisplayed = data.seriesDisplayed + 1
    }

    return ch.animateCountries(data.seriesDisplayed)
  })
}

ch.render = function () {
  ch.drawAxis()
  ch.data.keys.forEach((item) => {
    ch.dom.els[item].el = ch.dom.paper.set()
  })
  ch.bindClickEvent()

  return ch.createCountries(ch.data.seriesDisplayed)
}

ch.ready = function () {
  ch.setCg()
  ch.setDom()

  return ch.getData(ch.render)
}

export default () => {
  ch.ready()
}
