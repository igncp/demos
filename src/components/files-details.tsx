import React from "react"

// @ts-ignore
import Prism from "prismjs"

import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-stylus"

import "prismjs/themes/prism-solarizedlight.css"

import { DemoInfo } from "@/common"

type Props = {
  demoInfo: DemoInfo
}

const FilesDetails = ({ demoInfo }: Props) => {
  if (typeof window === "undefined") {
    return null
  }

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
          <li>
            <p>{`${demoInfo.key}.${demoInfo.files.demo.type}`}</p>
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    demoInfo.files.demo.content,
                    demoInfo.files.demo.type === "ts"
                      ? Prism.languages.typescript
                      : Prism.languages.jsx,
                    demoInfo.files.demo.type === "ts" ? "typescript" : "jsx"
                  ),
                }}
              />
            </pre>
          </li>
          {demoInfo.files.d3utils && (
            <li>
              <p>d3utils.js</p>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      demoInfo.files.d3utils,
                      Prism.languages.jsx,
                      "jsx"
                    ),
                  }}
                />
              </pre>
            </li>
          )}
          <li>
            <p>{`pages/${demoInfo.category}/${demoInfo.key}.${demoInfo.files.page.type}`}</p>
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    demoInfo.files.page.content,
                    demoInfo.files.page.type === "tsx"
                      ? Prism.languages.typescript
                      : Prism.languages.jsx,
                    demoInfo.files.demo.type === "tsx" ? "typescript" : "jsx"
                  ),
                }}
              />
            </pre>
          </li>
          {demoInfo.files.styl && (
            <li>
              <p>{`${demoInfo.key}.styl`}</p>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      demoInfo.files.styl,
                      Prism.languages.stylus
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
