# Demos

[![Deploy to Github Pages](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml/badge.svg)](https://github.com/igncp/demos/actions/workflows/deploy-to-ghpages.yml)

## New Roadmap

I am updating this repository after it was inactive for several years. The initial planned improvements are:

1. [x] Add a CI that checks linting, static types and unit tests
1. [x] Port all examples to JavaScript from CoffeeScript
1. [x] Move from Sails.js hosted in Heroku to a static Gatsby site hosted in Github pages
    - [x] Support loading different scripts per demo
    - [ ] Setup 404 page
1. [x] Implement strict rules in ESLint for all the code
1. [ ] Refactor charts into components that can be configured and rendered multiple times on the same page
1. [ ] Upgrade all dependencies to latest version - this will take some time for D3 as several APIs changed
    - All global dependencies should be removed and fetched by npm using the version
1. [ ] Remove or change dependencies
    - Remove: Bower, jQuery
1. [ ] Port styles to CSS with preprocessors (postcss)
1. [ ] Update the general UI framework (better support for responsive) but maintain the look and feel
1. [ ] Improve performance of some charts
1. [ ] Add disclaimer for old charts
1. [ ] Port all examples to TypeScript with a high type coverage

Some new examples may be added at the same time, especially when more progress is done

## Intro

Showcase of some client-side demos.

- Backend: It uses Gatsby to generate static pages. and Stylus as CSS preprocessor
- Frontend: The main libraries used are D3, Raphäel, jQuery and Lodash
- New version: https://igncp.github.io/demos/
- Testing page:
    - Some unit tests for external pages for learning their usage better
    - https://igncp.github.io/demos/testing
    - [src/pages/testing.js](./src/pages/testing.js)
- First version from 2016: http://igncp-demos.herokuapp.com/

## Install

You need to have Node.js installed

- Download the repo
- Inside the demos: `npm install`
- To start the server `npm run develop`

## License

MIT
