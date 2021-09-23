const BUTTON_ID = "toggle-voronoi"

const setupChartControls = (onToggleVoronoiClick: () => void) => {
  const buttonElement = document.getElementById("toggle-voronoi") as HTMLElement

  buttonElement.addEventListener("click", (clickEvent: MouseEvent) => {
    clickEvent.preventDefault()

    onToggleVoronoiClick()
  })
}

export { BUTTON_ID, setupChartControls }
