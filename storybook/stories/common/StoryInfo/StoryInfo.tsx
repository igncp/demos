import React from "react"

import * as styles from "./storyInfo.module.css"

type Doc = {
  link: string
  name: string
}

type Props = {
  docs?: Doc[]
  source: string[] | string
  sourceText?: string
  storyName: string[] | string
}

const StoryInfo = ({ docs, source, sourceText, storyName }: Props) => {
  const [isDocsBlockExpanded, setIsDocsBlockExpanded] = React.useState(false)

  React.useEffect(() => {
    const anchorElement = parent.document
      .querySelector(".sidebar-header")
      ?.querySelector("a")

    anchorElement?.setAttribute("target", "_self")
  }, [])

  const storyPath = Array.isArray(storyName)
    ? storyName.join("/")
    : `${storyName}/${storyName}`

  return (
    <>
      <p>
        {(Array.isArray(source) ? source : [source]).map(
          (...[sourceItem, sourceIndex, sourcesArray]) => (
            <span key={sourceIndex}>
              <a href={sourceItem} rel="noreferrer" target="_blank">
                {(sourceText ?? "Source") +
                  (sourcesArray.length === 1 ? "" : ` ${sourceIndex + 1}`)}
              </a>
              <span> | </span>
            </span>
          )
        )}
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
