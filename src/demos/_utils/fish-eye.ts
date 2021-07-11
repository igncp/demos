import * as d3 from "d3"

export type FishEyeScale = any

// https://github.com/d3/d3/blob/v3.5.17/src/core/rebind.js
const rebind = function (target: any, source: any, ...methods: any[]) {
  methods.forEach((method) => {
    target[method] = d3Rebind(target, source, source[method])
  })

  return target
}

function d3Rebind(target: any, source: any, method: any) {
  return function () {
    const value = method.apply(source, arguments)

    return value === source ? target : value
  }
}

// https://github.com/d3/d3-plugins/blob/master/fisheye/fisheye.js
const d3Fisheye = {
  circular() {
    let radius = 200

    let distortion = 2
    let k0: any = null
    let k1: any = null
    let focus = [0, 0]

    function fisheye(d: any) {
      const dx = d.x - focus[0]
      const dy = d.y - focus[1]
      const dd = Math.sqrt(dx * dx + dy * dy)

      if (!dd || dd >= radius)
        return { x: d.x, y: d.y, z: dd >= radius ? 1 : 10 }

      const k = ((k0 * (1 - Math.exp(-dd * k1))) / dd) * 0.75 + 0.25

      return {
        x: focus[0] + dx * k,
        y: focus[1] + dy * k,
        z: Math.min(k, 10),
      }
    }

    function rescale() {
      k0 = Math.exp(distortion)
      k0 = (k0 / (k0 - 1)) * radius
      k1 = distortion / radius

      return fisheye
    }

    fisheye.radius = function (_: any) {
      if (!arguments.length) return radius
      radius = +_

      return rescale()
    }

    fisheye.distortion = function (_: any) {
      if (!arguments.length) return distortion
      distortion = +_

      return rescale()
    }

    fisheye.focus = function (_: any) {
      if (!arguments.length) return focus
      focus = _

      return fisheye
    }

    return rescale()
  },
  scale(scaleType: any) {
    return d3FisheyeScale(scaleType(), 3, 0)
  },
}

function d3FisheyeScale(scale: any, d: any, a: any) {
  function fisheye(_: any) {
    const x = scale(_)
    const left = x < a
    const range = d3.extent(scale.range())
    const min: any = range[0]
    const max: any = range[1]
    let m = left ? a - min : max - a

    if (m == 0) m = max - min

    return ((left ? -1 : 1) * m * (d + 1)) / (d + m / Math.abs(x - a)) + a
  }

  fisheye.distortion = function (_: any) {
    if (!arguments.length) return d
    d = +_

    return fisheye
  }

  fisheye.focus = function (_: any) {
    if (!arguments.length) return a
    a = +_

    return fisheye
  }

  fisheye.copy = function () {
    return d3FisheyeScale(scale.copy(), d, a)
  }

  fisheye.nice = scale.nice
  fisheye.ticks = scale.ticks
  fisheye.tickFormat = scale.tickFormat
  fisheye.range = scale.range

  return rebind(fisheye, scale, "domain", "range")
}

export default d3Fisheye
