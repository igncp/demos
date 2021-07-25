# Demos

[![Deploy to Github Pages](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml/badge.svg)](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml)

## Intro

Showcase of some client-side demos.

- Backend: It uses Gatsby to generate static pages, with Stylus and PostCSS as CSS compilers
- Frontend: The main libraries used are D3 and Raphäel
- New version: https://igncp.github.io/demos/
- [TypeScript coverage report](https://igncp.github.io/demos/coverage-ts)
- Testing page:
    - Some unit tests for external dependencies like D3 for learning their usage better
    - https://igncp.github.io/demos/testing
    - [src/pages/testing.js](./src/pages/testing.js)
- Version from 2016 using CoffeeScript and Sail.js: 
    - http://igncp-demos.herokuapp.com/
    - [Github Branch](https://github.com/igncp/demos/tree/2016-version)

## Install

You need to have Node.js installed

- Download the repo
- Inside the demos: `npm install`
- To start the server `npm run develop`

## Roadmap

I've updated this repository after it was inactive for several years. The remaining steps for existing charts are:

1. [ ] Style the 404 page
1. [ ] Remove or change dependencies
    - [ ] Remove Angular and Bootstrap but keep same look and feel
1. [ ] Port Stylus files to CSS files using PostCSS
    - Use `npm run print-styl`
1. [ ] Add disclaimer for old charts
1. [ ] Resolve TypeScript cases with `any`
1. [ ] Resolve TypeScript cases with `@ts-ignore`
1. [ ] Set the TypeScript threshold to 95%

## License

MIT
