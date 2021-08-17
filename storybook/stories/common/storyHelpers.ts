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

export const createSelectControl = <A>(vals: A[]) =>
  [
    vals[0],
    {
      control: { type: "select" },
      options: vals,
    },
  ] as const
