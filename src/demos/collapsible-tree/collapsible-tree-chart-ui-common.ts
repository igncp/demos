import { BaseType, Selection } from "d3"

export type Point = {
  x: number
  y: number
}

export type CommonUIProps<Container extends BaseType, NodeDatum> = {
  container: Selection<Container, NodeDatum, Element, unknown>
  getInitialPosition: (node: NodeDatum) => Point
  getPosition: (node: NodeDatum) => Point
  linkDefaultColor: string
  openCloseAnimationDuration: number
}
