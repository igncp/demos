import Prism from "prismjs"
// https://prismjs.com/#supported-languages
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-scss"
import "prismjs/components/prism-typescript"
import "prismjs/themes/prism-coy.css"
import React from "react"

import { DemoInfo } from "@/common"

const CodeInGH = ({ filePath }: { filePath: string }) => (
  <>
    <span>| </span>
    <a
      href={`https://github.com/igncp/demos/blob/main/src/${filePath}`}
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
      href={`https://igncp.github.io/demos/coverage-ts/files/src/${filePath}.html`}
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
        <div className="bs-callout bs-callout-info" id="notes">
          <p>
            <strong>Notes:</strong>
          </p>
          <ul>
            {demoInfo.notes.map((note, idx) => (
              <li dangerouslySetInnerHTML={{ __html: note }} key={idx} />
            ))}
          </ul>
        </div>
      )}
      {!!demoInfo.summary.length && (
        <div className="bs-callout bs-callout-summary" id="notes">
          <p>
            <strong>Implementation Summary:</strong>
          </p>
          <ul>
            {demoInfo.summary.map((note, idx) => (
              <p dangerouslySetInnerHTML={{ __html: note }} key={idx} />
            ))}
          </ul>
        </div>
      )}
      <div className="bs-callout bs-callout-primary" id="sources-list">
        <p>
          <strong>Sources:</strong>
        </p>
        <ul>
          {demoInfo.sources.map((source, index) => (
            <li key={index}>
              <span className="source-number">[{index + 1}]</span>:{" "}
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
          <ul>
            {demoInfo.docs.map((doc) => (
              <li
                key={doc[1]}
                style={{
                  border: "1px solid #157ad4",
                  borderRadius: 5,
                  display: "inline-block",
                  margin: 5,
                  padding: 5,
                }}
              >
                <a href={doc[1]} rel="noreferrer" target="_blank">
                  {doc[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!demoInfo.data.length && (
        <div className="bs-callout bs-callout-warning" id="data-list">
          <p>
            <strong>Data: </strong>
            {demoInfo.data.map((file, index) => (
              <a
                href={`${ROOT_PATH}data/${demoInfo.category}/${demoInfo.key}/${file}`}
                key={index}
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
          {demoInfo.files.demo.map(({ content, fileName }) => (
            <li key={fileName}>
              <p>
                {`${fileName}.ts`}{" "}
                {(() => {
                  const filePath = `demos/${demoInfo.key}/${fileName}.ts`

                  return (
                    <>
                      <CodeInGH filePath={filePath} />{" "}
                      <CoverageReport filePath={filePath} />
                    </>
                  )
                })()}
              </p>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      content,
                      Prism.languages.typescript,
                      "typescript"
                    ),
                  }}
                />
              </pre>
            </li>
          ))}
          <li>
            <p>
              {pageFilePath} <CodeInGH filePath={pageFilePath} />{" "}
              <CoverageReport filePath={pageFilePath} />
            </p>
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    demoInfo.files.page.content,
                    Prism.languages.jsx,
                    "jsx"
                  ),
                }}
              />
            </pre>
          </li>
          {demoInfo.files.cssModule && (
            <li>
              <p>
                {`${demoInfo.key}.module.css`}{" "}
                <CodeInGH
                  filePath={`demos/${demoInfo.key}/${demoInfo.key}.module.css`}
                />
              </p>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      demoInfo.files.cssModule,
                      Prism.languages.scss,
                      "scss"
                    ),
                  }}
                />
              </pre>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default FilesDetails
