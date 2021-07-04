import * as React from "react"
import _ from "lodash"

import Layout from "@/components/layout"
import DemosList from "@/components/demos-list"

import d3js from "@/info/d3js"
import raphael from "@/info/raphael"

const info = {}

info.d3js = []
info.raphael = []

for (const item in d3js) {
  const DI = d3js[item]

  DI.key = item
  DI.category = "d3js"
  DI.route = `${ROOT_PATH}d3js/${item}`
  info.d3js.push(DI)
}

for (const item in raphael) {
  const RI = raphael[item]

  RI.key = item
  RI.category = "raphael"
  RI.route = `${ROOT_PATH}raphael/${item}`
  info.raphael.push(RI)
}

const getInfo = (category, key) => {
  if (key) {
    return _.where(info[category], {
      key,
    })[0]
  }

  return info[category]
}

const demosD3 = getInfo("d3js")
const demosRaphael = getInfo("raphael")

let demos = demosD3.concat(demosRaphael)

demos = _.sortBy(demos, "name")

const IndexPage = () => {
  const numberPerGroup = Math.ceil(demos.length / 2)
  const groupedDemos = []

  groupedDemos[0] = demos.slice(0, numberPerGroup)
  groupedDemos[1] = demos.slice(numberPerGroup, demos.length)

  return (
    <Layout>
      <div className="bs-callout bs-callout-info">
        Here are some <i>interactive data visualization demos</i> that are built
        with examples found on the web, which I've rewritten with ideas from
        other examples. The sources are always available. The idea is to try
        things using libraries like D3.js or Raphaël, and extensions of those.
      </div>

      <div id="demos-legend">
        <ul className="bs-callout bs-callout-warning">
          <li>
            <span className="bullet d3js">&#8226;</span> D3js
          </li>
          <li>
            <span className="bullet raphael">&#8226;</span> Raphaël
          </li>
        </ul>
      </div>

      <div className="row" id="demos-lists">
        <div className="col-lg-offset-2 col-lg-3">
          <DemosList demos={groupedDemos[0]} indexOffset={0} />
        </div>
        <div className="col-lg-offset-2 col-lg-3">
          <DemosList demos={groupedDemos[1]} indexOffset={numberPerGroup} />
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
