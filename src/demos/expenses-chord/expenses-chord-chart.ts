import {
  Chord,
  ChordGroup,
  arc as arcD3,
  chordDirected,
  descending as descendingD3,
  easeCircle,
  interpolate,
  ribbonArrow as ribbonArrowD3,
  ribbon as ribbonD3,
  scaleOrdinal,
  schemeTableau10,
  select,
  zoom,
} from "d3"
import { v1 as uuid } from "uuid"

import * as styles from "./expenses-chord.module.css"

const height = 800

export enum DisplayType {
  Source = "source",
  Target = "target",
}

export enum RibbonType {
  Arrow = "arrow",
  Common = "common",
}

type ChartState = {
  lastFocused: string | null
}

const durations = {
  ribbonAnimation: 1000,
  zoom: 500,
}

const easingFn = easeCircle

const zoomed = function (this: Element, zoomEvent: any) {
  select(this)
    .transition()
    .duration(durations.zoom)
    .attr("transform", zoomEvent.transform)
}

export type ChartConfig = {
  chordGroupsIds: string[]
  getChordGroupTitle: (groupId: string) => string
  getChordMatrix: () => number[][]
  getChordTitle: (
    sourceIndex: number,
    targetIndex: number,
    sourceValue: number,
    targetValue: number
  ) => string
  getDisplayTypeOnGroupClick: (chordGroupId: string) => DisplayType
  getRibbonGroupIdColor: (
    sourceGroupId: string,
    targetGroupId: string
  ) => string
  getRibbonType: () => RibbonType
  rootElId: string
}

