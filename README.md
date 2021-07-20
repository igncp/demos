# Demos

[![Deploy to Github Pages](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml/badge.svg)](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml)

## New Roadmap

I am updating this repository after it was inactive for several years. The initial planned improvements are:

1. [x] Add a CI that checks linting, static types and unit tests
1. [x] Port all examples from CoffeeScript into JavaScript
1. [x] Move from Sails.js hosted in Heroku to a static Gatsby site hosted in Github pages
    - [x] Support loading different scripts per demo
    - [ ] Setup 404 page
1. [x] Implement strict rules in ESLint for all the code
1. [ ] Improve syntax highlighting
    - [x] Use PrismJS 
    - [ ] Research if using AST / TreeSitter is possible
    - [ ] Try SSR if possible
1. [ ] Upgrade all dependencies to latest version - this will take some time for D3 as several APIs changed
    - All global dependencies should be removed where possible and fetched by npm using the version
    - When necessary to use global dependencies, they should be requested from the script
1. [ ] Remove or change dependencies
    - [x] Remove Bower
    - [ ] Remove Lodash except complex methods
    - [ ] Remove jQuery
        - Normal usage: `ag '\$\(' src/demos`
        - Tooltip
        - jQuery UI
    - [ ] Remove Angular and Bootstrap but keep same look and feel
1. [ ] Reusable components:
    - Any interaction with extra page elements should be in the main function
    - Remove page's unnecessary classes: when used by style, add them by code
    - Separate data fetching (at the top) from the chart rendering
    - Future: use any selector, insted just id
1. [ ] Add CSS modules, preferably with stylus
1. [ ] Update the general UI framework (better support for responsive) but maintain the look and feel
1. [ ] Improve performance of some charts
1. [ ] Add SEO meta tags
1. [ ] Add disclaimer for old charts
1. [ ] Port codebase to TypeScript with a high type coverage
    - [x] Generate report and hosted along with the pages
    - [x] Port components, pages and other utils
    - [ ] Resolve cases with `any`
    - [ ] Resolve cases with `@ts-ignore`
    - [ ] Set the threshold to 95% and then to 99%
1. [x] Remove the usage of d3utils, even if it creates duplication in charts
1. [ ] Extra refactors:
    - Extract texts, some dimensions and state (`let` usage) into explicit variables
    - Improve naming of variables and functions, avoiding one-letter or very generic names
    - Add references to relevant documentations
    - Add some personal description of the implementation
    - Use `import { foo, bar } from "baz"` instead of `import * as baz from "baz"` where possible
    - Use arrow function except when `this` is used
    - Remove unnecessary `String(...)`
    - Future: remove mutations of original data
    - Future: avoid circular structures on original data

Some new examples may be added at the same time, especially when more progress is done

## Intro

Showcase of some client-side demos.

- Backend: It uses Gatsby to generate static pages, and Stylus as CSS preprocessor
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

## Refactoring Progress

|Name|Reusable structure|Docs|Extra Refactors|
|:--:|:--:|:--:|:--:|
|area|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|bars|:white_check_mark:|No|No|
|bars-3dimensional|:white_check_mark:|No|No|
|bubbles|:white_check_mark:|No|No|
|chord|:white_check_mark:|No|No|
|circular-arcs|:white_check_mark:|No|No|
|collapsible-tree|:white_check_mark:|No|No|
|concentric-circles|:white_check_mark:|No|No|
|fish-eye|:white_check_mark:|No|No|
|force|:white_check_mark:|No|No|
|icosahedron|:white_check_mark:|No|No|
|map-distorsions|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|mareys-schedule|:white_check_mark:|No|No|
|moving-line|:white_check_mark:|No|No|
|multiline-voronoi|:white_check_mark:|No|:white_check_mark:|
|partition|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|pie|:white_check_mark:|No|No|
|spain-map|:white_check_mark:|No|No|
|timeline|:white_check_mark:|No|No|
|trend-line|:white_check_mark:|No|No|
|vectors|No|No|No|
|weekly-heatmap|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|world-map|:white_check_mark:|No|No|

## License

MIT
