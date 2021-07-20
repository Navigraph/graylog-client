import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
import GraylogClient from '../src/index';

describe('Graylog client', () => {
  beforeEach(() => {
    fetchMock.doMock();
  });

  it('given a server and source, when making a request using a method, should make a valid request', () => {
    fetchMock.mockResponseOnce('', { status: 202, statusText: 'Accepted' });

    const expectedRequest = [
      'log.testserver.com',
      {
        body:
          '{"version":"1.1","host":"jest","short_message":"Test log message","level":6}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
    ];

    const glc = new GraylogClient({
      server: 'log.testserver.com',
      source: 'jest',
    });
    glc.info('Test log message');

    expect(fetchMock.mock.calls[0]).toEqual(expectedRequest);
  });

  it('given a server and source, when making a request using a method and the status is bad, should log an error', async () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => 'overriden');

    fetchMock.mockResponseOnce('', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    const glc = new GraylogClient({
      server: 'log.testserver.com',
      source: 'jest',
    });

    await glc.info('Another test log message');

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'An error occured while sending a log to Graylog: Internal Server Error'
      )
    );
  });

  it('given insufficient constructor parameters, when instantiating, should throw an error', () => {
    expect(() => {
      // @ts-ignore
      const glc = new GraylogClient();
    }).toThrowError(
      'GraylogClient was instantiated with insufficient parameters.'
    );
  });
});
