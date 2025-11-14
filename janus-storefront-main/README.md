# Janus Storefront

The Janus storefront is responsible for the experience layer customers buying product on Graco.com will interact with.
This is a Next.js project that leverages app based routing and server side rendering.

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

Start node.
```bash
npm run dev
```
Open [http://localhost:3000/gb/en](http://localhost:3000/gb/en) with your browser.

#### Start localhost in https
You can run your localhost in https mode using `npm run dev:https`. This will automatically generate a self-signed certificate on first run and may require admin priveledges on your device in order to do so. You can also change environment variables in your `.env` file in order to support secure cookies such as `COOKIE_SECURE=true`. Open [https://localhost:3000/gb/en](https://localhost:3000/gb/en) with your browser.


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

### Run integration tests

```bash
npm run test:e2e
```

### Run integration tests in UI mode for local validation

```bash
npm run test:ui
```

## Libraries and Dependencies

### Translations

[next-intl](https://next-intl.dev/)

Example:

```json
{
  "HomePage": {
    "key": "English"
  }
}
```

```javascript
locale: string = "en"
const t = await getTranslations({locale, namespace: "HomePage"});
t("key"); // value is returned for corresponding key, in this case "English"
```

### Logging

[Pino](https://getpino.io/#/)

Example:

```javascript
import {logger} from "@/lib/logger";

const formValid = await validateCsrfToken(formData);
logger.info({formValid: formValid}, "Was the form valid?");
```

### Unit tests

Unit tests are written with [Vitest](https://vitest.dev/). Unit tests should be placed in the same folder as the code
under test and follow the naming convention of `*.test.{ts,tsx}`

### Integration tests

Integration tests are written with [Playwright](https://playwright.dev/). Tests should be placed in the tests folder and
must follow the naming convention of `*.spec.ts`.

## Docker

You can use docker to build a standalone image for janus, or docker compose.

### Build

```bash
docker build -t graco/janus .
```

### Compose

```bash
docker compose up
```

### Deploys

Deploys to dev and qa kick off whenever code is merged into main. A [release candidate tag](https://github.com/GracoInc/janus-storefront/tags) is created such as `0.4.4-rc.3` and the workflow sits waiting for approval before being deployed to ECR and a force redeploy of ECS occurs. FYI, the deploy likely continues for less than a minute more after the workflow says it's complete.
