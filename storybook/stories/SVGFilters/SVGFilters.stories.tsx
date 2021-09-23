import { Selection, select } from "d3"
import React from "react"

import { StoryInfo, createSelectControl } from "../common"

/**
 * Spec: https://drafts.fxtf.org/filter-effects/#FilterPrimitivesOverview
 */

const SHAPE_CONTAINER_ID = "example"
const SVG_ID = "example-svg"

// https://www.w3.org/TR/SVG2/shapes.html
const starPolygon = [
  [350],
  [75, 379],
  [161, 469],
  [161, 397],
  [215, 423],
  [301, 350],
  [250, 277],
  [301, 303],
  [215, 231],
  [161, 321],
  [161],
]

enum FiltersNames {
  BlendExclusion = "blend-exclusion",
  Blur12x12 = "blur12x12",
  Blur2x2 = "blur2x2",
  BlurShadow = "blur-shadow",
  CompositeAnimated = "composite-animated-1",
  DiffuseLightning1 = "diffuse-lightning-1",
  None = "none",
  Sample1 = "sample-1",
  TurbulenceBlue = "turbulence-blue",
}

enum ShapesNames {
  Circle = "circle",
  Rect = "rect",
  Star = "star",
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
  [FiltersNames.BlendExclusion]: ({ id }) => (
    <filter {...commonFilterProps} id={id}>
      <feOffset dx="20" dy="20" in="SourceGraphic" result="offOut" />
      <feBlend in="SourceGraphic" in2="offOut" mode="exclusion" />
    </filter>
  ),
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
  [FiltersNames.CompositeAnimated]: ({ id }) => (
    <filter {...commonFilterProps} id={id}>
      <feTurbulence
        baseFrequency="0.2"
        result="FRACTAL-TEXTURE_10"
        type="fractalNoise"
      />
      <feComposite
        in="FRACTAL-TEXTURE_10"
        in2="SourceAlpha"
        operator="in"
        result="myComposite"
      />
      <feComposite
        in="myComposite"
        in2="SourceGraphic"
        k1="1"
        k2="2"
        k3="0.8"
        k4="-1"
        operator="arithmetic"
        result="noiseComposite"
      >
        <animate
          attributeName="k1"
          dur="4s"
          repeatCount="indefinite"
          values={[1, 4, 1].join(";")}
        />
        <animate
          attributeName="k2"
          dur="2s"
          repeatCount="indefinite"
          values={[1, 4, 1].join(";")}
        />
      </feComposite>
    </filter>
  ),
  [FiltersNames.DiffuseLightning1]: ({ id }) => (
    <filter {...commonFilterProps} id={id}>
      <feDiffuseLighting
        in="SourceGraphic"
        lightingColor="white"
        result="light"
      >
        <fePointLight z="40">
          <animate
            attributeName="x"
            dur="4s"
            repeatCount="indefinite"
            values={[50, 150, 50].join(";")}
          />
          <animate
            attributeName="y"
            dur="3s"
            repeatCount="indefinite"
            values={[20, 70, 20].join(";")}
          />
        </fePointLight>
      </feDiffuseLighting>
      <feComposite
        in="SourceGraphic"
        in2="light"
        k1="1"
        k2="0"
        k3="0"
        k4="0"
        operator="arithmetic"
      />
    </filter>
  ),
  [FiltersNames.None]: () => <g />,
  [FiltersNames.Sample1]: ({ id }) => (
    <filter {...commonFilterProps} filterUnits="userSpaceOnUse" id={id}>
      <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="4" />
      <feOffset dx="4" dy="4" in="blur" result="offsetBlur" />
      <feSpecularLighting
        in="blur"
        lightingColor="#bbbbbb"
        result="specOut"
        specularConstant=".75"
        specularExponent="20"
        surfaceScale="5"
      >
        <fePointLight x="-5000" y="-10000" z="20000" />
      </feSpecularLighting>
      <feComposite
        in="specOut"
        in2="SourceAlpha"
        operator="in"
        result="specOut"
      />
      <feComposite
        in="SourceGraphic"
        in2="specOut"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        operator="arithmetic"
        result="litPaint"
      />
      <feMerge>
        <feMergeNode in="offsetBlur" />
        <feMergeNode in="litPaint" />
      </feMerge>
    </filter>
  ),
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
  const { width } = document.body.getBoundingClientRect()

  select(`#${SVG_ID}`)
    .attr("width", width - 100)
    .attr("height", 300)
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
  [ShapesNames.Star]: (svg) =>
    svg
      .append<SVGElement>("polygon")
      .attr(
        "points",
        starPolygon
          .map((subItem) => subItem.map((subNumber) => subNumber / 2).join(" "))
          .join(", ")
      )
      .attr("fill", "yellow")
      .attr("stroke-width", "2")
      .attr("stroke", "orange"),
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
          "https://www.w3.org/TR/SVG11/filters.html",
          "https://codepen.io/mullany/pens/public",
        ]}
        storyName="SVGFilters"
      />
      <p>
        You can choose a wide options of SVG filters to apply in different
        shapes
      </p>
      <svg id={SVG_ID}>
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

const Common = (props: Props) => <SVGFilters {...props} />

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

export { Common }
