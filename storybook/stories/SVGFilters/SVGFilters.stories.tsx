import { Selection, select } from "d3"
import React from "react"

import { StoryInfo, createSelectControl } from "../common"

const SHAPE_CONTAINER_ID = "example"

enum FiltersNames {
  Blur12x12 = "blur12x12",
  Blur2x2 = "blur2x2",
  BlurShadow = "blur-shadow",
  None = "none",
  TurbulenceBlue = "turbulence-blue",
}

enum ShapesNames {
  Circle = "circle",
  Rect = "rect",
}

type Props = {
  filterName: FiltersNames
  shapeName: ShapesNames
}

type FiltersObj = { [key in FiltersNames]: React.FC<{ id: FiltersNames }> }

const commonFilterProps = {
  height: "300%",
  width: "300%",
  x: "-100%",
  y: "-100%",
} as const

/* eslint-disable react/display-name */
const filtersObj: FiltersObj = {
  [FiltersNames.Blur12x12]: ({ id }) => (
    <filter {...commonFilterProps} id={id}>
      <feGaussianBlur stdDeviation="12 12" />
    </filter>
  ),
  [FiltersNames.Blur2x2]: ({ id }) => (
    <filter {...commonFilterProps} id={id}>
      <feGaussianBlur stdDeviation="2 2" />
    </filter>
  ),
  [FiltersNames.BlurShadow]: ({ id }) => (
    <filter {...commonFilterProps} id={id}>
      <feGaussianBlur stdDeviation="7 5" />
      <feDropShadow
        dx="15"
        dy="15"
        floodColor="#777"
        floodOpacity="0.25"
        stdDeviation="5"
      />
    </filter>
  ),
  [FiltersNames.None]: () => <g />,
  [FiltersNames.TurbulenceBlue]: ({ id }) => (
    <filter {...commonFilterProps} id={id}>
      <feTurbulence
        baseFrequency=".05,.004"
        height="200%"
        numOctaves="4"
        result="FRACTAL-TEXTURE_10"
        seed="0"
        type="fractalNoise"
        width="200%"
      />
      <feComposite
        in="FRACTAL-TEXTURE_10"
        in2="SourceAlpha"
        operator="in"
        result="myComposite"
      />
      <feColorMatrix
        in="myComposite"
        type="matrix"
        values="0   0   0   0   0
                0   0   0   0   0
                0   0   0   0   1
                0   0   0   0.5 0"
      />
    </filter>
  ),
}
/* eslint-enable react/display-name */

const filters = Object.values(FiltersNames).map((filterName: FiltersNames) => ({
  comp: filtersObj[filterName],
  id: filterName,
}))

const setupSVG = () => {
  const container = document.getElementById(SHAPE_CONTAINER_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()

  select(`#${SHAPE_CONTAINER_ID}`).text("").append("svg").attr("width", width)
}

type GetShape = {
  [key in ShapesNames]: (
    svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
  ) => Selection<SVGElement, unknown, HTMLElement, unknown>
}

const getShape: GetShape = {
  [ShapesNames.Circle]: (svg) => {
    const radius = 50
    const padding = 20

    return svg
      .append<SVGElement>("circle")
      .attr("fill", "green")
      .attr("r", radius)
      .attr("cx", radius + padding)
      .attr("cy", radius + padding)
  },
  [ShapesNames.Rect]: (svg) =>
    svg
      .append<SVGElement>("rect")
      .attr("width", 200)
      .attr("height", 80)
      .attr("x", 20)
      .attr("y", 20)
      .attr("fill", "blue"),
}

const demo = ({ filterName, shapeName }: Props) => {
  setupSVG()

  const svg = select<SVGGElement, unknown>(`#${SHAPE_CONTAINER_ID}`).text("")
  const shape = getShape[shapeName](svg)

  shape.style(
    "filter",
    filterName === FiltersNames.None ? "" : `url(#${filterName})`
  )
}

const SVGFilters = (props: Props) => {
  React.useEffect(() => {
    demo(props)
  }, [props])

  return (
    <div>
      <StoryInfo
        source={[
          "https://alligator.io/svg/svg-filters/",
          "https://www.smashingmagazine.com/2015/05/why-the-svg-filter-is-awesome/",
        ]}
        storyName="SVGFilters"
      />
      <p>
        You can choose a wide options of SVG filters to apply in different
        shapes
      </p>
      <svg>
        <g>
          {filters.map(({ comp: Filter, id }) => (
            <Filter id={id} key={id} />
          ))}
        </g>
        <g id={SHAPE_CONTAINER_ID} />
      </svg>
    </div>
  )
}

const [filtersArgs, filtersControls] = createSelectControl(
  Object.values(FiltersNames)
)
const [shapesArgs, shapesControls] = createSelectControl(
  Object.values(ShapesNames)
)

export const Common = (props: Props) => <SVGFilters {...props} />

const commonArgs: Props = {
  filterName: filtersArgs,
  shapeName: shapesArgs,
}

Common.args = commonArgs

export default {
  argTypes: {
    filterName: filtersControls,
    shapeName: shapesControls,
  },
  component: SVGFilters,
  title: "SVG/Filters",
}
