import fs from "fs"

import { getDemoE2ETestFilePath } from "@/utils/getDemoE2ETestFilePath"

const demos = fs.readdirSync("./src/demos")

// These tests are because there is a link in
// `src/components/files-details.tsx` for each demo pointing to the same name
// file in Github plus the extension.
test.each(demos)(
  "every demo has an e2e test: %s",
  (demoName) =>
    new Promise<void>((...[resolve, reject]) => {
      fs.access(
        `./${getDemoE2ETestFilePath(demoName)}`,
        fs.constants.F_OK,
        (err) => {
          try {
            expect(err).toBe(null)
            resolve()
          } catch (catchedErr) {
            reject(catchedErr)
          }
        }
      )
    })
)

// Because the only hosting is for gh-pages, don't differentiate between
// dependencies and devDependencies
test("there are no devDependencies", () =>
  new Promise<void>((...[resolve, reject]) => {
    fs.readFile("package.json", "utf-8", (...[err, content]) => {
      try {
        expect(err).toEqual(null)

        const jsonContent = JSON.parse(content)

        expect(jsonContent.devDependencies).toBe(undefined)
        resolve()
      } catch (catchedErr) {
        reject(catchedErr)
      }
    })
  }))
