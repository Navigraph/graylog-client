# graylog-client

This library was created in order to easily integrate Graylog into a JS client by handling the requests in GELF format for you.

## Requirements

In order to make use of the library, your Graylog instance needs to be configured to handle the [GELF HTTP input](https://docs.graylog.org/en/4.1/pages/sending/gelf.html#gelf-via-http).

## Installation

### Yarn

```bash
yarn add https://github.com/Navigraph/graylog-client.git
```

### NPM

```bash
npm install https://github.com/Navigraph/graylog-client.git
```

## Usage

### Simple

```tsx
import GraylogClient from 'graylog-client';

const glc = new GraylogClient({
  server: 'https://log.example.org',
  source: 'sample-app',
});

glc.info('An informative message.');
glc.warning('Something is about to happen!');
```

### Advanced

```tsx
import GraylogClient from 'graylog-client';

interface GraylogExtras {
  facility: string;
  stack: string;
}

const glc = new GraylogClient<GraylogExtras>({
  server: 'https://log.example.org',
  source: 'sample-app',
});

glc.error('An error ocurred in the pizza component!', {
  facility: 'Pizza',
  stack: '* stack trace *',
});
```

## Available methods

The `GraylogClient` contains multiple convenience methods mapping directly towards syslog's [severity levels](https://en.wikipedia.org/wiki/Syslog#Severity_level).

| Method    | Severity      | Description                       | Condition                                                                                                                                                          |
| --------- | ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| emergency | Emergency     | System is unusable                | A panic condition.[[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)                                                                     |
| alert     | Alert         | Action must be taken immediately  | A condition that should be corrected immediately, such as a corrupted system database.[[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html) |
| critical  | Critical      | Critical conditions               | Hard device errors.[[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)                                                                    |
| error     | Error         | Error conditions                  |                                                                                                                                                                    |
| warning   | Warning       | Warning conditions                |                                                                                                                                                                    |
| notice    | Notice        | Normal but significant conditions | Conditions that are not error conditions, but that may require special handling.[[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)       |
| info      | Informational | Informational messages            |                                                                                                                                                                    |
| debug     | Debug         | Debug-level messages              | Messages that contain information normally of use only when debugging a program.[[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)       |

## Commands

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality will be set up using `prettier`, `husky`, and `lint-staged`.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Rollup

This project uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `jsx`.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix

## Optimizations

You can do development-only optimizations by using the `__DEV__` global variable.

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.
