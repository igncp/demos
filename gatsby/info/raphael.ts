import { DemoBase } from "@/common"

type Raphael = {
  "bars-3dimensional": DemoBase
  "circular-arcs": DemoBase
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
}

export { Raphael }

export default raphael
