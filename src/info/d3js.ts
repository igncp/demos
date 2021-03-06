// @TODO: move to gatsby config dir

const getCommonItems = (packageName: string) => [
  [
    `${packageName} API reference`,
    `https://github.com/d3/${packageName}#api-reference`,
  ],
  [
    `${packageName} Types`,
    `https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/${packageName}/index.d.ts`,
  ],
]

const d3EaseItems = [
  ...getCommonItems("d3-ease"),
  [
    "d3-ease functions examples",
    "https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe",
  ],
]
const d3TransitionItems = getCommonItems("d3-transition")
const d3HierarchyItems = getCommonItems("d3-hierarchy")
const d3InterpolateItems = getCommonItems("d3-interpolate")
const d3ScaleChromaticItems = getCommonItems("d3-scale-chromatic")
const d3ShapeItems = getCommonItems("d3-shape")
const d3FetchItems = getCommonItems("d3-fetch")
const d3SelectionItems = getCommonItems("d3-selection")
const d3AxisItems = getCommonItems("d3-axis")
const d3ScaleItems = getCommonItems("d3-scale")
const d3DelaunayItems = [
  ...getCommonItems("d3-delaunay"),
  [
    "Delaunay Triangulation Wikipedia Article",
    "https://en.wikipedia.org/wiki/Delaunay_triangulation",
  ],
]

