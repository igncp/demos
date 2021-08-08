import React from "react"

type Props = {
  source: string
  sourceText?: string
  storyName: string
}

const StoryInfo = ({ source, sourceText, storyName }: Props) => (
  <p>
    <a href={source} rel="noreferrer" target="_blank">
      {sourceText ?? "Source"}
    </a>
    <span> | </span>
    <a
      href={`https://github.com/igncp/demos/blob/main/storybook/stories/${storyName}/${storyName}.stories.tsx`}
      rel="noreferrer"
      target="_blank"
    >
      Code in Github
    </a>
    <span> | </span>
    <a
      href={`https://igncp.github.io/demos/coverage-ts/files/storybook/stories/${storyName}/${storyName}.stories.tsx.html`}
      rel="noreferrer"
      target="_blank"
    >
      TypeScript Coverage
    </a>
  </p>
)

export default StoryInfo
