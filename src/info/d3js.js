module.exports = {
  area: {
    data: ["data.csv"],
    name: "Area",
    notes: ["Changed style", "Added point and voronoi functionality"],
    sources: ["http://codepen.io/notno/pen/ilvsd"],
  },
  bars: {
    data: ["data.json"],
    name: "Bars",
    notes: [
      "Added axis",
      "Changed direction and added color transition for wave effect",
      "Added transition in axis and the add item possibility",
      "The interval stops when you place the mouse over a bar",
    ],
    sources: ["http://codepen.io/basemoz/pen/mBoiL"],
  },
  bubbles: {
    data: ["data.json"],
    name: "Bubbles",
    notes: [
      'Using the <a href="https://github.com/novus/nvd3">NV3D</a> extension for D3JS',
      "Data taken from the Nike API (via the Codepen)",
    ],
    sources: ["http://codepen.io/linghzang3/pen/GFdzh"],
  },
  chord: {
    data: ["data.csv"],
    name: "Chord",
    notes: [
      "Added filters with drop shadow and low opacity",
      "Changed scheme and match each color with a country",
    ],
    sources: ["http://bl.ocks.org/mbostock/1308257"],
  },
  "collapsible-tree": {
    data: ["data.json"],
    name: "Collapsible Tree",
    notes: [],
    sources: ["http://bl.ocks.org/mbostock/4339083"],
  },
  "concentric-circles": {
    data: [],
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
  },
  "fish-eye": {
    data: ["data.json"],
    name: "Fish Eye",
    notes: [
      "Uses the Fish Eye plugin",
      "Changed style",
      "Click to stop and show a pointer",
      "Extended the title information",
    ],
    sources: ["http://bost.ocks.org/mike/fisheye/"],
  },
  force: {
    data: ["links.json", "nodes.json"],
    name: "Force",
    notes: [],
    sources: ["http://codepen.io/MidnightLightning/pen/dclbA"],
  },
  icosahedron: {
    data: [],
    name: "Icosahedron",
    notes: [
      "No data bound to it, it could be to the speed, size, colors",
      "Added color scale and the sinusoidal x velocity",
      "Added the stop and move when clicked",
    ],
    sources: ["https://gist.github.com/mbostock/7782500"],
  },
  "map-distorsions": {
    data: ["data.tsv"],
    name: "Map Distorsions",
    notes: [
      "Dynamic (for performance) shadow",
      "Custom color scale related to index",
      "Tooltip and minor style changes",
    ],
    sources: ["http://bl.ocks.org/mbostock/3709000"],
  },
  "mareys-schedule": {
    data: ["data.tsv"],
    name: "Marey's Schedule",
    notes: [
      "Added titles with information in stops and trains",
      "Add box shadow",
      "Add range input",
    ],
    sources: ["http://bl.ocks.org/mbostock/5544008"],
  },
  "multiline-voronoi": {
    data: ["data.tsv"],
    name: "Multi-Line Voronoi",
    notes: [
      "Click one time to just show a line, click again to sho all",
      "Added color and dropshadow for 3D effect",
      "Added label data and clicked function",
    ],
    sources: ["http://bl.ocks.org/mbostock/8033015"],
  },
  partition: {
    data: ["flare.json"],
    name: "Partition",
    notes: ["Added title attributes, labels and change colors with events"],
    sources: ["http://bl.ocks.org/mbostock/4063423"],
  },
  pie: {
    data: ["data.json"],
    name: "Pie",
    notes: [
      "Added the animation (transition) by changing a random slice data by a random integer between range",
    ],
    sources: ["http://codepen.io/nishidh41/pen/Frzhq"],
  },
  "spain-map": {
    data: ["data.json"],
    name: "Spanish Map",
    notes: [
      "For this chart I reused the code from the World Map chart and other demos",
      "Added drop shadow for 3D effect",
    ],
    sources: ["http://www.diva-gis.org/datadown"],
  },
  timeline: {
    data: ["data.csv"],
    name: "Timeline",
    notes: [
      "Change to bootstrap tooltip",
      "Add dynamic text lengths (adding two dots)",
      "Improve performance (a lot) removing the drop-shadow while brushing",
    ],
    sources: ["http://bl.ocks.org/rengel-de/5603464"],
  },
  "trend-line": {
    data: ["data.tsv"],
    name: "Trend line",
    notes: ["Added both line animations", "Changed y scale domain"],
    sources: [
      "http://codepen.io/arundhaj/pen/ouyjd",
      "http://big-elephants.com/2014-06/unrolling-line-charts-d3js/",
    ],
  },
  vectors: {
    data: [],
    name: "Vectors",
    notes: [
      "Use the <strong>Ctrl</strong> key to move nodes instead of creating vectors",
    ],
    sources: ["http://codepen.io/zarazum/pen/fjoqF"],
  },
  "weekly-heatmap": {
    data: ["data.tsv"],
    name: "Weekly Heatmap",
    notes: [],
    sources: ["http://bl.ocks.org/tjdecke/5558084"],
  },
  "world-map": {
    data: ["world.json"],
    name: "World Map",
    notes: [
      "Added the mouse over stroke and the zooming-unzooming when clicking in countries (from third source)",
      "Click a country to zoom, click in the water to set zoom back to normal",
    ],
    sources: [
      "http://bost.ocks.org/mike/map/",
      "http://bl.ocks.org/mbostock/raw/4090846/world-50m.json",
      "http://bl.ocks.org/mbostock/2206590",
    ],
  },
}
