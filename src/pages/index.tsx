import * as React from "react"
import { Helmet } from "react-helmet"

import { IndexPageProps } from "@/common"

import Layout from "@/components/layout"
import DemosList from "@/components/demos-list"

const IndexPage = ({
  pageContext: { groupedDemos, numberPerGroup },
}: IndexPageProps) => (
  <Layout>
    <Helmet
      meta={[
        {
          content:
            "HTML data visualization demos for the web, rewritten and extended. Using TypeScript with libraries like d3js, Raphael, jQuery UI or Stylus, rendering SVG or Canvas elements.",
          name: "description",
        },
      ]}
      title={"Demos - igncp"}
    />
    <div className="bs-callout bs-callout-info">
      Here are some <i>interactive data visualization demos</i> that are built
      with examples found on the web, which I've rewritten with ideas from other
      examples. The sources are always available. The idea is to try things
      using libraries like D3.js or Raphaël, and extensions of those.
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

export default IndexPage
