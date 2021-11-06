import { CreateWebpackConfigArgs, GatsbyNode } from "gatsby"

import { ROOT_PATH } from "./constants"

// This is required after update to have valid CSS selectors for `.module.css` files, so classes don't have symbols
// like `+`, just numbers and letters
const fixCSSModules = ({ actions, getConfig }: CreateWebpackConfigArgs) => {
  const config = getConfig()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Rule = any

  config.module.rules.forEach((topRule: Rule) => {
    const areCssRules = topRule.oneOf?.some((rule: Rule) =>
      rule.test.test("style.css")
    )

    if (!areCssRules) {
      return
    }

    topRule.oneOf.forEach((rule: Rule) => {
      rule.use.forEach((innerRule: Rule) => {
        if (!innerRule.options?.modules?.localIdentName) {
          return
        }

        // By default it is `base64` instead of `hex` which can contain invalid symbols
        innerRule.options.modules.localIdentName =
          "[name]--[local]--[hash:hex:5]"
      })
    })
  })

  actions.replaceWebpackConfig(config)
}

const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = (params) => {
  const { actions, plugins } = params

  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        ROOT_PATH: JSON.stringify(ROOT_PATH),
      }),
    ],
  })

  fixCSSModules(params)
}

export { onCreateWebpackConfig }
