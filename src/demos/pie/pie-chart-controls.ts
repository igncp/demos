export const BUTTON_ID = "change-data"

const MAX_NEW_VAL = 46
const MIN_NEW_VAL = 2

export const setupChartControls = (updateChart: (newValue: number) => void) => {
  const buttonElement = document.getElementById(BUTTON_ID) as HTMLElement

  buttonElement.addEventListener("click", () => {
    const newSliceValue =
      Math.floor(Math.random() * (MAX_NEW_VAL - MIN_NEW_VAL)) + MIN_NEW_VAL

    updateChart(newSliceValue)
  })
}
