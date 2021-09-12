import anime from "animejs"
import { BaseType, Selection, select } from "d3"

import { CommonUIProps } from "./collapsible-tree-chart-ui-common"

type NodeUIOpts<Container extends BaseType, Datum> = CommonUIProps<
  Container,
  Datum
> &
  Readonly<{
    displayRemoveButton: (o: Datum) => boolean
    getNodeId: (o: Datum) => number
    getPointingLinkForNode: (
      o: Datum
    ) => Selection<SVGElement, unknown, SVGElement, unknown>
    getText: (o: Datum) => string
    hasDescendants: (node: Datum) => boolean
  }>

const nodeCircleClass = "node-circle"
const nodeLabelClass = "node-label"
const plusTriggerClass = "plus-trigger"
const minusTriggerClass = "minus-trigger"

const triggerClasses = [plusTriggerClass, minusTriggerClass]

/**
 * Responsible for handle the UI of the node, without any knowledge of the node
 * tree structure (it doesn't know how the children nodes are referenced)
 */
export class NodeUI<Container extends BaseType, Datum> {
  private readonly initialOpts: NodeUIOpts<Container, Datum>
  private readonly nodeG: Selection<SVGGElement, Datum, Element, unknown>
  private readonly hoveredItems = new Set<number>()

  private readonly circleLinkForEffect: Selection<
    SVGCircleElement,
    Datum,
    Element,
    unknown
  >

  public constructor(opts: NodeUIOpts<Container, Datum>) {
    this.initialOpts = opts

    this.nodeG = this.initialOpts.container
      .append("g")
      .attr("pointer-events", "all")

    this.circleLinkForEffect = this.initialOpts.container
      .insert("circle", ":first-child")
      .attr("r", 4)
      .attr("fill", "none")
  }

  public update(opts: {
    getData: () => [Datum[], (o: Datum) => number]
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
      .on("mouseenter", function (...[, focusedTreeNode]) {
        hoveredItems.add(getNodeId(focusedTreeNode))

        select<SVGGElement, Datum>(this)
          .select<SVGCircleElement>("circle")
          .attr("fill", circleDefaultFill)

        triggerClasses.forEach((className) => {
          select<SVGGElement, Datum>(this)
            .select<SVGTextElement>(`.${className}`)
            .style("display", (node) =>
              className !== minusTriggerClass || displayRemoveButton(node)
                ? "block"
                : "none"
            )
        })

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

        triggerClasses.forEach((className) => {
          select<SVGGElement, Datum>(this)
            .select<SVGTextElement>(`.${className}`)
            .style("display", "none")
        })

        const pointingLink = getPointingLinkForNode(focusedTreeNode)

        if (!pointingLink.size()) {
          return
        }

        circleLinkForEffect.attr("fill", "none")

        pointingLink.style("stroke", linkDefaultColor)
        anime.remove(circleLinkForEffect.node())
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

    // this improves the interaction with the trigger buttons to maintain the
    // hover
    nodeEnter
      .append("rect")
      .attr("y", "-25px")
      .attr("x", "-15px")
      .style("fill", "white")
      .attr("height", "15px")
      .attr("width", "30px")

    nodeEnter
      .append("text")
      .attr("class", plusTriggerClass)
      .attr("dy", "-10px")
      .attr("dx", "0px")
      .style("font-size", "20px")
      .style("display", "none")
      .text("+")
      .attr("cursor", "pointer")
      .on("mouseenter", function () {
        select(this).attr("fill", "orange")
      })
      .on("mouseleave", function () {
        select(this).attr("fill", null)
      })
      .on("click", (...[clickEvent, nodeDatum]) => {
        clickEvent.stopPropagation()
        opts.onNodeAdd(nodeDatum)
      })

    nodeEnter
      .append("text")
      .attr("class", minusTriggerClass)
      .attr("dy", "-10px")
      .attr("dx", "-15px")
      .style("font-size", "25px")
      .style("display", "none")
      .text("-")
      .attr("cursor", "pointer")
      .on("mouseenter", function () {
        select(this).attr("fill", "orange")
      })
      .on("mouseleave", function () {
        select(this).attr("fill", null)
      })
      .on("click", (...[clickEvent, nodeDatum]) => {
        clickEvent.stopPropagation()
        opts.onNodeRemove(nodeDatum)
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
