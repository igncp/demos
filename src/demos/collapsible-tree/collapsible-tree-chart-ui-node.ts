import anime from "animejs"
import { BaseType, Selection, select } from "d3"

import { CommonUIProps } from "./collapsible-tree-chart-ui-common"
import { UISmallButton } from "./collapsible-tree-chart-ui-small-button"

type UINodeOpts<Container extends BaseType, Datum> = CommonUIProps<
  Container,
  Datum
> &
  Readonly<{
    displayRemoveButton: (nodeData: Datum) => boolean
    getNodeId: (nodeData: Datum) => number
    getPointingLinkForNode: (
      nodeData: Datum
    ) => Selection<SVGElement, unknown, SVGElement, unknown>
    getText: (nodeData: Datum) => string
    hasDescendants: (node: Datum) => boolean
  }>

const nodeCircleClass = "node-circle"
const nodeLabelClass = "node-label"

/**
 * Responsible for handle the UI of the node, without any knowledge of the node
 * tree structure (it doesn't know how the children nodes are referenced)
 */
export class UINode<Container extends BaseType, Datum> {
  private readonly initialOpts: UINodeOpts<Container, Datum>
  private readonly nodeG: Selection<SVGGElement, Datum, Element, unknown>
  private readonly hoveredItems = new Set<number>()

  private readonly plusButton: UISmallButton<SVGGElement, Datum, SVGGElement>
  private readonly minusButton: UISmallButton<SVGGElement, Datum, SVGGElement>

  private readonly circleLinkForEffect: Selection<
    SVGCircleElement,
    Datum,
    Element,
    unknown
  >

  public constructor(opts: UINodeOpts<Container, Datum>) {
    this.initialOpts = opts

    this.nodeG = this.initialOpts.container
      .append("g")
      .attr("pointer-events", "all")

    this.circleLinkForEffect = this.initialOpts.container
      .insert("circle", ":first-child")
      .attr("r", 4)
      .attr("fill", "none")

    this.plusButton = new UISmallButton({
      dx: "0px",
      fontSize: "20px",
      text: "+",
    })

    this.minusButton = new UISmallButton({
      dx: "-15px",
      fontSize: "25px",
      text: "-",
    })
  }

  public update(opts: {
    getData: () => [Datum[], (nodeData: Datum) => number]
    onNodeAdd: (node: Datum) => void
    onNodeClick: (node: Datum) => void
    onNodeRemove: (node: Datum) => void
    source: Datum
  }) {
    const { source } = opts
    const {
      circleLinkForEffect,
      hoveredItems,
      initialOpts: {
        displayRemoveButton,
        getInitialPosition,
        getNodeId,
        getPointingLinkForNode,
        getPosition,
        getText,
        hasDescendants,
        linkDefaultColor,
      },
    } = this

    const nodeSelection = this.nodeG
      .selectAll<SVGGElement, Datum>("g")
      .data(...opts.getData())

    const circleDefaultFill = (node: Datum) => {
      if (hasDescendants(node)) {
        return hoveredItems.has(getNodeId(node)) ? "blue" : "green"
      }

      return "red"
    }

    const nodeEnter = nodeSelection
      .enter()
      .append("g")
      .attr("transform", () => {
        const position = getInitialPosition(source)

        return `translate(${position.y},${position.x})`
      })
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (...[, treeNode]) => {
        opts.onNodeClick(treeNode)
      })

    nodeEnter
      .append("circle")
      .attr("r", 10)
      .attr("class", nodeCircleClass)
      .attr("stroke-width", 10)

    const textDX = 10

    nodeEnter
      .append("text")
      .attr("class", nodeLabelClass)
      .attr("dy", "5px")
      .style("font-size", "20px")
      .text(getText)
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white")

    const { minusButton, plusButton } = this

    const buttons = [plusButton, minusButton]

    const showButtonsIfNecessary = (container: SVGGElement) => {
      buttons.forEach((button) => {
        button.hide({
          container,
          filterFn: (node) =>
            button === minusButton && !displayRemoveButton(node),
        })
      })
    }

    nodeEnter
      .on("mouseenter", function (...[, focusedTreeNode]) {
        hoveredItems.add(getNodeId(focusedTreeNode))

        select<SVGGElement, Datum>(this)
          .select<SVGCircleElement>("circle")
          .attr("fill", circleDefaultFill)

        showButtonsIfNecessary(this)

        const pointingLink = getPointingLinkForNode(focusedTreeNode)

        if (!pointingLink.size()) {
          return
        }

        pointingLink.style("stroke", "orange")
        circleLinkForEffect.attr("fill", "orange")

        const animePath = anime.path(pointingLink.node() as SVGElement)

        anime({
          duration: 500,
          easing: "easeInOutSine",
          endDelay: 1000,
          loop: true,
          targets: circleLinkForEffect.node(),
          translateX: animePath("x"),
          translateY: animePath("y"),
        })
      })
      .on("mouseleave", function (...[, focusedTreeNode]) {
        hoveredItems.delete(getNodeId(focusedTreeNode))

        select<SVGGElement, Datum>(this)
          .select<SVGCircleElement>("circle")
          .attr("fill", circleDefaultFill)

        buttons.forEach((button) => {
          button.hide({
            container: this,
          })
        })

        const pointingLink = getPointingLinkForNode(focusedTreeNode)

        if (!pointingLink.size()) {
          return
        }

        circleLinkForEffect.attr("fill", "none")

        pointingLink.style("stroke", linkDefaultColor)
        anime.remove(circleLinkForEffect.node())
      })

    nodeSelection
      .merge(nodeEnter)
      .transition()
      .duration(this.initialOpts.openCloseAnimationDuration)
      .attr("transform", (treeNode) => {
        const position = getPosition(treeNode)

        return `translate(${position.y},${position.x})`
      })
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)

    const groupsToUpdate = [nodeSelection, nodeEnter]

    groupsToUpdate.forEach((nodeGroup) => {
      plusButton.add({
        container: nodeGroup,
        onClick: (nodeDatum) => {
          opts.onNodeAdd(nodeDatum)
        },
      })

      minusButton.add({
        container: nodeGroup,
        onClick: (nodeDatum) => {
          opts.onNodeRemove(nodeDatum)
        },
      })

      nodeGroup.each(function (nodeDatum) {
        const isHovered = hoveredItems.has(getNodeId(nodeDatum))

        if (isHovered) {
          showButtonsIfNecessary(this)
        }
      })

      nodeGroup.attr("cursor", (treeNode) =>
        hasDescendants(treeNode) ? "pointer" : "default"
      )

      nodeGroup
        .selectAll<SVGCircleElement, Datum>(`.${nodeCircleClass}`)
        .attr("fill", circleDefaultFill)

      nodeGroup
        .selectAll<SVGCircleElement, Datum>(`.${nodeLabelClass}`)
        .attr("dx", (treeNode) =>
          hasDescendants(treeNode) ? `-${textDX}px` : `${textDX}px`
        )
        .attr("x", (treeNode) => (hasDescendants(treeNode) ? -6 : 6))
        .attr("text-anchor", (treeNode) =>
          hasDescendants(treeNode) ? "end" : "start"
        )
    })

    const sourcePosition = getPosition(source)

    nodeSelection
      .exit()
      .transition()
      .duration(this.initialOpts.openCloseAnimationDuration)
      .remove()
      .attr("transform", `translate(${sourcePosition.y},${sourcePosition.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
  }
}
