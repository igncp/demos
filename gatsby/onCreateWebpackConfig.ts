import { GatsbyNode } from "gatsby"

import { ROOT_PATH } from "./constants"

const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        ROOT_PATH: JSON.stringify(ROOT_PATH),
      }),
    ],
  })
}

export { onCreateWebpackConfig }
