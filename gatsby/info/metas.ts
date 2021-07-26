import { Meta } from "../../src/common"

import { D3JS } from "./d3js"
import { Raphael } from "./raphael"

type Metas = {
  d3js: Record<keyof D3JS, Meta>
  home: Meta
  raphael: Record<keyof Raphael, Meta>
}

const metas: Metas = {
  d3js: {
    area: {
      description:
        "Area Chart example, using D3.js, with a transparent Voronoi overlay that gives the functionality know fast the nearest point to the mouse.",
    },
    bars: {
      description:
        "Bar Chart example with a traslation interval, a custom color scale and dynamic entry of new data. You can also see how to animate an axis change.",
    },
    bubbles: {
      description:
        "Bubbles Chart example with NV3D as D3.js extension, using data from the Nike API, and with a depurated style, an horizontal axis and other color scheme.",
    },
    chord: {
      description:
        "Chord Chart example using D3.js, which has a different color scheme with a color for each country, and a special drop shadow filter for a 3D effect.",
    },
    "collapsible-tree": {
      description:
        "Collapsible Tree example using D3.js, with circular nodes and styled links. With transitions, it manages the text placing depending if the node is expanded.",
    },
    "concentric-circles": {
      description:
        "Concentric circles example using D3.js, with a non repeated series of data and with a new style that heavily uses the svg drop-shadow type filter.",
    },
    "energy-sankey": {
      description: "",
    },
    "fish-eye": {
      description:
        "Fisheye Chart example using D3.js, with the Fisheye plugin. It has a more depurated style, and the ability to stop the scale changes when it's clicked.",
    },
    force: {
      description:
        "Force Chart example using D3.js with two source files of data, that shows how a process with several cycles and paths can be represented.",
    },
    icosahedron: {
      description:
        "Example using D3.js of a 3D geometric figure, which has each face with a different color using a color scale and a sinusoidal animated movement.",
    },
    "map-distorsions": {
      description:
        "Cuadruple variable example using D3.js, with a colored chart and four axis that are connected by lines and with an improved and depurated style.",
    },
    "mareys-schedule": {
      description:
        "Trains schedule example using D3.js, with San Francisco as example, and with the addition of a translucent tooltip and a 3D style.",
    },
    "meteorites-map": {
      description:
        "World map chart with information about meteorite landings. It uses D3, animejs and other libraries, and it is highly interactive. It also informs about each meteorite properties like the name or classification.",
    },
    "multiline-voronoi": {
      description:
        "Multiline chart example using D3.js, with Voronoi functionality and the ability to show a single line after it is clicked. The label and style are also changed.",
    },
    partition: {
      description:
        "Radial treemap example using D3.js, with data from a partition, where labels, mouse events and titles are added.",
    },
    pie: {
      description:
        "Pie chart example using D3.js, with an animated transition and a random change of values to show how to animate between states.",
    },
    "spain-map": {
      description:
        "Example of a geographic map using D3.js, where some styles have been added to give it a 3D effect.",
    },
    timeline: {
      description:
        "Example of historical timeline using D3.js, where a legend is place to ease the navigation, as well as a more depurated style with tooltips.",
    },
    "trend-line": {
      description: "Example of trend-line using D3.js, with extra animations.",
    },
    vectors: {
      description:
        "Not actually a chart, but the representation of pointing vectors, with the possibility of creation and movement, made with D3.js",
    },
    "weekly-heatmap": {
      description:
        "Heatmap chart example using D3.js, very similar to the one displayed in the GitHub site, with a few additions from the original.",
    },

    "world-map": {
      description:
        "Example of world map using D3.js, with the zoom functionality and also the possibility to unzoom. The color scale is changed, among other properties.",
    },
  },
  home: {
    description:
      "HTML data visualization demos for the web, rewritten and extended. Using TypeScript with libraries like d3js, Raphael, animejs or jQuery UI, rendering SVG or Canvas elements.",
  },
  raphael: {
    "bars-3dimensional": {
      description: "",
    },
    "circular-arcs": {
      description:
        "Circular Arcs example, using Raphaël, which is not bound to any data but it would be easy to. It shows how to create a semicircle and the hover functionality.",
    },
    "moving-line": {
      description:
        "Moving Line example, using Raphaël, with some important modifications like the path line, the exclusion of the axis (is an image), or the addition of tites.",
    },
  },
}

export default metas
