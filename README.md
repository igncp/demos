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
1. [ ] Refactor charts into components that can be configured and rendered multiple times on the same page
1. [ ] Upgrade all dependencies to latest version - this will take some time for D3 as several APIs changed
    - All global dependencies should be removed where possible and fetched by npm using the version
    - When necessary to use global dependencies, they should be requested from the script
1. [ ] Remove or change dependencies
    - [x] Remove Bower
    - [ ] Remove jQuery except for jQuery UI
    - [ ] Remove Angular and Bootstrap but keep same look and feel
1. [ ] Port styles to CSS with preprocessors (postcss)
1. [ ] Update the general UI framework (better support for responsive) but maintain the look and feel
1. [ ] Improve performance of some charts
1. [ ] Improve syntax highlighting
1. [ ] Add SEO meta tags
1. [ ] Add disclaimer for old charts
1. [ ] Port codebase to TypeScript with a high type coverage

Some new examples may be added at the same time, especially when more progress is done

## Intro

Showcase of some client-side demos.

- Backend: It uses Gatsby to generate static pages, and Stylus as CSS preprocessor
- Frontend: The main libraries used are D3, Raphäel, jQuery and Lodash
- New version: https://igncp.github.io/demos/
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

|Name|Ported to TS|Removed global dependencies|Reusable structure|
|:--:|:--:|:--:|:--:|
|area|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|bars|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|bars-3dimensional|No|No|No|
|bubbles|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|chord|No|No|No|
|circular-arcs|No|:white_check_mark:|:white_check_mark:|
|collapsible-tree|No|No|No|
|concentric-circles|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|fish-eye|No|No|No|
|force|No|No|No|
|icosahedron|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|map-distorsions|No|No|No|
|mareys-schedule|No|No|No|
|moving-line|No|No|No|
|multiline-voronoi|No|No|No|
|partition|No|No|No|
|pie|:white_check_mark:|:white_check_mark:|:white_check_mark:|
|spain-map|No|No|No|
|timeline|No|No|No|
|trend-line|No|No|No|
|vectors|No|No|No|
|weekly-heatmap|No|No|No|
|world-map|No|No|No|

## License

MIT
