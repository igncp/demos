# Demos

[![Deploy to Github Pages](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml/badge.svg)](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml)

Showcase of some client-side demos.

https://igncp.github.io/demos/

## Summary

- It uses [Gatsby](https://www.gatsbyjs.com/) with [React](https://reactjs.org/) to generate static HTML pages and bundle the JS files
- The main libraries used are [D3](https://d3js.org/) and [Three.js](https://threejs.org/), using TypeScript and PostCSS
- Each demo has links to the source implementations, the raw data (normally in JSON, CSV or TSV), and related documentations
- There are other demos using SVG, Canvas and [WebGL](https://get.webgl.org/) in a hosted [Storybook](https://storybook.js.org/):
    - https://igncp.github.io/demos/storybook
    - They explore mostly web UI features without focusing in data visualization
- TypeScript coverage report: https://igncp.github.io/demos/coverage-ts
    - The coverage is relatively high
    - There are no TypeScript errors but in some cases it uses `any`
- Some in-browser unit tests using [QUnit](https://qunitjs.com/) for learning the usage of third-party dependencies better:
    - https://igncp.github.io/demos/testing
    - [src/pages/testing.tsx](./src/pages/testing.tsx)
- Version from 2016 using [CoffeeScript](https://coffeescript.org/) and [Sail.js](https://sailsjs.com/): 
    - http://igncp-demos.herokuapp.com/
    - [Github Branch](https://github.com/igncp/demos/tree/2016-version)

## Install

You need to have Node.js installed

- Clone the repo
- Inside the repo directory, run: `npm install`
- To start the server `npm run develop`

## Roadmap

I've updated this repository after it was inactive for several years. The remaining steps for existing charts are:

1. [ ] Remove or change dependencies
    - [ ] Remove Bootstrap but keep same look and feel
1. [ ] Resolve TypeScript cases with `any`
1. [ ] Resolve as many `@typescript-eslint/no-use-before-define` errors by using generics

## License

MIT
