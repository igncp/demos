import { BaseType, Link, Selection, linkHorizontal } from "d3"

import { CommonUIProps, Point } from "./collapsible-tree-chart-ui-common"

const treeLinkPathClass = "tree-link"

type DiagonalLink = { source: Point; target: Point }

type LinkUIOpts<Container extends BaseType, NodeDatum> = CommonUIProps<
  Container,
  NodeDatum
>

/**
 * Responsible for handle the UI of the link, without any knowledge of the node
 * tree structure, with a constraint on the link data.
 */
export class LinkUI<
  Container extends BaseType,
  LinkDatum extends DiagonalLink,
  NodeDatum
> {
  private readonly initialOpts: LinkUIOpts<Container, NodeDatum>
  private readonly linkG: Selection<SVGGElement, NodeDatum, Element, unknown>
  private readonly linkPath: Link<unknown, DiagonalLink, Point>

  public constructor(opts: LinkUIOpts<Container, NodeDatum>) {
    this.initialOpts = opts

    this.linkPath = linkHorizontal<DiagonalLink, Point>()
      .x((diagonalNode) => diagonalNode.y)
      .y((diagonalNode) => diagonalNode.x)

    this.linkG = opts.container
      .append("g")
      .attr("fill", "none")
      .attr("stroke", opts.linkDefaultColor)
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
  }

  public update(opts: {
    getData: () => [LinkDatum[], (o: LinkDatum) => number]
    source: NodeDatum
  }) {
    const {
      initialOpts: {
        getInitialPosition,
        getPosition,
        openCloseAnimationDuration,
      },
      linkG,
      linkPath,
    } = this
    const { getData, source } = opts

    const linkSelection = linkG
      .selectAll<SVGPathElement, LinkDatum>("path")
      .data(...getData())

    const linkEnter = linkSelection
      .enter()
      .append("path")
      .attr("class", treeLinkPathClass)
      .attr("d", () => {
        const diagonalNode = getInitialPosition(source)
        const diagonalLink = { source: diagonalNode, target: diagonalNode }

        return linkPath(diagonalLink)
      })

    linkSelection
      .merge(linkEnter)
      .transition()
      .duration(openCloseAnimationDuration)
      .attr("d", (link) => linkPath(link))

    linkSelection
      .exit()
      .transition()
      .duration(openCloseAnimationDuration)
      .remove()
      .attr("d", () => {
        const diagonalNode = getPosition(source)
        const diagonalLink = { source: diagonalNode, target: diagonalNode }

        return linkPath(diagonalLink)
      })
  }

  public getSelection() {
    return this.linkG.selectAll<SVGPathElement, LinkDatum>(
      `.${treeLinkPathClass}`
    )
  }
}
