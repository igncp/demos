import React from "react"

import * as styles from "./styles/styles.module.css"

const Footer = () => (
  <footer className={styles.footer}>
    <p>{new Date().getFullYear()}</p>
  </footer>
)

export default Footer
