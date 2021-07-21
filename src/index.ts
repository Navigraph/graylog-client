interface GraylogClientOptions {
  /** The endpoint to which the requests should be sent, including protocol. */
  server: string;
  /** The client from which the logs are sent. */
  source: string;
}

type StatusCallback = ({
  status,
  statusText,
}: {
  status: number;
  statusText: string;
}) => unknown;

interface Gelf {
  version?: string;
  host?: string;
  short_message: string;
  level: number;
}

enum Level {
  emergency,
  alert,
  critical,
  error,
  warning,
  notice,
  info,
  debug,
}

// prettier-ignore
export default class GraylogClient<ExtrasType = {}> {
  public server: string;
  public source: string;

  constructor(_options: GraylogClientOptions) {
    if(!_options || !_options.server || !_options.source) {
      throw Error("GraylogClient was instantiated with insufficient parameters.")
    }

    this.server = _options.server;
    this.source = _options.source;
  }

  private get defaultProperties() {
    return { version: '1.1', host: this.source };
  }

  private sendRequest(gelf: Gelf, callback?: StatusCallback) {
    return fetch(this.server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...this.defaultProperties, ...gelf }),
    })
      .then(response => {
        if (!response.ok) throw Error('An error occured while sending a log to Graylog: ' + response.statusText);
        return response;
      })
      .then(response => {
        const { status, statusText } = response;
        callback && callback({ status, statusText });
        return response;
      })
      .catch((err: Error) => {
        console.error(err.stack);
      });
  }
  /** Sends a log with emergency (level 0) severity. */
  emergency(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.emergency, ...extras });
  }
  /** Sends a log with alert (level 1) severity. */
  alert(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.alert, ...extras });
  }
  /** Sends a log with critical (level 2) severity. */
  critical(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.critical, ...extras });
  }
  /** Sends a log with error (level 3) severity. */
  error(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.error, ...extras });
  }
  /** Sends a log with warning (level 4) severity. */
  warning(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.warning, ...extras });
  }
  /** Sends a log with notice (level 5) severity. */
  notice(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.notice, ...extras });
  }
  /** Sends a log with info (level 6) severity. */
  info(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.info, ...extras });
  }
  /** Sends a log with debug (level 7) severity. */
  debug(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.debug, ...extras });
  }
}
