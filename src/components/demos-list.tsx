import React from "react"

import { DemoSummary, STORYBOOK_DEMO_KEY } from "@/common"

import * as styles from "@/components/styles/styles.module.css"

type Props = {
  demos: DemoSummary[]
  indexOffset: number
}

const categoryToStyleMap: { [key: string]: string } = {
  d3js: styles.d3js,
  raphael: styles.raphael,
  storybook: styles.storybook,
}

const DemosList = ({ demos, indexOffset }: Props) => (
  <ul className="list-group">
    {demos.map((...[demo, demoIndex]) => (
      <a
        className={`list-group-item ${
          demo.key === STORYBOOK_DEMO_KEY ? "highlight" : ""
        }`}
        href={demo.route}
        key={demo.name}
      >
        <span className="home-demo-number">
          {demoIndex + 1 + indexOffset}.-
        </span>{" "}
        <span className="home-demo-name-link">{demo.name}</span>
        <div
          className={`${styles.bullet} ${categoryToStyleMap[demo.category]}`}
        >
          &#8226;
        </div>
      </a>
    ))}
  </ul>
)

export default DemosList
