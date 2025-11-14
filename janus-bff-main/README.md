# janus-bff

Janus Backend for Frontend (BFF) makes one or more API calls to an internal or third-party services (eg: CommerceTools) and provides interfacing API services for the Storefront ([janus-storefront](https://github.com/GracoInc/janus-storefront/tree/main))

This is a Next.js application leveraging app based routing and route handlers.

## Local setup

### Node JS

[Node JS LTS](https://nodejs.org/en/download)

### Package Manager

npm

## Getting Started

Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Lint your code

```bash
npm run lint
```

### Automatically fix lint issues

```bash
npm run lint:fix
```

### Run unit tests

```bash
npm run test
```

## Libraries and Dependencies

### Logging

[Pino](https://getpino.io/#/)

Example:

```javascript
import { logger } from "@/lib/logger";

try {
  ...
} catch (error: unknown) {
  logger.error(error.message, "An error occurred!");
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

### Unit tests

Unit tests are written with [Vitest](https://vitest.dev/). Unit tests should be
placed in the same folder as the code under test and follow the naming
convention of `*.test.{ts,tsx}`
