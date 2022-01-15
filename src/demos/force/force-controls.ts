import { RADIUS_SELECT_ID } from "./ui-constants"

const radiusOptions = [1, 5, 10, 20, 50]

type Opts = {
  initialRadiusValue: number
  onRadiusChange: (newValue: number) => void
}

export const setupControls = (opts: Opts) => {
  const select = document.getElementById(RADIUS_SELECT_ID) as HTMLSelectElement

  radiusOptions.forEach((optionValue) => {
    const option = document.createElement("option")
    const optionValuePx = `${optionValue}px`

    option.text = optionValuePx
    option.value = optionValue.toFixed() // eslint-disable-line id-denylist

    select.appendChild(option)
  })

  // eslint-disable-next-line id-denylist
  select.value = opts.initialRadiusValue.toFixed()

  select.addEventListener("change", () => {
    opts.onRadiusChange(Number(select.value))
  })
}
