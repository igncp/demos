import { TechItem } from "./tech-data-model"

const BUTTON_ID = "change-data"

const MAX_NEW_VAL_UPDATE = 45
const MIN_NEW_VAL_UPDATE = 20

const setupChartControls = ({
  getChartValues,
  onUpdateChart,
}: {
  getChartValues: () => TechItem[]
  onUpdateChart: (opts: { newValue: number; newValueIndex: number }) => void
}) => {
  const buttonElement = document.getElementById(BUTTON_ID) as HTMLElement

  buttonElement.addEventListener("click", () => {
    const techItemsValues = getChartValues().map((techItem) =>
      techItem.getValue()
    )
    const { length: techItemsCount } = techItemsValues
    const randomItemIndex = Math.floor(Math.random() * techItemsCount)

    const randomUpdate =
      Math.floor(Math.random() * (MAX_NEW_VAL_UPDATE - MIN_NEW_VAL_UPDATE)) +
      MIN_NEW_VAL_UPDATE
    const randomUpdateSign = Math.random() < 0.5 ? -1 : 1

    const newValue =
      techItemsValues[randomItemIndex] + randomUpdate * randomUpdateSign

    onUpdateChart({
      newValue: newValue >= 0 ? newValue : randomUpdate,
      newValueIndex: randomItemIndex,
    })
  })
}

export { BUTTON_ID, setupChartControls }
