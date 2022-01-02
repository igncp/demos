import React, { useState } from "react"

import useBrowserInitialWidth from "@/components/hooks/useBrowserInitialWidth"

import * as styles from "./styles/styles.module.css"

type Props = { content: string }

const CodeFragment = ({ content }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const browserWidth = useBrowserInitialWidth()

  if (browserWidth === null) {
    return null
  }

  if (!browserWidth || (browserWidth < 1280 && !isExpanded)) {
    return (
      <div className={styles.codeFragment}>
        <button
          className={`${styles.codeFragmentButton} btn btn-light`}
          onClick={() => setIsExpanded(true)}
          type="button"
        >
          Show Code
        </button>
      </div>
    )
  }

  return (
    <pre>
      <code
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </pre>
  )
}

export default CodeFragment
