import * as React from "react"

import PageTitle from "./page-title"
import Footer from "./footer"

import "./styles/styles.css"

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => (
  <>
    <div className="row">
      <div className="col-lg-offset-1 col-lg-10">
        <PageTitle />
        {children}
      </div>
    </div>
    <Footer />
  </>
)

export default Layout
