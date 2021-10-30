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
  Glitch = "glitch",
  Motion = "motion",
  None = "none",
  Sample1 = "sample-1",
  TurbulenceBlue = "turbulence-blue",
  Waves = "waves",
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
  [FiltersNames.Glitch]: ({ id }) => (
    <filter
      colorInterpolationFilters="sRGB"
      {...commonFilterProps}
      filterUnits="objectBoundingBox"
      id={id}
      primitiveUnits="userSpaceOnUse"
    >
      <feFlood floodColor="white" result="black" />
      <feFlood floodColor="red" result="flood1" />
      <feFlood floodColor="limegreen" result="flood2" />
      <feOffset dx="3" dy="0" in="SourceGraphic" result="off1a" />
      <feOffset dx="2" dy="0" in="SourceGraphic" result="off1b" />
      <feOffset dx="-3" dy="0" in="SourceGraphic" result="off2a" />
      <feOffset dx="-2" dy="0" in="SourceGraphic" result="off2b" />
      <feComposite in="flood1" in2="off1a" operator="in" result="comp1" />
      <feComposite in="flood2" in2="off2a" operator="in" result="comp2" />

      <feMerge result="merge1" width="100%" x="0">
        <feMergeNode in="black" />
        <feMergeNode in="comp1" />
        <feMergeNode in="off1b" />

        <animate
          attributeName="y"
          dur="4s"
          id="y"
          keyTimes="0; 0.362; 0.368; 0.421; 0.440; 0.477; 0.518; 0.564; 0.593; 0.613; 0.644; 0.693; 0.721; 0.736; 0.772; 0.818; 0.844; 0.894; 0.925; 0.939; 1"
          repeatCount="indefinite"
          values="104px; 104px; 30px; 105px; 30px; 2px; 2px; 50px; 40px; 105px; 105px; 20px; 6ßpx; 40px; 104px; 40px; 70px; 10px; 30px; 104px; 102px"
        />

        <animate
          attributeName="height"
          dur="4s"
          id="h"
          keyTimes="0; 0.362; 0.368; 0.421; 0.440; 0.477; 0.518; 0.564; 0.593; 0.613; 0.644; 0.693; 0.721; 0.736; 0.772; 0.818; 0.844; 0.894; 0.925; 0.939; 1"
          repeatCount="indefinite"
          values="10px; 0px; 10px; 30px; 50px; 0px; 10px; 0px; 0px; 0px; 10px; 50px; 40px; 0px; 0px; 0px; 40px; 30px; 10px; 0px; 50px"
        />
      </feMerge>

      <feMerge height="65px" result="merge2" width="100%" x="0" y="60px">
        <feMergeNode in="black" />
        <feMergeNode in="comp2" />
        <feMergeNode in="off2b" />

        <animate
          attributeName="y"
          dur="4s"
          id="y"
          keyTimes="0; 0.055; 0.100; 0.125; 0.159; 0.182; 0.202; 0.236; 0.268; 0.326; 0.357; 0.400; 0.408; 0.461; 0.493; 0.513; 0.548; 0.577; 0.613; 1"
          repeatCount="indefinite"
          values="103px; 104px; 69px; 53px; 42px; 104px; 78px; 89px; 96px; 100px; 67px; 50px; 96px; 66px; 88px; 42px; 13px; 100px; 100px; 104px;"
        />

        <animate
          attributeName="height"
          dur="4s"
          id="h"
          keyTimes="0; 0.055; 0.100; 0.125; 0.159; 0.182; 0.202; 0.236; 0.268; 0.326; 0.357; 0.400; 0.408; 0.461; 0.493; 0.513;  1"
          repeatCount="indefinite"
          values="0px; 0px; 0px; 16px; 16px; 12px; 12px; 0px; 0px; 5px; 10px; 22px; 33px; 11px; 0px; 0px; 10px"
        />
      </feMerge>

      <feMerge>
        <feMergeNode in="SourceGraphic" />

        <feMergeNode in="merge1" />
        <feMergeNode in="merge2" />
      </feMerge>
    </filter>
  ),
  [FiltersNames.Motion]: ({ id }) => (
    <filter id={id} {...commonFilterProps}>
      <feConvolveMatrix
        kernelMatrix="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"
        order="20, 1"
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
  [FiltersNames.Waves]: ({ id }) => (
    <filter
      {...commonFilterProps}
      colorInterpolationFilters="linearRGB"
      id={id}
    >
      <feTurbulence
        baseFrequency="0.01 0.01"
        numOctaves="1"
        result="turbulence"
        seed="1"
        stitchTiles="noStitch"
        type="turbulence"
      >
        <animate
          attributeName="baseFrequency"
          dur="4s"
          repeatCount="indefinite"
          values={["0.01 0.01", "0.01 0.04", "0.04 0.01", "0.01 0.01"].join(
            ";"
          )}
        />
      </feTurbulence>
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        result="displacementMap"
        scale="20"
        xChannelSelector="G"
        yChannelSelector="A"
      />
    </filter>
  ),
}

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
