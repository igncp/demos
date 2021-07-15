import React, { useEffect } from "react"
// @ts-ignore
import { Helmet } from "react-helmet"

import { DemoInfo } from "@/common"

import DemoTitle from "./demo-title"
import FilesDetails from "./files-details"
import Layout from "./layout"

const parsePath = (str: string) =>
  str[0] === "/" ? ROOT_PATH + str.replace(/^\//, "") : str

type Props = {
  children: React.ReactNode
  demoInfo: DemoInfo
  links?: string[]
  main: (() => void) | (() => Promise<void>)
  scripts?: string[]
}

const Demo = ({
  demoInfo,
  main,
  children,
  scripts = [],
  links = [],
}: Props) => {
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
            href: parsePath(href),
            rel: "stylesheet",
            type: "text/css",
          })
        )}
        script={(process.env.NODE_ENV === "production" ? scripts : []).map(
          (src) => ({
            src: parsePath(src),
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
