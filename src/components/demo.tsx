import React, { useEffect } from "react"
import { Helmet } from "react-helmet"

import { DemoPageProps } from "@/common"

import DemoTitle from "./demo-title"
import FilesDetails from "./files-details"
import Layout from "./layout"

const parsePath = (str: string) =>
  str[0] === "/" ? ROOT_PATH + str.replace(/^\//, "") : str

type Props = {
  children: React.ReactNode
  links?: string[]
  main: (() => void) | (() => Promise<void>)
  pageContext: DemoPageProps["pageContext"]
  scripts?: string[]
}

const Demo = ({
  main,
  children,
  scripts = [],
  links = [],
  pageContext,
}: Props) => {
  const { demoInfo, meta } = pageContext
  const { name, sources, isCompleted } = demoInfo

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
        meta={[
          {
            content: meta.description,
            name: "description",
          },
        ]}
        script={(process.env.NODE_ENV === "production" ? scripts : []).map(
          (src) => ({
            src: parsePath(src),
            type: "text/javascript",
          })
        )}
        title={`${demoInfo.name} | Demos igncp`}
      />
      <DemoTitle
        isCompleted={isCompleted}
        mainSource={sources[0]}
        name={name}
      />
      {children}
      <FilesDetails demoInfo={demoInfo} />
    </Layout>
  )
}

export default Demo
