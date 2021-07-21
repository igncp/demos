import { extent } from "d3"

function createFishEyeScale(
  scale: any,
  initialDistortion: number,
  initialFocus: number
) {
  let distortion = initialDistortion
  let focus = initialFocus

  const fishEyeScale = (val: any): number => {
    const x = scale(val)
    const isLeft = x < focus
    const range = extent<number>(scale.range()) as [number, number]
    const min = range[0]
    const max = range[1]

    const m = isLeft ? focus - min : max - focus
    const n = m === 0 ? max - min : m

    const result =
      ((isLeft ? -1 : 1) * n * (distortion + 1)) /
        (distortion + n / Math.abs(x - focus)) +
      focus

    return result
  }

  fishEyeScale.distortion = (val: number) => {
    distortion = val

    return fishEyeScale
  }

  fishEyeScale.focus = (val: number) => {
    focus = val

    return fishEyeScale
  }

  fishEyeScale.copy = () => createFishEyeScale(scale.copy(), distortion, focus)

  fishEyeScale.domain = (...args: any[]) => {
    const result = scale.domain(...args)

    return result === scale ? fishEyeScale : result
  }

  fishEyeScale.range = (...args: any[]) => {
    const result = scale.range(...args)

    return result === scale ? fishEyeScale : result
  }

  fishEyeScale.nice = scale.nice
  fishEyeScale.ticks = scale.ticks
  fishEyeScale.tickFormat = scale.tickFormat

  return fishEyeScale
}

export type FishEyeScale = ReturnType<typeof createFishEyeScale>

// https://github.com/d3/d3-plugins/blob/master/fisheye/fisheye.js
const d3Fisheye = {
  scale(scaleType: any): FishEyeScale {
    return createFishEyeScale(scaleType(), 3, 0)
  },
}

export default d3Fisheye
