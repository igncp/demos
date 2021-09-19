import React from "react"

import * as styles from "./storyInfo.module.css"

type Doc = {
  link: string
  name: string
}

type SourceLinkProps = {
  onSeeLessClick?: () => void
  onSeeMoreClick?: () => void
  sourceIndex: number
  sourceLink: string
  sourceText?: string
  sourcesLength: number
}

const SourceLink = ({
  onSeeLessClick,
  onSeeMoreClick,
  sourceIndex,
  sourceLink,
  sourceText,
  sourcesLength,
}: SourceLinkProps) => (
  <>
    <a href={sourceLink} rel="noreferrer" target="_blank">
      {(sourceText ?? "Source") +
        (sourcesLength === 1 ? "" : ` ${sourceIndex + 1}`)}
    </a>
    {(onSeeMoreClick || onSeeLessClick) && (
      <a
        href="#"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation()
          clickEvent.preventDefault()

          if (onSeeMoreClick) {
            onSeeMoreClick()
          } else {
            onSeeLessClick!()
          }
        }}
      >
        {" "}
        (See {onSeeMoreClick ? "more >>" : "less <<"})
      </a>
    )}
    <span> | </span>
  </>
)

type Props = {
  docs?: Doc[]
  source: string[] | string
  sourceText?: string
  storyName: string[] | string
}

const StoryInfo = ({ docs, source, sourceText, storyName }: Props) => {
  const [isDocsBlockExpanded, setIsDocsBlockExpanded] = React.useState(false)
  const [areSourcesExpanded, setAreSourcesExpanded] = React.useState(false)

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
        {Array.isArray(source) && source.length > 1 && !areSourcesExpanded ? (
          <SourceLink
            onSeeMoreClick={() => {
              setAreSourcesExpanded(true)
            }}
            sourceIndex={0}
            sourceLink={source[0]}
            sourceText={sourceText}
            sourcesLength={source.length}
          />
        ) : (
          (Array.isArray(source) ? source : [source]).map(
            (...[sourceItem, sourceIndex, sourcesArray]) => (
              <SourceLink
                key={sourceIndex}
                onSeeLessClick={
                  sourcesArray.length > 1 &&
                  sourceIndex === sourcesArray.length - 1
                    ? () => {
                        setAreSourcesExpanded(false)
                      }
                    : undefined
                }
                sourceIndex={sourceIndex}
                sourceLink={sourceItem}
                sourceText={sourceText}
                sourcesLength={sourcesArray.length}
              />
            )
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
