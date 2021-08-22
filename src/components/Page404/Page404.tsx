import React from "react"

import Layout from "@/components/layout"

import * as styles from "./Page404.module.css"

const Page404 = () => (
  <Layout>
    <h1>404: Not Found</h1>
    <p className={styles.paragraph}>
      You just hit a route that doesn't exist...
    </p>
    <p className={styles.paragraph}>
      <a href={`${ROOT_PATH}/`}>Click here</a> to go pack to the home page
    </p>
  </Layout>
)

export default Page404
