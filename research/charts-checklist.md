# Charts Checklist

For new charts using data, they should cover most of these points

- They should be informative and self-explanatory
- They should have links to explore further in certain topics
- It should be very clear what is the data: axis, units, context
    - Add this better in the chart itself rather than the notes
    - Use title, legends and modals for explaining content and interactions
- Add visual cues for all interactions: animations or change in properties
- Format raw numbers (e.g. add commas, remove extra decimals, etc.)
- They should update on window resize (at least complete rerender, losing state)
- They should look good on mobile device by using responsive units or rendering less data

## Code requirements for new charts

- Extract texts, some dimensions and state (`let` usage) into explicit variables
- Separate mathematics / simulation logic from UI logic
- Improve naming of variables and functions
    - Avoid one-letter names
    - Avoid very generic names
        - For example: 'data', 'content', 'parsed', diminutives
- Add references to relevant documentations
- Add some personal description of the implementation, under the `docs` array in the info
- Use `import { foo, bar } from "baz"` instead of `import * as baz from "baz"` where possible
    - Except for styles imports where this is currently not practical
- Use arrow function except when `this` is used
- Remove mutations of original data
- Avoid circular structures on original data
- Use CSS modules which supports TypeScript
- Make charts reusable components:
    - Any interaction with extra page elements should be in the main function
    - Remove page's unnecessary classes: when used by style, add them by code
    - Separate data fetching from the chart rendering
- Move as many styles as possible to the `.styl` sheet inside classes
