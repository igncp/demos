import { AxisScale, ScaleLinear, extent, scaleLinear } from "d3"

type ScaleFn = typeof scaleLinear
type Scale = ScaleLinear<number, number>

const d3Rebind = <
  MethodArgs extends any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  Method extends string,
  Source extends { [k in Method]: (...args: MethodArgs) => Source },
  Target
>({
  method,
  source,
  target,
}: {
  method: Method
  source: Source
  target: Target
}) =>
  function boundMethod(...args: MethodArgs) {
    const methodResult = source[method](...args)

    return methodResult === source ? target : methodResult
  }

const fishEyeScale = ({
  distortion: initialDistortion,
  focus: initialFocus,
  scale,
}: {
  distortion: number
  focus: number
  scale: Scale
}) => {
  let distortion = initialDistortion
  let focus = initialFocus

  function fisheye(scaleArgs: Parameters<Scale>[0]) {
    const x = scale(scaleArgs)
    const left = x < focus
    const [min, max] = extent<number>(scale.range()) as [number, number]
    let m = left ? focus - min : max - focus

    if (m === 0) {
      m = max - min
    }

    return (
      ((left ? -1 : 1) * m * (distortion + 1)) /
        (distortion + m / Math.abs(x - focus)) +
      focus
    )
  }

  type FisheyeFn = {
    (newValue: number): typeof fisheye
    (): number
  }

  const createFisheyeFn = (cb: (newValue: number) => void): FisheyeFn =>
    ((newValue?: number) => {
      if (typeof newValue === "undefined") {
        return distortion
      }

      cb(newValue)

      return fisheye
    }) as FisheyeFn

  fisheye.distortion = createFisheyeFn((newDistortion) => {
    distortion = +newDistortion
  })

  fisheye.focus = createFisheyeFn((newFocus) => {
    focus = +newFocus
  })

  fisheye.copy = function fisheyeCopy() {
    return fishEyeScale({
      distortion,
      focus,
      scale: scale.copy(),
    })
  }

  fisheye.nice = scale.nice
  fisheye.ticks = scale.ticks
  fisheye.tickFormat = scale.tickFormat

  fisheye.domain = d3Rebind({
    method: "domain",
    source: scale,
    target: fisheye,
  })

  fisheye.range = d3Rebind({
    method: "range",
    source: scale,
    target: fisheye,
  })

  return fisheye
}

const fisheye = {
  scale(scaleType: ScaleFn) {
    return fishEyeScale({
      distortion: 3,
      focus: 0,
      scale: scaleType(),
    })
  },
}

export type FishEyeScale = AxisScale<number> &
  ReturnType<typeof fisheye.scale> &
  Scale

export default fisheye
