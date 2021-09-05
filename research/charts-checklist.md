# Charts Checklist

For new charts using data, they should cover most of these points

- They should be informative and self-explanatory
- They should have external links to explore further in certain topics
- It should be very clear what is the data: axis, units, context
    - Add this better in the chart itself rather than the notes
    - Use title, legends and modals for explaining content and interactions
- Add visual cues for all interactions: animations or other changes in CSS properties
- Format raw numbers (e.g. add commas, remove extra decimals, etc.)
- It should look professional

## Code requirements for new charts

- Improve naming of variables and functions
    - Avoid one-letter names: add them to the [restricted names list](../scripts/restrictedNames.js)
    - Avoid very generic names unless intentional for decoupling files
        - For example: 'data', 'content', 'parsed', diminutives
        - Inside reusable charts, the data names can be generic
- Add references to relevant documentations
- Add some personal description of the implementation, under the `docs` array in the info
- Use `import { foo, bar } from "baz"` instead of `import * as baz from "baz"` where possible
    - Except for styles imports where this is currently not practical
- Use arrow function except when `this` is used
- Remove mutations of original data
- Avoid circular structures on original data
- Use CSS modules which supports TypeScript
- Make charts reusable components:
    - Make the charts data-agnostic, and supply the data via config functions
    - Favor data properties over propery functions in the chart configuration, as long as the data is not mutated
    - Any interaction with extra page elements should be outside of the chart
    - Remove page's unnecessary classes: when used by style, add them by code
    - When selecting over classes globally (e.g. with tooltip), use CSS modules or uuids
    - Use advanced TS features: utility types, `as const`, string template types
    - Concerns are separated and not coupled, using generics:
        - Data models: no dependencies, fetches the data and exposes only an API to operate over the data, encapsulating the raw data structure. They maximize private and read-only structures.
        - Chart configuration: doesn't know about the models data internals, uses the model API to prepare the data expected by the chart
        - Chart rendering: is not coupled to a specific data type, uses generics and its configuration API for rendering the content
        - Application state: controls and settings, which are handled by the chart config and not the chart itself
        - File names should also reflect this limited knowledge of each file
- Move as static styles to the `.module.css` sheet inside classes
- Use new styling features, and document them, like filters, animations, svg, etc

## Future Requirements Under Consideration

- Be able to tear down and cleanup its content and other generated components
- They should update on window resize (at least complete rerender, losing state)
- They should look good on mobile device by using responsive units or rendering less data
