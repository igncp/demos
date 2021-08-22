export const createRangeControl = ({
  diffMax,
  diffMin,
  initialValue,
  step,
}: {
  diffMax?: number
  diffMin: number
  initialValue: number
  step: number
}) =>
  [
    initialValue,
    {
      control: {
        max: initialValue + (diffMax ?? diffMin),
        min: initialValue - diffMin,
        step,
        type: "range",
      },
    },
  ] as const

export const createSelectControl = <SelectOption>(
  selectOptions: SelectOption[]
) =>
  [
    selectOptions[0],
    {
      control: { type: "select" },
      options: selectOptions,
    },
  ] as const
