import { TOGGLE_BUTTON_ID, UPDATE_BUTTON_ID } from "./ui-constants"

const setupChartControls = ({
  onToggleVoronoiClick,
  onUpdateRandomValue,
}: {
  onToggleVoronoiClick: () => void
  onUpdateRandomValue: () => void
}) => {
  const toggleButtonElement = document.getElementById(
    TOGGLE_BUTTON_ID
  ) as HTMLElement
  const updateButtonElement = document.getElementById(
    UPDATE_BUTTON_ID
  ) as HTMLElement

  toggleButtonElement.addEventListener("click", (clickEvent: MouseEvent) => {
    clickEvent.preventDefault()

    onToggleVoronoiClick()
  })

  updateButtonElement.addEventListener("click", (clickEvent: MouseEvent) => {
    clickEvent.preventDefault()

    onUpdateRandomValue()
  })
}

export { TOGGLE_BUTTON_ID, UPDATE_BUTTON_ID, setupChartControls }
