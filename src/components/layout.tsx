import React from "react"

import Footer from "./footer"
import PageTitle from "./page-title"
import "./styles/styles.css"
import * as styles from "./styles/styles.module.css"

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => (
  <div className={`${styles.rootLayout} px-3 px-sm-5`}>
    <div className={styles.navWrapper}>
      <PageTitle />
    </div>
    <div className={styles.contentWrapper}>{children}</div>
    <div className={styles.footerWrapper}>
      <Footer />
    </div>
  </div>
)

export default Layout
