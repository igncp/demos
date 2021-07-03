import React, { useEffect } from "react"
import { Helmet } from "react-helmet"

import DemoTitle from "./demo-title"
import FilesDetails from "./files-details"
import Layout from "./layout"

const Demo = ({ demoInfo, main, children, scripts = [], links = [] }) => {
  const { name, sources } = demoInfo

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    main()
  }, [])

  return (
    <Layout>
      <Helmet
        link={(process.env.NODE_ENV === "production" ? links : []).map(
          (href) => ({
            href,
            rel: "stylesheet",
            type: "text/css",
          })
        )}
        script={(process.env.NODE_ENV === "production" ? scripts : []).map(
          (src) => ({
            src,
            type: "text/javascript",
          })
        )}
        title={`${demoInfo.name} | demos igncp`}
      />
      <DemoTitle mainSource={sources[0]} name={name} />
      {children}
      <FilesDetails demoInfo={demoInfo} />
    </Layout>
  )
}

export default Demo
