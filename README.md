# Demos

[![Deploy to Github Pages](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml/badge.svg)](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml)

## Intro

Showcase of some client-side demos.

- Backend: It uses [Gatsby](https://www.gatsbyjs.com/) to generate static pages
- Frontend: The main library used is [D3](https://d3js.org/), using TypeScript and PostCSS
- New version: https://igncp.github.io/demos/
- [TypeScript coverage report](https://igncp.github.io/demos/coverage-ts)
- There are also smaller examples regarding SVG and others in a storybook:
    - https://igncp.github.io/demos/storybook
- Some unit tests for external dependencies like D3 for learning their usage better:
    - https://igncp.github.io/demos/testing
    - [src/pages/testing.tsx](./src/pages/testing.tsx)
- Version from 2016 using [CoffeeScript](https://coffeescript.org/) and [Sail.js](https://sailsjs.com/): 
    - http://igncp-demos.herokuapp.com/
    - [Github Branch](https://github.com/igncp/demos/tree/2016-version)

## Install

You need to have Node.js installed

- Download the repo
- Inside the demos: `npm install`
- To start the server `npm run develop`

## Roadmap

I've updated this repository after it was inactive for several years. The remaining steps for existing charts are:

1. [ ] Remove or change dependencies
    - [ ] Remove Bootstrap but keep same look and feel
1. [ ] Resolve TypeScript cases with `any`

## License

MIT
