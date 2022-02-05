import {
  DATA_SOURCE_SELECT_ID,
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
} from "./ui-constants"

const setupChartControls = ({
  onToggleVoronoiClick,
  onUpdateRandomValue,
  onUpdateSelect,
  selectOptions,
}: {
  onToggleVoronoiClick: () => void
  onUpdateRandomValue: () => void
  onUpdateSelect: (newValue: string) => void
  selectOptions: Array<{ inputValue: string; label: string }>
}) => {
  const dataSourceSelect = document.getElementById(
    DATA_SOURCE_SELECT_ID
  ) as HTMLSelectElement
  const toggleButtonElement = document.getElementById(
    TOGGLE_BUTTON_ID
  ) as HTMLElement
  const updateButtonElement = document.getElementById(
    UPDATE_BUTTON_ID
  ) as HTMLElement

  selectOptions.forEach((...[selectOption, selectOptionIndex]) => {
    const sourceOption = document.createElement("option")

    sourceOption.setAttribute("value", selectOption.inputValue)

    if (selectOptionIndex === 0) {
      sourceOption.setAttribute("selected", "selected")
    }

    sourceOption.innerHTML = selectOption.label

    dataSourceSelect.appendChild(sourceOption)
  })

  dataSourceSelect.addEventListener("change", () => {
    onUpdateSelect(dataSourceSelect.value)
  })

  toggleButtonElement.addEventListener("click", (clickEvent: MouseEvent) => {
    clickEvent.preventDefault()

    onToggleVoronoiClick()
  })

  updateButtonElement.addEventListener("click", (clickEvent: MouseEvent) => {
    clickEvent.preventDefault()

    onUpdateRandomValue()
  })
}

export {
  DATA_SOURCE_SELECT_ID,
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
  setupChartControls,
}
