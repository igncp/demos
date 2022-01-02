import "prismjs/themes/prism-coy.css"
import React from "react"

import { DemoInfo } from "@/common"

import * as styles from "@/components/styles/styles.module.css"

import { getDemoE2ETestFilePath } from "@/utils/getDemoE2ETestFilePath"

import CodeFragment from "./code-fragment"

const CodeInGH = ({ filePath }: { filePath: string }) => (
  <>
    <span>| </span>
    <a
      href={`https://github.com/igncp/demos/blob/main/${filePath}`}
      rel="noreferrer"
      target="_blank"
    >
      Code in Github
    </a>
  </>
)
const CoverageReport = ({ filePath }: { filePath: string }) => (
  <>
    <span>| </span>
    <a
      href={`https://igncp.github.io/demos/coverage-ts/files/${filePath}.html`}
      rel="noreferrer"
      target="_blank"
    >
      TypeScript coverage report
    </a>
  </>
)

type Props = {
  demoInfo: DemoInfo
}

const FilesDetails = ({ demoInfo }: Props) => {
  if (typeof window === "undefined") {
    return null
  }

  const pageFilePath = `pages/${demoInfo.category}/${demoInfo.key}.${demoInfo.files.page.type}`

  return (
    <div>
      {!!demoInfo.notes.length && (
        <div className={`bs-callout bs-callout-info${styles.notes}`}>
          <p>
            <strong>Notes:</strong>
          </p>
          <ul>
            {demoInfo.notes.map((...[note, noteIndex]) => (
              <li dangerouslySetInnerHTML={{ __html: note }} key={noteIndex} />
            ))}
          </ul>
        </div>
      )}
      {!!demoInfo.summary.length && (
        <div className={`bs-callout bs-callout-summary ${styles.notes}`}>
          <p>
            <strong>Implementation Summary:</strong>
          </p>
          <ul>
            {demoInfo.summary.map((...[summaryLine, summaryIndex]) => (
              <p
                dangerouslySetInnerHTML={{ __html: summaryLine }}
                key={summaryIndex}
              />
            ))}
          </ul>
        </div>
      )}
      <div className="bs-callout bs-callout-primary" id={styles.sourcesList}>
        <p>
          <strong>Sources:</strong>
        </p>
        <ul>
          {demoInfo.sources.map((...[source, sourceIndex]) => (
            <li key={sourceIndex}>
              <span className={styles.sourceNumber}>[{sourceIndex + 1}]</span>:{" "}
              <a href={source}>{source}</a>
            </li>
          ))}
        </ul>
      </div>
      {!!demoInfo.docs.length && (
        <div className="bs-callout bs-callout-secondary" id="docs">
          <p>
            <strong>Docs:</strong>
          </p>
          <div className={styles.tagCollection}>
            {demoInfo.docs.map((doc) => (
              <span className={styles.tag} key={doc[1]}>
                <a href={doc[1]} rel="noreferrer" target="_blank">
                  {doc[0]}
                </a>
              </span>
            ))}
          </div>
        </div>
      )}
      {!!demoInfo.dataFiles.length && (
        <div className="bs-callout bs-callout-warning" id={styles.dataList}>
          <p>
            <strong>Data files: </strong>
            {demoInfo.dataFiles.map((...[file, fileIndex]) => (
              <a
                href={`${ROOT_PATH}data/${demoInfo.category}/${demoInfo.key}/${file}`}
                key={fileIndex}
              >
                {file}
              </a>
            ))}
          </p>
        </div>
      )}
      <div className="bs-callout bs-callout-success" id="code">
        <p>
          <strong>Code:</strong>
        </p>
        <ul>
          {demoInfo.files.demoTS.map(
            (...[{ content, filePath }, fileIndex]) => (
              <li key={filePath}>
                <p>
                  <span className={styles.fileNameWrapper}>{filePath}</span>{" "}
                  <CodeInGH filePath={filePath} />{" "}
                  <CoverageReport filePath={filePath} />
                  {fileIndex === 0 && (
                    <>
                      <span> | </span>
                      <a
                        href={`https://github.com/igncp/demos/blob/main/${getDemoE2ETestFilePath(
                          demoInfo.key
                        )}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        E2E tests
                      </a>
                    </>
                  )}
                </p>
                <CodeFragment content={content} />
                <div className={styles.divisor} />
              </li>
            )
          )}
          <li>
            <p>
              <span className={styles.fileNameWrapper}>{pageFilePath}</span>{" "}
              <CodeInGH filePath={pageFilePath} />{" "}
              <CoverageReport filePath={pageFilePath} />
            </p>
            <CodeFragment content={demoInfo.files.page.content} />
            {!!demoInfo.files.demoCSS.length && (
              <div className={styles.divisor} />
            )}
          </li>
          {demoInfo.files.demoCSS.map(
            (...[{ content, filePath }, cssIndex]) => (
              <li key={filePath}>
                <p>
                  <span className={styles.fileNameWrapper}>{filePath}</span>{" "}
                  {(() => (
                    <CodeInGH filePath={filePath} />
                  ))()}
                </p>
                <CodeFragment content={content} />
                {cssIndex !== demoInfo.files.demoCSS.length - 1 && (
                  <div className={styles.divisor} />
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  )
}

export default FilesDetails
