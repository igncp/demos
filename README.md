# Demos

[![Deploy to Github Pages](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml/badge.svg)](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml)

Showcase of responsive data visualization demos.

https://igncp.github.io/demos/

## Summary

- It uses [Gatsby](https://www.gatsbyjs.com/) with [React](https://reactjs.org/) to generate static HTML pages without the need for a server
- The main libraries are [D3](https://d3js.org/) and [Three.js](https://threejs.org/), using [TypeScript](https://www.typescriptlang.org/) and [PostCSS](https://postcss.org/)
- Each demo has links to the reference implementation, the raw data (normally in JSON, CSV or TSV), and related documentations
- There are some demos using [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics), [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) and [WebGL](https://get.webgl.org/) in a [Storybook](https://storybook.js.org/) build:
    - https://igncp.github.io/demos/storybook
    - They explore mostly web UI APIs or libraries without focusing in building a complete visualization
- TypeScript coverage report:
    - https://igncp.github.io/demos/coverage-ts
    - The coverage is relatively high and there is a minimum threshold of 95% for the whole project
    - Type-checking is required in the CI so there are no TypeScript errors but in a few cases it uses `any`
- Tests reports:
    - [Unit and functional tests report](https://igncp.github.io/demos/jest-report) using [Jest](https://jestjs.io/) ([jest.config.js](./jest.config.js))
    - [End-to-end tests report](https://igncp.github.io/demos/playwright-report) using [Playwright](https://playwright.dev) ([playwright.config.ts](./playwright.config.ts))
    - [In-browser unit tests page](https://igncp.github.io/demos/testing) for learning some dependencies with [QUnit](https://qunitjs.com/) ([page](./src/pages/testing.tsx))
- JS bundles analysis:
    - https://igncp.github.io/demos/bundles-sizes-report.html
- It has extensive tooling for the code, all run via [Github Actions](https://github.com/igncp/demos/actions):
    - [ESLint](https://eslint.org/) config: [.eslintrc.js](./.eslintrc.js)
    - [Prettier](https://prettier.io/) config: [.prettierrc](./.prettierrc)
    - [stylelint](https://stylelint.io/) config: [stylelint.config.js](./stylelint.config.js)
    - [ts-prune](https://github.com/nadeesha/ts-prune) script: [scripts/ts_prune.sh](scripts/ts_prune.sh)
    - [typed-css-modules](https://github.com/Quramy/typed-css-modules) script: [scripts/ts_css.sh](scripts/ts_css.sh)
- There is an [internal checklist](./research/charts-checklist.md) which aims to improve the quality and reusability of the charts
    - New charts should follow it completely but older charts (pre-2021) are still being updated to comply with it
    - The charts are in the process to become responsive
- Version from 2016 using [CoffeeScript](https://coffeescript.org/) and [Sail.js](https://sailsjs.com/): 
    - http://igncp-demos.herokuapp.com/
    - [Github Branch](https://github.com/igncp/demos/tree/2016-version)

## Install

You need to have Node.js installed

- Clone the repo
- Inside the repo directory, run: `npm install`
- To start the server `npm run develop`

## License

MIT
