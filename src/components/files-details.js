import React, { useEffect } from "react"

const FilesDetails = ({ demoInfo }) => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    hljs.initHighlightingOnLoad()
  }, [])

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
          {demoInfo.files.js && (
            <li>
              <p>{`${demoInfo.key}.js`}</p>
              <pre>
                <code className="javascript">{demoInfo.files.js}</code>
              </pre>
            </li>
          )}
          {demoInfo.files.ts && (
            <li>
              <p>{`${demoInfo.key}.ts`}</p>
              <pre>
                <code className="typescript">{demoInfo.files.ts}</code>
              </pre>
            </li>
          )}
          <li>
            <p>{`pages/${demoInfo.category}/${demoInfo.key}.js`}</p>
            <pre>
              <code className="javascript">{demoInfo.files.page}</code>
            </pre>
          </li>
          {demoInfo.files.styl && (
            <li>
              <p>{`${demoInfo.key}.styl`}</p>
              <pre>
                <code>{demoInfo.files.styl}</code>
              </pre>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default FilesDetails
