import { extent } from "d3"

function createFishEyeScale({
  initialDistortion,
  initialFocus,
  scale,
}: {
  initialDistortion: number
  initialFocus: number
  scale: any // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  let distortion = initialDistortion
  let focus = initialFocus

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fishEyeScale = (xValue: any): number => {
    const x = scale(xValue)
    const isLeft = x < focus
    const range = extent<number>(scale.range()) as [number, number]
    const min = range[0]
    const max = range[1]

    const focusDiff = isLeft ? focus - min : max - focus
    const diff = focusDiff === 0 ? max - min : focusDiff

    return (
      ((isLeft ? -1 : 1) * diff * (distortion + 1)) /
        (distortion + diff / Math.abs(x - focus)) +
      focus
    )
  }

  fishEyeScale.distortion = (newDistortion: number) => {
    distortion = newDistortion

    return fishEyeScale
  }

  fishEyeScale.focus = (newFocus: number) => {
    focus = newFocus

    return fishEyeScale
  }

  fishEyeScale.copy = () =>
    createFishEyeScale({
      initialDistortion,
      initialFocus,
      scale: scale.copy(),
    })

  fishEyeScale.domain = (...args: [[number, number]] | []) => {
    const domainResult = scale.domain(...args)

    return domainResult === scale ? fishEyeScale : domainResult
  }

  fishEyeScale.range = (...args: [[number, number]] | []) => {
    const rangeResult = scale.range(...args)

    return rangeResult === scale ? fishEyeScale : rangeResult
  }

  fishEyeScale.nice = scale.nice
  fishEyeScale.ticks = scale.ticks
  fishEyeScale.tickFormat = scale.tickFormat

  return fishEyeScale
}

export type FishEyeScale = ReturnType<typeof createFishEyeScale>

// https://github.com/d3/d3-plugins/blob/master/fisheye/fisheye.js
const d3Fisheye = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale(createScale: any): FishEyeScale {
    return createFishEyeScale({
      initialDistortion: 3,
      initialFocus: 0,
      scale: createScale(),
    })
  },
}

export default d3Fisheye
