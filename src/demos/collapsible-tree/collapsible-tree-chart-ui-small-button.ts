import { BaseType, Selection, select } from "d3"

type UISmallButtonOpts = {
  dx: string
  fontSize: string
  text: string
}

export class UISmallButton<
  Element extends BaseType,
  Datum,
  ElementAbove extends BaseType
> {
  private readonly className: string
  private readonly initialOpts: UISmallButtonOpts

  public constructor(opts: UISmallButtonOpts) {
    this.className = `small-button-${Math.random().toFixed(6).split(".")[1]}`

    this.initialOpts = opts
  }

  public add({
    container,
    onClick,
  }: {
    container: Selection<Element, Datum, ElementAbove, unknown>
    onClick: (datum: Datum) => void
  }) {
    const {
      initialOpts: { dx, fontSize, text },
    } = this
    const groupSelection = container
      .append("g")
      .style("transform", `translate(${dx},-10px)`)
      .attr("class", this.className)
      .style("display", "none")
      .attr("cursor", "pointer")

    groupSelection
      .append("circle")
      .attr("r", 8)
      .attr("cx", 5)
      .attr("cy", -7)
      .attr("fill", "#ddd")
      .style("font-size", fontSize)
      .text(text)

    const textSelection = groupSelection
      .append("text")
      .style("font-size", fontSize)
      .text(text)

    groupSelection
      .on("mouseenter", () => {
        textSelection.attr("fill", "orange")
      })
      .on("mouseleave", () => {
        textSelection.attr("fill", null)
      })
      .on("click", (...[clickEvent, datum]) => {
        clickEvent.stopPropagation()
        onClick(datum)
      })
  }

  public hide<ContainerElement extends SVGElement>({
    container,
    filterFn,
  }: {
    container: ContainerElement
    filterFn?: (itemData: Datum) => boolean
  }) {
    select<ContainerElement, Datum>(container)
      .selectAll<SVGTextElement, Datum>(`.${this.className}`)
      .style("display", (itemData) =>
        !filterFn || filterFn(itemData) ? "none" : "block"
      )
  }
}
