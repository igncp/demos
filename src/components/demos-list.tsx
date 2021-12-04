import React from "react"

import { DemoSummary, SPECIAL_DEMO_KEYS } from "@/common"

import * as styles from "@/components/styles/styles.module.css"

type Props = {
  demos: DemoSummary[]
  indexOffset: number
}

const categoryToBulletStyleMap: { [key: string]: string } = {
  d3js: styles.d3js,
  raphael: styles.raphael,
  [SPECIAL_DEMO_KEYS.STORYBOOK]: styles.storybook,
  [SPECIAL_DEMO_KEYS.TESTING]: styles.testing,
}

const specialHighlightStyle: { [key in SPECIAL_DEMO_KEYS]: string } = {
  [SPECIAL_DEMO_KEYS.STORYBOOK]: styles.highlightStorybook,
  [SPECIAL_DEMO_KEYS.TESTING]: styles.highlightTesting,
}

const DemosList = ({ demos, indexOffset }: Props) => (
  <ul className="list-group">
    {demos.map((...[demo, demoIndex]) => (
      <a
        className={`list-group-item ${
          specialHighlightStyle[demo.key as SPECIAL_DEMO_KEYS] || ""
        } ${styles.rowWrapper}`}
        href={demo.route}
        key={demo.name}
      >
        <span className={styles.homeDemoNumber}>
          {demoIndex + 1 + indexOffset}.-
        </span>{" "}
        <span className={styles.homeDemoNameLink}>{demo.name}</span>
        <div
          className={`${styles.bullet} ${
            categoryToBulletStyleMap[demo.category]
          }`}
        >
          &#8226;
        </div>
      </a>
    ))}
  </ul>
)

export default DemosList
