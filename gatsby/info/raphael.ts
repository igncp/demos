import { DemoBase } from "@/common"

export type Raphael = {
  "bars-3dimensional": DemoBase
  "circular-arcs": DemoBase
  "moving-line": DemoBase
}

const raphael: Raphael = {
  "bars-3dimensional": {
    dataFiles: ["data.json"],
    docs: [],
    isCompleted: true,
    name: "Bars 3D",
    notes: ["Added titles on hover", "Dynamic dimensions"],
    sources: ["http://codepen.io/djam/pen/edjCz"],
    summary: [],
  },
  "circular-arcs": {
    dataFiles: [],
    docs: [],
    isCompleted: true,
    name: "Circular Arcs",
    notes: [
      "This demo doesn't have data, but it wouldn't be hard (e.g. bound to the radius if all are different)",
    ],
    sources: ["http://codepen.io/dshapira/pen/ltrqc"],
    summary: [],
  },
  "moving-line": {
    dataFiles: ["data.json"],
    docs: [],
    isCompleted: true,
    name: "Moving Line",
    notes: [
      "The axis is not included as it is part of the background image",
      "Add titles",
    ],
    sources: ["http://codepen.io/johnegraham2/pen/ExfBI"],
    summary: [],
  },
}

export default raphael