export const renderChart = (chartConfig: ChartConfig) => {
  const { rootElId } = chartConfig

  const chartState: ChartState = {
    lastFocused: null,
  }

  const { chordGroupsIds } = chartConfig

  const color = scaleOrdinal(chordGroupsIds, schemeTableau10)

  const { width } = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect()

  const innerRadius = Math.min(width, height) * 0.5 - 20
  const outerRadius = innerRadius + 20

  const ribbonCommon = (r: any) =>
    r.radius(innerRadius - 0.5).padAngle(1 / innerRadius)

  const ribbonArrow = ribbonCommon(ribbonArrowD3())
  const ribbon = ribbonCommon(ribbonD3())

  const zoomBehavior = zoom()
    .extent([
      [0, 0],
      [width / 2, height / 2],
    ])
    .on("end", zoomed)

  const totalHeight = height + 50

  const svg = select(`#${rootElId}`)
    .attr("class", styles.chartWrapper)
    .append("svg")
    .attr("width", width)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${totalHeight / 2})`)
    .append("g")
    .call(zoomBehavior as any)
    .on("dblclick.zoom", null)

  // this rect is to allow zooming
  svg
    .append("rect")
    .attr("fill", "#fff")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", `translate(-${width / 2}, -${totalHeight / 2})`)

  const textId = uuid()

  const chord = chordDirected()
    .padAngle(12 / innerRadius)
    .sortSubgroups(descendingD3)
    .sortChords(descendingD3)

  svg
    .append("path")
    .attr("fill", "none")
    .attr("id", textId)
    .attr(
      "d",
      arcD3()({
        endAngle: 2 * Math.PI,
        innerRadius: 0,
        outerRadius,
        startAngle: 0,
      }) as string
    )

  const arc = arcD3<d3.ChordGroup>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  const ribbonContainer = svg.append("g").attr("fill-opacity", 0.75)
  const groupContainer = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)

  const renderItems = () => {
    const usedRibbon =
      chartConfig.getRibbonType() === RibbonType.Common ? ribbon : ribbonArrow

    const matrix = chartConfig.getChordMatrix()
    const chords = chord(matrix)

    const initialRibbonsData = ribbonContainer
      .selectAll<SVGPathElement, Chord>(`.${styles.ribbon}`)
      .data()
      .reduce((acc, ribbonNode) => {
        acc[
          `${ribbonNode.source.index}_${ribbonNode.target.index}`
        ] = ribbonNode

        return acc
      }, {} as { [k: string]: Chord | undefined })

    const fillRibbon = (d: Chord) =>
      color(
        chartConfig.getRibbonGroupIdColor(
          chordGroupsIds[d.source.index],
          chordGroupsIds[d.target.index]
        )
      )

    const ribbons = ribbonContainer
      .selectAll<SVGPathElement, Chord>(`.${styles.ribbon}`)
      .data<Chord>(chords, (d) => `${d.source.index}_${d.target.index}`)
      .join(
        (enter) => {
          const el = enter
            .append("path")
            .attr("class", styles.ribbon)
            .attr("fill", fillRibbon)
            .transition()
            .duration(durations.ribbonAnimation)
            .attrTween("d", (finalRibbon) => {
              const initialRibbon = {
                source: {
                  endAngle: 0,
                  startAngle: 0,
                },
                target: {
                  endAngle: 0,
                  startAngle: 0,
                },
              }
              const interpolateSource = interpolate(
                initialRibbon.source,
                finalRibbon.source
              )
              const interpolateTarget = interpolate(
                initialRibbon.target,
                finalRibbon.target
              )

              return (t) => {
                const interpolated = {
                  source: interpolateSource(t),
                  target: interpolateTarget(t),
                }

                return usedRibbon(interpolated)
              }
            })

          return el
        },
        (update) => {
          update
            .transition()
            .duration(durations.ribbonAnimation)
            .attr("fill", fillRibbon)
            .attrTween("d", (finalRibbon) => {
              const {
                [`${finalRibbon.source.index}_${finalRibbon.target.index}`]: initialRibbon,
              } = initialRibbonsData

              if (!initialRibbon) {
                return () => usedRibbon(finalRibbon)
              }

              const interpolateSource = interpolate(
                initialRibbon.source,
                finalRibbon.source
              )
              const interpolateTarget = interpolate(
                initialRibbon.target,
                finalRibbon.target
              )

              return (t) => {
                const interpolated = {
                  source: interpolateSource(t),
                  target: interpolateTarget(t),
                }

                return usedRibbon(interpolated)
              }
            })

          return update
        }
      )

    ribbons
      .attr("title", (d) =>
        chartConfig.getChordTitle(
          d.source.index,
          d.target.index,
          d.source.value,
          d.target.value
        )
      )
      .on("click", function (_e, d) {
        const el = select(this)
        const chordGroupId = `${chordGroupsIds[d.source.index]}_${
          chordGroupsIds[d.target.index]
        }`

        if (chartState.lastFocused === chordGroupId) {
          ribbons.attr("display", "block")
          chartState.lastFocused = null
        } else {
          ribbons.attr("display", "none")
          el.attr("display", "block")
          chartState.lastFocused = chordGroupId
        }
      })

    $(`.${styles.ribbon}`).tooltip({
      track: true,
    })

    const getGroupText = (d: ChordGroup) => {
      if (d.endAngle - d.startAngle < 0.07) {
        return ""
      }

      return chartConfig.getChordGroupTitle(chordGroupsIds[d.index])
    }

    const initialGroupData = groupContainer
      .selectAll(`.${styles.chordGroup}`)
      .data()

    groupContainer
      .selectAll<SVGGElement, ChordGroup>(`.${styles.chordGroup}`)
      .data<ChordGroup>(chords.groups, (chordGroup) => chordGroup.index)
      .join(
        (enter) => {
          const el = enter
            .append("g")
            .attr("class", styles.chordGroup)
            .attr("title", (d) =>
              chartConfig.getChordGroupTitle(chordGroupsIds[d.index])
            )

          el.append("path")
            .attr("class", "group-path")
            .transition()
            .duration(durations.ribbonAnimation)
            .ease(easingFn)
            .attrTween("d", (finalGroup) => {
              const interpolateFn = interpolate<ChordGroup>(
                {
                  ...finalGroup,
                  endAngle: 0,
                  startAngle: 0,
                },
                finalGroup
              )

              return (t) => arc(interpolateFn(t))!
            })
            .attr("fill", (d) => color(chordGroupsIds[d.index]))
            .attr("stroke", "#fff")

          el.append("text")
            .attr("dy", -3)
            .append("textPath")
            .attr("xlink:href", `#${textId}`)
            .attr("class", styles.groupText)
            .text(getGroupText)
            .transition()
            .duration(durations.ribbonAnimation)
            .ease(easingFn)
            .attr("startOffset", (d) => d.startAngle * outerRadius)

          el.on("click", (_e, d) => {
            const { [d.index]: chordGroupId } = chordGroupsIds
            const latestRibbons = ribbonContainer.selectAll<
              SVGPathElement,
              Chord
            >(`.${styles.ribbon}`)

            if (chartState.lastFocused === chordGroupId) {
              latestRibbons.attr("display", () => "block")
              chartState.lastFocused = null

              return
            }

            chartState.lastFocused = chordGroupId

            if (
              chartConfig.getDisplayTypeOnGroupClick(chordGroupId) ===
              DisplayType.Source
            ) {
              latestRibbons.attr("display", (d2) =>
                d2.source.index === d.index ? "block" : "none"
              )

              return
            }

            latestRibbons.attr("display", (d2) =>
              d2.target.index === d.index ? "block" : "none"
            )
          })

          $(`.${styles.chordGroup}`).tooltip({
            track: true,
          })

          return el
        },
        (update) => {
          update
            .select(".group-path")
            .transition()
            .duration(durations.ribbonAnimation)
            .attrTween("d", (finalGroup, idx) => {
              const { [idx]: initialGroup } = initialGroupData
              const interpolateFn = interpolate(initialGroup, finalGroup)

              return (t) => arc(interpolateFn(t)) as string
            })

          update
            .select(`.${styles.groupText}`)
            .text(getGroupText)
            .transition()
            .duration(durations.ribbonAnimation)
            .attr("startOffset", (d) => d.startAngle * outerRadius)

          return update
        },
        (exit) => exit.remove()
      )
      .attr("class", styles.chordGroup)
  }

  renderItems()

  return {
    renderItems,
  }
}
