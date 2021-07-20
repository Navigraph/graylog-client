interface GraylogClientOptions {
  server: string;
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
export default class GraylogClient<ExtrasType = { [key: string] : string }> {
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

  emergency(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.emergency, ...extras });
  }
  alert(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.alert, ...extras });
  }
  critical(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.critical, ...extras });
  }
  error(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.error, ...extras });
  }
  warning(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.warning, ...extras });
  }
  notice(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.notice, ...extras });
  }
  info(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.info, ...extras });
  }
  debug(message: string, extras?: ExtrasType) {
    return this.sendRequest({ short_message: message, level: Level.debug, ...extras });
  }
}
