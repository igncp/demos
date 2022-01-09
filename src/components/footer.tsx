import React from "react"

import * as styles from "@/components/styles/styles.module.css"

const Footer = () => (
  <div className={styles.footer}>
    <p>{new Date().getFullYear()}</p>
  </div>
)

export default Footer