export default {
  area: {
    data: ["data.csv"],
    docs: [
      ...d3SelectionItems,
      ...d3ShapeItems,
      ...d3ScaleItems,
      ...d3AxisItems,
      ...d3DelaunayItems,
    ],
    name: "Area",
    notes: ["Changed style", "Added point and voronoi functionality"],
    sources: ["http://codepen.io/notno/pen/ilvsd"],
    summary: [
      "This chart is a mix of a common area + line chart plus Voronoi to properly display the points on mouse move. For the x and y axis, it uses two linear scales. It uses a SVG 'path' for printing the area, and a different SVG 'path' to print the line.",
      "It uses an SVG 'clipPath' element with a 'rect' to limit the area and line paths. This doesn't look necessary, because after removing it, the area has the same dimensions. However I kept it because it was in the original source and it showcases this approach.",
      "The voronoi lines are applied to a SVG 'path' element using 'voronoi.renderCell'. Because no context is passed to this method, it returns the SVG path by default. Each fragment of the voronoi chart has a fill value with opacity 0 in order to detect the mouse events.",
      "The only return value from the render function is a function to allow toggling the visibility of the voronoi lines. This is done by changing the CSS class without re-rendering.",
    ],
  },
  bars: {
    data: ["data.json"],
    docs: [],
    name: "Bars",
    notes: [
      "Added axis",
      "Changed direction and added color transition for wave effect",
      "Added transition in axis and the add item possibility",
      "The interval stops when you place the mouse over a bar",
    ],
    sources: ["http://codepen.io/basemoz/pen/mBoiL"],
    summary: [],
  },
  bubbles: {
    data: ["data.json"],
    docs: [],
    name: "Bubbles",
    notes: [
      'Using the <a href="https://github.com/novus/nvd3" target="_blank">NV3D</a> extension for D3JS',
      "Data taken from the Nike API (via the Codepen)",
      'You can click the "Maginify" button and click a point to zoom the chart',
    ],
    sources: ["http://codepen.io/linghzang3/pen/GFdzh"],
    summary: [],
  },
  chord: {
    data: ["data.csv"],
    docs: [],
    name: "Chord",
    notes: [
      "Added filters with drop shadow and low opacity",
      "Changed scheme and match each color with a country",
    ],
    sources: ["http://bl.ocks.org/mbostock/1308257"],
    summary: [],
  },
  "collapsible-tree": {
    data: ["data.json"],
    docs: [],
    name: "Collapsible Tree",
    notes: [],
    sources: [
      "http://bl.ocks.org/mbostock/4339083",
      "https://observablehq.com/@d3/collapsible-tree",
    ],
    summary: [],
  },
  "concentric-circles": {
    data: [],
    docs: [],
    name: "Concentric Circles",
    notes: [
      "Data of baby names in New York 2012",
      "Custom color scale",
      "Added box shadow filter",
    ],
    sources: [
      "http://codepen.io/notno/pen/wgyAz",
      "http://bl.ocks.org/cpbotha/5200394",
      "http://stackoverflow.com/questions/17671252/d3-create-a-continous-color-scale-with-many-strings-inputs-for-the-range-and-dy",
    ],
    summary: [],
  },
  "fish-eye": {
    data: ["data.json"],
    docs: [],
    name: "Fish Eye",
    notes: [
      "Uses the Fish Eye plugin",
      "Changed style",
      "Click to stop and show a pointer",
      "Extended the title information",
    ],
    sources: ["http://bost.ocks.org/mike/fisheye/"],
    summary: [],
  },
  force: {
    data: ["links.json", "nodes.json"],
    docs: [],
    name: "Force",
    notes: [],
    sources: ["http://codepen.io/MidnightLightning/pen/dclbA"],
    summary: [],
  },
  icosahedron: {
    data: [],
    docs: [],
    name: "Icosahedron",
    notes: [
      "No data bound to it, it could be to the speed, size, colors",
      "Added color scale and the sinusoidal x velocity",
      "Added the stop and move when clicked",
    ],
    sources: ["https://gist.github.com/mbostock/7782500"],
    summary: [],
  },
  "map-distorsions": {
    data: ["data.tsv"],
    docs: [
      ...d3ShapeItems,
      ...d3AxisItems,
      ...d3SelectionItems,
      ...d3ScaleItems,
    ],
    name: "Map Distorsions",
    notes: [
      "Dynamic (for performance) shadow",
      "Custom color scale related to index",
      "Tooltip and minor style changes",
    ],
    sources: ["http://bl.ocks.org/mbostock/3709000"],
    summary: [
      "This chart has some special characteristics like multiple vertical axis, color scale with many values, and the interaction with the mouse.",
      "When hovering a line, the rest are converted to gray, and this one gets appended to the parent element, so it renders on top.",
      "There is a drop-shadow filter applied but only to the focused line, which improves a lot the performance.",
    ],
  },
  "mareys-schedule": {
    data: ["data.tsv"],
    docs: [],
    name: "Marey's Schedule",
    notes: [
      "Added titles with information in stops and trains",
      "Add box shadow",
      "Add range input",
    ],
    sources: ["http://bl.ocks.org/mbostock/5544008"],
    summary: [],
  },
  "multiline-voronoi": {
    data: ["data.tsv"],
    docs: [
      ...d3AxisItems,
      ...d3ShapeItems,
      ...d3ScaleItems,
      ...d3SelectionItems,
      ...d3DelaunayItems,
      ...d3ScaleChromaticItems,
      ...d3FetchItems,
    ],
    name: "Multi-Line Voronoi",
    notes: [
      "Click one time to just show a line, click again to sho all",
      "Added color and dropshadow for 3D effect",
      "Added label data and clicked function",
    ],
    sources: ["http://bl.ocks.org/mbostock/8033015"],
    summary: [],
  },
  partition: {
    data: ["flare.json"],
    docs: [
      ...d3EaseItems,
      ...d3FetchItems,
      ...d3HierarchyItems,
      ...d3InterpolateItems,
      ...d3ScaleItems,
      ...d3SelectionItems,
      ...d3TransitionItems,
    ],
    name: "Partition",
    notes: [
      "Added title attributes, labels and change colors with events",
      "Added bounce ease function",
    ],
    sources: ["http://bl.ocks.org/mbostock/4063423"],
    summary: [
      "This is a good example of how to uses hierarchies in combination with arc shapes. It includes a couple of ways of generating the hierarchy: via the size (value) of each leaf or via the count.",
      "It is also illustrative about how to create custom tween functions for transitions. One possible improvement is the effect of the texts when flipping the direction during a transition due to being oriented vertical.",
      "The chart displays the common flow for updating elements bound to data. Removing exited elements, adding new elements and applying the tween function to the selection.",
    ],
  },
  pie: {
    data: ["data.json"],
    docs: [],
    name: "Pie",
    notes: [
      "Added the animation (transition) by changing a random slice data by a random integer between range",
    ],
    sources: ["http://codepen.io/nishidh41/pen/Frzhq"],
    summary: [],
  },
  "spain-map": {
    data: ["data.json"],
    docs: [],
    name: "Spanish Map",
    notes: [
      "For this chart I reused the code from the World Map chart and other demos",
      "Added drop shadow for 3D effect",
    ],
    sources: ["http://www.diva-gis.org/datadown"],
    summary: [],
  },
  timeline: {
    data: ["data.csv"],
    docs: [],
    name: "Timeline",
    notes: [
      "Change to bootstrap tooltip",
      "Add dynamic text lengths (adding two dots)",
      "Improve performance (a lot) removing the drop-shadow while brushing",
    ],
    sources: ["http://bl.ocks.org/rengel-de/5603464"],
    summary: [],
  },
  "trend-line": {
    data: ["data.tsv"],
    docs: [],
    name: "Trend line",
    notes: ["Added both line animations", "Changed y scale domain"],
    sources: [
      "http://codepen.io/arundhaj/pen/ouyjd",
      "http://big-elephants.com/2014-06/unrolling-line-charts-d3js/",
    ],
    summary: [],
  },
  vectors: {
    data: [],
    docs: [
      [
        "d3-force API reference",
        "https://github.com/d3/d3-force#forceSimulation",
      ],
    ],
    name: "Vectors (needs fix)",
    notes: [
      "Use the <strong>Ctrl</strong> key to move nodes instead of creating vectors",
      "Needs fix: Some functionality from 2016 chart detailed in the comments",
    ],
    sources: ["http://codepen.io/zarazum/pen/fjoqF"],
    summary: [],
  },
  "weekly-heatmap": {
    data: ["data.tsv"],
    docs: [...d3SelectionItems, ...d3ScaleItems, ...d3FetchItems],
    name: "Weekly Heatmap",
    notes: [],
    sources: ["http://bl.ocks.org/tjdecke/5558084"],
    summary: [
      "This chart is a grid of days and hours using a quantile to group the data values by nine colors. The number of groups is directly tied to the colors array, so removing or adding colors to the array also affects the number of groups.",
    ],
  },
  "world-map": {
    data: ["world.json"],
    docs: [],
    name: "World Map",
    notes: [
      "Added the mouse over stroke and the zooming-unzooming when clicking in countries (from third source)",
      "Click a country to zoom, click in the water or the same country to set zoom back to normal",
    ],
    sources: [
      "http://bost.ocks.org/mike/map/",
      "http://bl.ocks.org/mbostock/raw/4090846/world-50m.json",
      "http://bl.ocks.org/mbostock/2206590",
    ],
    summary: [],
  },
}
