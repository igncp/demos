import { BaseType, Selection } from "d3"

type Point = {
  x: number
  y: number
}

type CommonUIProps<Container extends BaseType, NodeDatum> = {
  container: Selection<Container, NodeDatum, Element, unknown>
  getInitialPosition: (node: NodeDatum) => Point
  getPosition: (node: NodeDatum) => Point
  linkDefaultColor: string
  openCloseAnimationDuration: number
}

export { CommonUIProps, Point }
