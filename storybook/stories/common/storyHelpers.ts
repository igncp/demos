export const createRangeControl = (
  val: number,
  step: number,
  diffMin: number,
  diffMax?: number
) =>
  [
    val,
    {
      control: {
        max: val + (diffMax ?? diffMin),
        min: val - diffMin,
        step,
        type: "range",
      },
    },
  ] as const
