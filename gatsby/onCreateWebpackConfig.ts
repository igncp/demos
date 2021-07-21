import { ROOT_PATH } from "./constants"

const onCreateWebpackConfig = ({ plugins, actions }: any) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        ROOT_PATH: JSON.stringify(ROOT_PATH),
      }),
    ],
  })
}

export { onCreateWebpackConfig }
