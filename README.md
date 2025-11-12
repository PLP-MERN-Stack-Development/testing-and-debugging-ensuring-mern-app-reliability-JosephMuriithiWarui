# MERN Testing & Debugging Starter

Simple MERN project focused on reliable testing (unit/integration/E2E) and lightweight debugging patterns.

## Overview

This project provides:

- Server: Express API with basic CRUD for posts.
- Client: Minimal React component(s) with unit tests.
- Testing: Jest + React Testing Library (client), Jest + Supertest (server), optional Cypress E2E.
- Debugging: Express global error handler and a React Error Boundary.

## Tech Stack

- Node.js, Express
- React 18
- Jest, React Testing Library, Supertest
- (Optional) Cypress for E2E

## Project Structure

```
client/
  src/
    components/
      Button.jsx
      ErrorBoundary.jsx
    tests/
      unit/
        Button.test.jsx
      __mocks__/
        fileMock.js
  cypress/
    e2e/
      basic.cy.js

server/
  src/
    app.js
    models/
      Post.js
      User.js
    middleware/
      errorHandler.js
    utils/
      auth.js
  tests/
    setup.js
    integration/
      posts.test.js

jest.config.js
babel.config.js
package.json
```

## Setup

```
npm run install-all
```

If you are low on disk space, consider skipping E2E setup (Cypress) or install it later.

## Scripts

- `npm test` — run all tests for client and server.
- `npm run test:unit` — client unit tests only.
- `npm run test:integration` — server integration tests only.
- `npm run test:e2e` — run Cypress (headless). If Cypress isn’t installed, this will no-op.
- `npm run setup-test-db` — placeholder; server tests use an in-memory mock.

## Testing

- Client tests use jsdom with React Testing Library.
- Server tests are designed for Supertest; to keep things simple on low-resource systems, we stub Mongo in tests via lightweight in-memory mocks.

## Debugging

- Server: global error handler (`server/src/middleware/errorHandler.js`).
- Client: `ErrorBoundary.jsx` for catching render-time errors.
- Add targeted `console.error`/`console.log` while debugging; remove or gate them before shipping.

## Latest Test Results

```
PASS   client  client/src/tests/unit/Button.test.jsx (6.412 s)
  Button Component
    √ renders with default props (223 ms)
    √ renders with different variants (267 ms)
    √ renders with different sizes (81 ms)
    √ renders in disabled state (17 ms)
    √ calls onClick handler when clicked (117 ms)
    √ does not call onClick when disabled (42 ms)
    √ passes additional props to the button element (18 ms)
    √ accepts and applies custom className (9 ms)

------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |   88.88 |    71.42 |     100 |     100 |
 Button.jsx |   88.88 |    71.42 |     100 |     100 | 16-22
------------|---------|----------|---------|---------|-------------------
Test Suites: 1 failed, 1 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        12.905 s
Ran all test suites in 2 projects.
```

## Notes

- The server integration suite currently depends on lightweight test doubles to avoid MongoDB binary downloads. Swap to `mongodb-memory-server` or a real MongoDB instance if your environment has enough space and you want closer-to-real integration behavior.

