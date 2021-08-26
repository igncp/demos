import React from "react"

import * as styles from "./storyInfo.module.css"

type Doc = {
  link: string
  name: string
}

type Props = {
  docs?: Doc[]
  source: string
  sourceText?: string
  storyName: string[] | string
}

const StoryInfo = ({ docs, source, sourceText, storyName }: Props) => {
  const [isDocsBlockExpanded, setIsDocsBlockExpanded] = React.useState(false)

  const storyPath = Array.isArray(storyName)
    ? storyName.join("/")
    : `${storyName}/${storyName}`

  return (
    <>
      <p>
        <a href={source} rel="noreferrer" target="_blank">
          {sourceText ?? "Source"}
        </a>
        <span> | </span>
        <a
          href={`https://github.com/igncp/demos/blob/main/storybook/stories/${storyPath}.stories.tsx`}
          rel="noreferrer"
          target="_blank"
        >
          Code in Github
        </a>
        <span> | </span>
        <a
          href={`https://igncp.github.io/demos/coverage-ts/files/storybook/stories/${storyPath}.stories.tsx.html`}
          rel="noreferrer"
          target="_blank"
        >
          TypeScript Coverage
        </a>
        {!!docs?.length && (
          <>
            <span> | </span>
            <a
              href="#"
              onClick={(clickEvent) => {
                clickEvent.preventDefault()
                setIsDocsBlockExpanded(!isDocsBlockExpanded)
              }}
            >
              {isDocsBlockExpanded ? "Hide related docs" : "Show related docs"}
            </a>
          </>
        )}
      </p>
      {isDocsBlockExpanded && (
        <ul className={styles.docsList}>
          {docs!.map((doc) => (
            <li className={styles.docItem} key={doc.name}>
              <a href={doc.link} rel="noreferrer" target="_blank">
                {doc.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default StoryInfo
