import * as React from "react"

import PageTitle from "./page-title"
import Footer from "./footer"

import "./layout.css"
import "./styles/styles.styl"

const Layout = ({ children }) => (
  <>
    <div className="row" id="container">
      <div className="col-lg-offset-1 col-lg-10">
        <PageTitle />
        {children}
      </div>
    </div>
    <Footer />
  </>
)

export default Layout
