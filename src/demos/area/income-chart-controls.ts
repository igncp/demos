export const BUTTON_ID = "toggle-voronoi"

export const setupChartControls = (onToggleVoronoiClick: () => void) => {
  const buttonElement = document.getElementById("toggle-voronoi") as HTMLElement

  buttonElement.addEventListener("click", (clickEvent: MouseEvent) => {
    clickEvent.preventDefault()

    onToggleVoronoiClick()
  })
}
