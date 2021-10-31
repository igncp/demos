import React from "react"
import { Helmet } from "react-helmet"
import { useMediaQuery } from "react-responsive"

import { IndexPageProps } from "@/common"

import DemosList from "@/components/demos-list"
import Layout from "@/components/layout"
import * as styles from "@/components/styles/styles.module.css"

const colClassName = "col-xs-offset-1 col-xs-11 col-lg-offset-2 col-lg-3"

const IndexPage = ({
  pageContext: { groupedDemos, meta, numberPerGroup },
}: IndexPageProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 })

  return (
    <Layout>
      <Helmet
        meta={[
          {
            content: meta.description,
            name: "description",
          },
        ]}
        title={"Demos - igncp"}
      />
      <div className="bs-callout bs-callout-info">
        Here are some <i>interactive data visualization demos</i> that are built
        with examples found on the web, which I've rewritten with ideas from
        other examples.
        {isMobile ? (
          <>
            <br />
            <br />
          </>
        ) : (
          " "
        )}
        The sources are always available. The idea is to try things using
        libraries like D3.js or Raphaël, and extensions of those.
      </div>

      <div id={styles.demosLegend}>
        <ul className="bs-callout bs-callout-warning">
          <li>
            <span className={`${styles.bullet} ${styles.d3js}`}>&#8226;</span>{" "}
            D3js
          </li>
          <li>
            <span className={`${styles.bullet} ${styles.raphael}`}>
              &#8226;
            </span>{" "}
            Raphaël
          </li>
        </ul>
      </div>

      <div className="row" id={styles.demosLists}>
        {isMobile ? (
          <div className={colClassName}>
            <DemosList
              demos={groupedDemos[0].concat(groupedDemos[1])}
              indexOffset={0}
            />
          </div>
        ) : (
          <>
            <div className={colClassName}>
              <DemosList demos={groupedDemos[0]} indexOffset={0} />
            </div>
            <div className={colClassName}>
              <DemosList demos={groupedDemos[1]} indexOffset={numberPerGroup} />
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default IndexPage
