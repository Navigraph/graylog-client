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

## Constructor

| Property | Type   | Description                                                            | Required |
| -------- | ------ | ---------------------------------------------------------------------- | -------- |
| server   | string | The endpoint to which the requests should be sent, including protocol. | yes      |
| source   | string | The client from which the logs are sent.                               | yes      |

### Typescript

If typescript is used, an optional type generic may be passed to the constructor. This can be used to type the extra information sent with each request (see the [Advanced Example](#advanced) for an example implementation), but is not required.

## Available methods

The `GraylogClient` contains multiple convenience methods mapping directly towards syslog's [severity levels](https://en.wikipedia.org/wiki/Syslog#Severity_level).

| Method    | Severity      | Description                       | Condition                                                                                                                                                           |
| --------- | ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| emergency | Emergency     | System is unusable                | A panic condition. [[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)                                                                     |
| alert     | Alert         | Action must be taken immediately  | A condition that should be corrected immediately, such as a corrupted system database. [[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html) |
| critical  | Critical      | Critical conditions               | Hard device errors. [[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)                                                                    |
| error     | Error         | Error conditions                  |                                                                                                                                                                     |
| warning   | Warning       | Warning conditions                |                                                                                                                                                                     |
| notice    | Notice        | Normal but significant conditions | Conditions that are not error conditions, but that may require special handling. [[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)       |
| info      | Informational | Informational messages            |                                                                                                                                                                     |
| debug     | Debug         | Debug-level messages              | Messages that contain information normally of use only when debugging a program. [[1]](https://pubs.opengroup.org/onlinepubs/009695399/functions/syslog.html)       |

Each method may be called with two parameters in accordance with the specification below.

| Parameter | Type   | Description                                                                                                                                          | Required |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| message   | string | The short (summary) message to display in Graylog.                                                                                                   | yes      |
| extras    | object | Any extra information, not including the source client. This object may be typed using a generic in the constructor, see [Constructor](#typescript). | no       |

## Contributing

For guidelines and useful information, please see [CONTRIBUTING.md](https://github.com/Navigraph/graylog-client/blob/master/CONTRIBUTING.md)

## License

[MIT](https://github.com/Navigraph/graylog-client/blob/master/LICENSE)
