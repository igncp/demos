import React from "react"

import * as styles from "@/components/styles/styles.module.css"

const PageTitle = () => (
  <div className={styles.pageHeader}>
    <h1>
      <span className={styles.titleWrapper}>
        <a href={ROOT_PATH}>Demos</a>{" "}
        <small className="hide-tablet">
          interactive data visualization examples
        </small>
      </span>
      <span id={styles.ghButtons}>
        <iframe
          className="hide-mobile"
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow"
          width="119"
        />
        <iframe
          className="hide-mobile"
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork"
          width="62"
        />
        <iframe
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch"
          width="52"
        />
      </span>
    </h1>
  </div>
)

export default PageTitle
