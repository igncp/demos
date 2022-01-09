import { COLOR_METHOD, TYPE_FORM } from "./ui-constants"

enum PartitionType {
  count = "count",
  size = "size",
}

enum ColorMethod {
  depth = "depth",
  id = "id",
}

type FormState = {
  colorMethod: ColorMethod
  partitionType: PartitionType
}

const colorMethodToLabel: { [key in ColorMethod]: string } = {
  [ColorMethod.depth]: "Node depth",
  [ColorMethod.id]: "Node ID",
}

const setupControls = () => {
  const formState: FormState = {
    colorMethod: ColorMethod.id,
    partitionType: PartitionType.count,
  }

  const formEl = document.getElementById(TYPE_FORM) as HTMLFormElement
  const selectEl = document.getElementById(COLOR_METHOD) as HTMLSelectElement

  Object.values(ColorMethod).forEach((...[colorValue]) => {
    const option = document.createElement("option")

    option.setAttribute("value", colorValue)
    option.innerHTML = colorMethodToLabel[colorValue]

    selectEl.appendChild(option)
  })

  // eslint-disable-next-line id-denylist
  selectEl.value = formState.colorMethod

  const getCurrentSelectedRadio = (): PartitionType => {
    const selectedRadio = Array.from(
      formEl.elements as unknown as HTMLInputElement[]
    ).find((formElement: HTMLInputElement) => formElement.checked)

    return selectedRadio!.value as PartitionType
  }

  const getCurrentSelectedOption = () => selectEl.value as ColorMethod

  let handler = () => {}

  formEl.addEventListener("change", () => {
    formState.partitionType = getCurrentSelectedRadio()
    formState.colorMethod = getCurrentSelectedOption()

    handler()
  })

  const onStateChangeHandler = (newHandler: () => void) => {
    handler = newHandler
  }

  return {
    formState,
    onStateChangeHandler,
  }
}

export { ColorMethod, FormState, PartitionType, setupControls }
