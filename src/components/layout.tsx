import React from "react"

import Footer from "./footer"
import PageTitle from "./page-title"
import "./styles/styles.css"
import * as styles from "./styles/styles.module.css"

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => (
  <>
    <div className={styles.rootLayout}>
      <div className="px-3 px-sm-5">
        <PageTitle />
        {children}
      </div>
    </div>
    <Footer />
  </>
)

export default Layout
